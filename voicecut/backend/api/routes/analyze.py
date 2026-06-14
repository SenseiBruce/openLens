"""
Analyze route — POST /api/analyze/{project_id}
Streams pipeline progress as Server-Sent Events (SSE).
"""
from __future__ import annotations
import asyncio
import json
import logging
from pathlib import Path
from typing import AsyncGenerator

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from voicecut.shared.models import ProjectSettings, ProjectStatus
from voicecut.backend.db.database import load_project, save_project
from voicecut.backend.pipeline.processor import PipelineProcessor

router = APIRouter()
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent.parent.parent
UPLOADS_DIR = BASE_DIR / "data" / "uploads"
EXPORTS_DIR = BASE_DIR / "data" / "exports"


@router.get("/analyze/{project_id}")
async def analyze_project(project_id: str, settings: ProjectSettings | None = None):
    """
    Start the analysis pipeline for a project.
    
    Returns a Server-Sent Events stream with pipeline progress.
    Frontend should use EventSource or fetch with stream reading.
    
    Events:
      - { event: "step", data: { step, message, percent } }
      - { event: "progress", data: { percent, message } }
      - { event: "complete", data: { project_id, cuts_count, ... } }
      - { event: "error", data: { message } }
    """
    project = load_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    if project.status == ProjectStatus.ANALYZING:
        raise HTTPException(status_code=409, detail="Analysis already in progress")

    if not project.video_path or not Path(project.video_path).exists():
        raise HTTPException(status_code=400, detail="Video file not found")

    # Apply custom settings if provided
    if settings:
        project.settings = settings

    # Event queue for SSE
    queue: asyncio.Queue = asyncio.Queue()

    def on_event(event_type: str, data: dict):
        queue.put_nowait({"event": event_type, "data": data})

    async def run_pipeline():
        processor = PipelineProcessor(
            uploads_dir=UPLOADS_DIR,
            exports_dir=EXPORTS_DIR,
            settings=project.settings,
        )
        updated = await processor.process(project, on_event)
        save_project(updated)
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

                if event_type in ("complete", "error"):
                    break
        finally:
            if not task.done():
                task.cancel()

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
