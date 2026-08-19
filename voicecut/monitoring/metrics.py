"""
VoiceCut — In-Process Metrics Store
======================================
Lightweight, zero-dependency metrics tracking.

Tracks:
  - Global counters (uploads, analyses, exports, errors)
  - Pipeline run history (last N runs with timing, model, status)
  - Export run history
  - Start timestamp for uptime calculation

Thread-safe via threading.Lock.
No external library required.
"""
from __future__ import annotations

import threading
import time
from collections import deque
from dataclasses import dataclass

# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass
class PipelineRun:
    project_id: str
    model: str
    language: str | None
    started_at: float          # time.monotonic()
    ended_at: float | None = None
    status: str = "running"    # "running" | "complete" | "error"
    error: str | None = None
    cuts_count: int = 0
    segments_count: int = 0

    @property
    def duration_s(self) -> float | None:
        if self.ended_at is None:
            return None
        return round(self.ended_at - self.started_at, 2)


@dataclass
class ExportRun:
    project_id: str
    formats: list[str]
    resolution: str | None
    started_at: float
    ended_at: float | None = None
    status: str = "running"
    error: str | None = None

    @property
    def duration_s(self) -> float | None:
        if self.ended_at is None:
            return None
        return round(self.ended_at - self.started_at, 2)


# ---------------------------------------------------------------------------
# Metrics Store
# ---------------------------------------------------------------------------

class MetricsStore:
    """
    Singleton in-process metrics store.
    All public methods are thread-safe.
    """

    _HISTORY_SIZE = 50  # rolling window for pipeline/export runs

    def __init__(self):
        self._lock = threading.Lock()
        self._started_at = time.time()   # wall-clock for uptime
        self._mono_start = time.monotonic()

        # Counters
        self._uploads: int = 0
        self._analyses: int = 0
        self._exports: int = 0
        self._errors: int = 0

        # Run histories (deques act as circular buffers)
        self._pipeline_runs: deque[PipelineRun] = deque(maxlen=self._HISTORY_SIZE)
        self._export_runs: deque[ExportRun] = deque(maxlen=self._HISTORY_SIZE)

        # Active run tracking (project_id → run object)
        self._active_pipelines: dict[str, PipelineRun] = {}
        self._active_exports: dict[str, ExportRun] = {}

    # ------------------------------------------------------------------
    # Upload tracking
    # ------------------------------------------------------------------

    def record_upload(self) -> None:
        with self._lock:
            self._uploads += 1

    # ------------------------------------------------------------------
    # Pipeline (analysis) tracking
    # ------------------------------------------------------------------

    def pipeline_start(self, project_id: str, model: str, language: str | None) -> PipelineRun:
        run = PipelineRun(
            project_id=project_id,
            model=model,
            language=language,
            started_at=time.monotonic(),
        )
        with self._lock:
            self._analyses += 1
            self._active_pipelines[project_id] = run
            self._pipeline_runs.append(run)
        return run

    def pipeline_complete(self, project_id: str, cuts_count: int = 0, segments_count: int = 0) -> None:
        with self._lock:
            run = self._active_pipelines.pop(project_id, None)
            if run:
                run.ended_at = time.monotonic()
                run.status = "complete"
                run.cuts_count = cuts_count
                run.segments_count = segments_count

    def pipeline_error(self, project_id: str, error: str) -> None:
        with self._lock:
            self._errors += 1
            run = self._active_pipelines.pop(project_id, None)
            if run:
                run.ended_at = time.monotonic()
                run.status = "error"
                run.error = error

    # ------------------------------------------------------------------
    # Export tracking
    # ------------------------------------------------------------------

    def export_start(self, project_id: str, formats: list[str], resolution: str | None) -> ExportRun:
        run = ExportRun(
            project_id=project_id,
            formats=formats,
            resolution=resolution,
            started_at=time.monotonic(),
        )
        with self._lock:
            self._exports += 1
            self._active_exports[project_id] = run
            self._export_runs.append(run)
        return run

    def export_complete(self, project_id: str) -> None:
        with self._lock:
            run = self._active_exports.pop(project_id, None)
            if run:
                run.ended_at = time.monotonic()
                run.status = "complete"

    def export_error(self, project_id: str, error: str) -> None:
        with self._lock:
            self._errors += 1
            run = self._active_exports.pop(project_id, None)
            if run:
                run.ended_at = time.monotonic()
                run.status = "error"
                run.error = error

    # ------------------------------------------------------------------
    # Snapshot (for /health/detailed and /api/metrics)
    # ------------------------------------------------------------------

    def snapshot(self) -> dict:
        with self._lock:
            completed_pipelines = [r for r in self._pipeline_runs if r.ended_at is not None]
            durations = [r.duration_s for r in completed_pipelines if r.duration_s is not None]
            avg_duration = round(sum(durations) / len(durations), 1) if durations else None

            total_runs = self._analyses
            error_rate = round((self._errors / total_runs * 100), 1) if total_runs > 0 else 0.0

            recent_runs = [
                {
                    "project_id": r.project_id,
                    "model": r.model,
                    "language": r.language,
                    "status": r.status,
                    "duration_s": r.duration_s,
                    "cuts_count": r.cuts_count,
                    "segments_count": r.segments_count,
                    "error": r.error,
                }
                for r in list(self._pipeline_runs)[-10:]  # last 10
            ]

            return {
                "uptime_s": round(time.monotonic() - self._mono_start, 0),
                "counters": {
                    "uploads": self._uploads,
                    "analyses": self._analyses,
                    "exports": self._exports,
                    "errors": self._errors,
                },
                "pipeline": {
                    "active_count": len(self._active_pipelines),
                    "avg_duration_s": avg_duration,
                    "error_rate_pct": error_rate,
                    "recent_runs": recent_runs,
                },
                "export": {
                    "active_count": len(self._active_exports),
                },
            }


# ---------------------------------------------------------------------------
# Module-level singleton
# ---------------------------------------------------------------------------

metrics = MetricsStore()
