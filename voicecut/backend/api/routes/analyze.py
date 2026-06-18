"""
Analyze route — POST /api/analyze/{project_id}
Streams pipeline progress as Server-Sent Events (SSE).

Changed from GET to POST so settings (including initial_prompt)
are sent in the request body instead of URL query params.
Frontend uses fetch() + ReadableStream instead of EventSource.
"""
from __future__ import annotations
import asyncio
import json
import logging
from pathlib import Path
from typing import AsyncGenerator, Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from voicecut.shared.models import ProjectSettings, ProjectStatus
from voicecut.backend.db.database import load_project, save_project
from voicecut.backend.pipeline.processor import PipelineProcessor
from voicecut.monitoring.metrics import metrics
from voicecut.monitoring.logging_config import project_id_var
from voicecut.integrations.llm_adapter import LLMAdapter

router = APIRouter()
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent.parent.parent
UPLOADS_DIR = BASE_DIR / "data" / "uploads"
EXPORTS_DIR = BASE_DIR / "data" / "exports"

# Semaphore: one analysis at a time (GPU memory constraint)
_analyze_semaphore = asyncio.Semaphore(1)

# ---------------------------------------------------------------------------
# Request schema
# ---------------------------------------------------------------------------

class AnalyzeSettings(BaseModel):
    whisper_model: Optional[str] = None
    min_gap_duration: Optional[float] = None
    language: Optional[str] = None
    initial_prompt: Optional[str] = None  # stays in request body, never in URL


@router.post("/analyze/{project_id}")
async def analyze_project(
    project_id: str,
    settings: AnalyzeSettings = AnalyzeSettings(),
):
    """
    Start the analysis pipeline for a project.

    Accepts settings as a JSON POST body (initial_prompt is never logged in URLs).
    Returns a Server-Sent Events stream with pipeline progress.
    Frontend should use fetch() with ReadableStream instead of EventSource.

    Events:
      - { event: "step",     data: { step, message, percent } }
      - { event: "progress", data: { percent, message } }
      - { event: "complete", data: { project_id, cuts_count, ... } }
      - { event: "error",    data: { message } }
    """
    project_id_var.set(project_id)

    project = await asyncio.to_thread(load_project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    if project.status == ProjectStatus.ANALYZING:
        raise HTTPException(status_code=409, detail="Analysis already in progress")

    if not project.video_path or not Path(project.video_path).exists():
        raise HTTPException(status_code=400, detail="Video file not found")

    # Apply custom settings if provided
    if settings.whisper_model:
        project.settings.whisper_model = settings.whisper_model
    if settings.min_gap_duration is not None:
        project.settings.min_gap_duration = settings.min_gap_duration
    if settings.language is not None:
        project.settings.language = settings.language
    if settings.initial_prompt is not None:
        project.settings.initial_prompt = settings.initial_prompt

    # Event queue for SSE
    queue: asyncio.Queue = asyncio.Queue()
    
    metrics.pipeline_start(
        project_id, 
        project.settings.whisper_model or "small", 
        project.settings.language
    )

    def on_event(event_type: str, data: dict):
        queue.put_nowait({"event": event_type, "data": data})

    async def run_pipeline():
        async with _analyze_semaphore:
            processor = PipelineProcessor(
                uploads_dir=UPLOADS_DIR,
                exports_dir=EXPORTS_DIR,
                settings=project.settings,
            )
            updated = await processor.process(project, on_event)
            await asyncio.to_thread(save_project, updated)
        queue.put_nowait(None)  # sentinel to stop streaming

    async def event_generator() -> AsyncGenerator[str, None]:
        # Start pipeline in background
        task = asyncio.create_task(run_pipeline())

        try:
            while True:
                try:
                    item = await asyncio.wait_for(queue.get(), timeout=60.0)
                except asyncio.TimeoutError:
                    # Heartbeat to keep connection alive
                    yield ": heartbeat\n\n"
                    continue

                if item is None:
                    # Pipeline done
                    yield "event: done\ndata: {}\n\n"
                    break

                event_type = item["event"]
                data_str = json.dumps(item["data"])
                yield f"event: {event_type}\ndata: {data_str}\n\n"

                if event_type == "complete":
                    metrics.pipeline_complete(project_id, item["data"].get("cuts_count", 0), 0)
                    break
                elif event_type == "error":
                    metrics.pipeline_error(project_id, item["data"].get("message", "Unknown error"))
                    break
        finally:
            if not task.done():
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )

class ChapterRequest(BaseModel):
    model_name: str = "gemini/gemini-2.5-flash"
    api_key: Optional[str] = None

@router.post("/analyze/{project_id}/chapters/generate")
async def generate_chapters(project_id: str, request: ChapterRequest = ChapterRequest()):
    project_id_var.set(project_id)
    project = await asyncio.to_thread(load_project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    if not project.transcript_segments:
        raise HTTPException(status_code=400, detail="No transcript available to generate chapters.")

    adapter = LLMAdapter(model_name=request.model_name, api_key=request.api_key)
    chapters = await asyncio.to_thread(adapter.generate_chapters, project.transcript_segments)
    
    project.chapters = chapters
    await asyncio.to_thread(save_project, project)
    
    return {"chapters": [c.model_dump() for c in chapters]}
