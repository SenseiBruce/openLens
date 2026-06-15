"""Upload route — POST /api/upload"""
from __future__ import annotations
import shutil
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from voicecut.shared.models import Project, ProjectSettings, ProjectStatus
from voicecut.backend.db.database import save_project

router = APIRouter()

BASE_DIR = Path(__file__).parent.parent.parent.parent
UPLOADS_DIR = BASE_DIR / "data" / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v", ".flv"}
MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024 * 1024  # 8GB


@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """
    Upload a video file and create a new project.
    
    Returns:
        { project_id, filename, size_bytes }
    """
    # Validate extension
    suffix = Path(file.filename or "video.mp4").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{suffix}'. Supported: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    project_id = str(uuid.uuid4())
    project_dir = UPLOADS_DIR / project_id
    project_dir.mkdir(parents=True, exist_ok=True)

    # Sanitize filename
    safe_name = f"video{suffix}"
    dest_path = project_dir / safe_name

    # Stream to disk
    size = 0
    try:
        with open(dest_path, "wb") as f:
            while chunk := await file.read(1024 * 1024):  # 1MB chunks
                size += len(chunk)
                if size > MAX_FILE_SIZE_BYTES:
                    dest_path.unlink(missing_ok=True)
                    raise HTTPException(status_code=413, detail="File too large (max 8GB)")
                f.write(chunk)
    except HTTPException:
        raise
    except Exception as e:
        dest_path.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=f"Upload failed: {e}")

    # Create project
    now = datetime.utcnow().isoformat()
    project = Project(
        id=project_id,
        name=file.filename or "Untitled Video",
        video_path=str(dest_path),
        status=ProjectStatus.IDLE,
        settings=ProjectSettings(),
        created_at=now,
        updated_at=now,
    )
    save_project(project)

    return JSONResponse({
        "project_id": project_id,
        "filename": file.filename,
        "size_bytes": size,
        "video_path": str(dest_path),
    })
