"""
VoiceCut — FastAPI Application
================================
Main entry point for the backend API.
Serves:
  POST /api/upload          — upload video
  POST /api/analyze/{id}    — stream analysis pipeline (SSE)
  GET  /api/projects        — list projects
  GET  /api/projects/{id}   — get project details
  PATCH /api/projects/{id}/decisions — update cut decisions
  POST /api/export/{id}     — render and export
  GET  /api/files/{...}     — serve output files
"""
import asyncio
import json
import logging
import os
import shutil
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse

from voicecut.backend.db.database import init_db
from voicecut.backend.api.routes import upload, analyze, projects, export_routes, viral_clips
from voicecut.monitoring.logging_config import setup_logging
from voicecut.monitoring.metrics import metrics
from voicecut.monitoring.middleware import TelemetryMiddleware

setup_logging("INFO", json_output=True)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Directory setup
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).parent.parent.parent
UPLOADS_DIR = BASE_DIR / "data" / "uploads"
EXPORTS_DIR = BASE_DIR / "data" / "exports"

for d in [UPLOADS_DIR, EXPORTS_DIR]:
    d.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# App lifecycle
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting VoiceCut backend...")
    init_db()
    yield
    logger.info("VoiceCut backend shutting down.")


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI(
    title="VoiceCut API",
    description="AI-powered speech-aware video editing backend",
    version="1.0.0",
    lifespan=lifespan,
)

# Add Request Telemetry Middleware (MUST be before CORS so it logs correctly)
app.add_middleware(TelemetryMiddleware)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# Request body size guard for non-upload routes (10MB ceiling)
_MAX_NON_UPLOAD_BODY = 10 * 1024 * 1024  # 10MB


@app.middleware("http")
async def limit_request_body(request: Request, call_next):
    """Reject unexpectedly large request bodies on non-upload endpoints."""
    if request.url.path != "/api/upload":
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > _MAX_NON_UPLOAD_BODY:
            return JSONResponse(
                status_code=413,
                content={"detail": "Request body too large"}
            )
    return await call_next(request)

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(projects.router, prefix="/api", tags=["projects"])
app.include_router(export_routes.router, prefix="/api", tags=["export"])
app.include_router(viral_clips.router, prefix="/api", tags=["viral_clips"])

# Serve exported files
if EXPORTS_DIR.exists():
    app.mount("/files/exports", StaticFiles(directory=str(EXPORTS_DIR)), name="exports")
if UPLOADS_DIR.exists():
    app.mount("/files/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "voicecut-api"}


@app.get("/health/detailed")
async def health_detailed():
    """Rich health endpoint with subsystem checks and metrics."""
    # DB check
    db_status = "ok"
    try:
        from voicecut.backend.db.database import get_session, ProjectRecord
        from sqlalchemy import select
        with get_session() as session:
            count = session.scalar(select(ProjectRecord.id))
    except Exception:
        db_status = "error"

    # Disk check
    uploads_sz = sum(f.stat().st_size for f in UPLOADS_DIR.rglob('*') if f.is_file()) if UPLOADS_DIR.exists() else 0
    exports_sz = sum(f.stat().st_size for f in EXPORTS_DIR.rglob('*') if f.is_file()) if EXPORTS_DIR.exists() else 0
    
    total, used, free = shutil.disk_usage(str(BASE_DIR))

    m = metrics.snapshot()
    pipeline_status = "degraded" if m["pipeline"]["error_rate_pct"] > 10 else "idle"
    if m["pipeline"]["active_count"] > 0:
        pipeline_status = "active"

    return {
        "status": "healthy" if db_status == "ok" else "degraded",
        "checks": {
            "database": {"status": db_status},
            "disk": {
                "status": "ok" if free > 5_000_000_000 else "warning",
                "uploads_gb": round(uploads_sz / 1e9, 2),
                "exports_gb": round(exports_sz / 1e9, 2),
                "free_gb": round(free / 1e9, 2)
            },
            "pipeline": {
                "status": pipeline_status,
                "active_runs": m["pipeline"]["active_count"]
            }
        },
        "metrics": m,
        "version": app.version
    }


@app.get("/api/metrics")
async def stream_metrics():
    """SSE endpoint pushing metrics snapshots every 5 seconds."""
    async def metrics_generator() -> AsyncGenerator[str, None]:
        while True:
            data = metrics.snapshot()
            yield f"data: {json.dumps(data)}\n\n"
            await asyncio.sleep(5)
            
    return StreamingResponse(
        metrics_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )


@app.get("/")
async def root():
    return {"message": "VoiceCut API — visit /docs for API documentation"}
