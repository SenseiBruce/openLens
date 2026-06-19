import logging
from pathlib import Path
from fastapi import APIRouter, HTTPException

from sqlalchemy import select
from voicecut.shared.models import Project, ViralClipRequest, ViralClipResponse, ViralClip
from voicecut.backend.db.database import load_project
from voicecut.backend.integrations.openrouter_client import OpenRouterClient
from voicecut.backend.export.renderer import VideoRenderer

logger = logging.getLogger(__name__)

router = APIRouter()

BASE_DIR = Path(__file__).parent.parent.parent.parent.parent
EXPORTS_DIR = BASE_DIR / "data" / "exports"

@router.post("/viral-clips/{project_id}", response_model=ViralClipResponse)
async def generate_viral_clips(project_id: str, request: ViralClipRequest):
    if project_id != request.project_id:
        raise HTTPException(status_code=400, detail="Path project_id does not match body project_id")

    project = load_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if not project.transcript_segments:
        raise HTTPException(status_code=400, detail="Project has no transcript. Run analysis first.")

    if not project.video_path:
        raise HTTPException(status_code=400, detail="Project has no video file.")

    # Prepare transcript text with timestamps for LLM
    transcript_text = ""
    for seg in project.transcript_segments:
        transcript_text += f"[{seg.start:.1f}s - {seg.end:.1f}s] {seg.text}\n"

    # Initialize client
    client = OpenRouterClient(api_key=request.openrouter_key)
    
    # Get viral clips from LLM
    try:
        raw_clips = await client.extract_viral_clips(transcript_text, request.target_length_seconds)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract clips from OpenRouter: {e}")

    if not raw_clips:
        raise HTTPException(status_code=500, detail="OpenRouter returned an empty or invalid response.")

    # Convert to ViralClip objects and render
    viral_clips = []
    renderer = VideoRenderer(exports_dir=EXPORTS_DIR)
    
    for c in raw_clips:
        try:
            vc = ViralClip(**c)
            # Ensure clip bounds are within video duration
            if project.video_duration:
                vc.start = max(0.0, vc.start)
                vc.end = min(project.video_duration, vc.end)
            
            # Render the clip
            rendered_path = await renderer.render_viral_clip(project, vc)
            
            # Map path to static file URL
            relative_path = rendered_path.relative_to(EXPORTS_DIR)
            vc.rendered_path = f"/files/exports/{relative_path.as_posix()}"
            viral_clips.append(vc)
        except Exception as e:
            logger.error(f"Failed to process/render clip {c}: {e}")
            continue

    return ViralClipResponse(project_id=project.id, clips=viral_clips)
