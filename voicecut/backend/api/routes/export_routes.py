"""Export route — GET /api/export/{project_id}"""
from __future__ import annotations
import asyncio
import json
import logging
import subprocess
from pathlib import Path
from typing import AsyncGenerator, Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse, FileResponse

from voicecut.shared.models import ExportRequest, ExportFormat, ProjectStatus
from voicecut.backend.db.database import load_project, save_project
from voicecut.backend.export.renderer import VideoRenderer

router = APIRouter()
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent.parent.parent
EXPORTS_DIR = BASE_DIR / "data" / "exports"


def _get_video_dimensions(video_path: str) -> tuple[int, int]:
    """Return (width, height) of video via ffprobe."""
    try:
        result = subprocess.run(
            [
                "ffprobe", "-v", "quiet",
                "-select_streams", "v:0",
                "-show_entries", "stream=width,height",
                "-print_format", "json",
                video_path,
            ],
            capture_output=True, text=True, check=True,
        )
        data = json.loads(result.stdout)
        stream = data["streams"][0]
        return int(stream["width"]), int(stream["height"])
    except Exception:
        return 1920, 1080  # fallback


@router.get("/projects/{project_id}/video-info")
async def get_video_info(project_id: str):
    """Return original video resolution (width, height)."""
    project = load_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not project.video_path:
        raise HTTPException(status_code=400, detail="No video attached")
    w, h = _get_video_dimensions(project.video_path)
    return {"width": w, "height": h}


@router.get("/export/{project_id}")
async def export_project(
    project_id: str,
    resolution: Optional[str] = Query(None, description="Output resolution: e.g. '2160p','1080p','720p','480p'. Defaults to original."),
    request: ExportRequest | None = None,
):
    """
    Render and export the final edited video.
    Streams progress as SSE.
    
    Returns SSE events then a JSON with file URLs.
    """
    project = load_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.status != ProjectStatus.READY:
        raise HTTPException(
            status_code=400,
            detail=f"Project is not ready for export (status: {project.status})"
        )

    formats = (request.formats if request else None) or [ExportFormat.MP4]

    queue: asyncio.Queue = asyncio.Queue()

    def on_event(event_type: str, data: dict):
        queue.put_nowait({"event": event_type, "data": data})

    async def run_export():
        project.status = ProjectStatus.EXPORTING
        save_project(project)
        try:
            renderer = VideoRenderer(EXPORTS_DIR)
            results = await renderer.render(project, formats, on_event, resolution=resolution)
            project.output_path = results.get("mp4")
            project.status = ProjectStatus.READY
            save_project(project)
            queue.put_nowait({"event": "files", "data": results})
        except Exception as e:
            logger.exception(f"Export failed for {project_id}")
            project.status = ProjectStatus.ERROR
            project.error_message = str(e)
            save_project(project)
            queue.put_nowait({"event": "error", "data": {"message": str(e)}})
        finally:
            queue.put_nowait(None)

    async def event_generator() -> AsyncGenerator[str, None]:
        task = asyncio.create_task(run_export())
        try:
            while True:
                try:
                    item = await asyncio.wait_for(queue.get(), timeout=120.0)
                except asyncio.TimeoutError:
                    yield ": heartbeat\n\n"
                    continue

                if item is None:
                    yield "event: done\ndata: {}\n\n"
                    break

                event_type = item["event"]
                data_str = json.dumps(item["data"])
                yield f"event: {event_type}\ndata: {data_str}\n\n"

                if event_type in ("files", "error"):
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


@router.get("/export/{project_id}/download/{filename}")
async def download_file(project_id: str, filename: str):
    """Direct download of an exported file."""
    file_path = EXPORTS_DIR / project_id / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    # Security: ensure the path is within exports dir
    try:
        file_path.resolve().relative_to(EXPORTS_DIR.resolve())
    except ValueError:
        raise HTTPException(status_code=403, detail="Access denied")

    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type="application/octet-stream",
    )
