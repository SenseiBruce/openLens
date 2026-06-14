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
from __future__ import annotations
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

from voicecut.backend.db.database import init_db
from voicecut.backend.api.routes import upload, analyze, projects, export_routes

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
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

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(projects.router, prefix="/api", tags=["projects"])
app.include_router(export_routes.router, prefix="/api", tags=["export"])

# Serve exported files
if EXPORTS_DIR.exists():
    app.mount("/files/exports", StaticFiles(directory=str(EXPORTS_DIR)), name="exports")
if UPLOADS_DIR.exists():
    app.mount("/files/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "voicecut-api"}


@app.get("/")
async def root():
    return {"message": "VoiceCut API — visit /docs for API documentation"}
