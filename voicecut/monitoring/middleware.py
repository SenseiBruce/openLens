"""
VoiceCut — Request Telemetry Middleware
=========================================
FastAPI middleware that:
  1. Generates a unique request_id (UUID4 short) for every HTTP request.
  2. Injects it into the contextvars so all log lines within the request
     automatically carry it.
  3. Logs a structured entry for every request/response with:
       - method, path, status_code, duration_ms, request_id
  4. Adds X-Request-ID response header so clients/curl can correlate.

Usage (in main.py):
    from voicecut.monitoring.middleware import TelemetryMiddleware
    app.add_middleware(TelemetryMiddleware)
"""
from __future__ import annotations
import logging
import time
import uuid

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from voicecut.monitoring.logging_config import request_id_var

logger = logging.getLogger("voicecut.telemetry")

# Paths to skip verbose request logging (heartbeat / static assets)
_SKIP_LOG_PATHS = frozenset({"/health", "/", "/docs", "/openapi.json", "/redoc"})


class TelemetryMiddleware(BaseHTTPMiddleware):
    """Adds request_id, timing, and structured request/response logging."""

    def __init__(self, app: ASGIApp) -> None:
        super().__init__(app)

    async def dispatch(self, request: Request, call_next) -> Response:
        # Generate short request ID (8 hex chars is enough for correlation)
        rid = uuid.uuid4().hex[:8]
        token = request_id_var.set(rid)

        start = time.monotonic()
        status_code = 500

        try:
            response = await call_next(request)
            status_code = response.status_code
        except Exception:
            raise
        finally:
            duration_ms = round((time.monotonic() - start) * 1000, 1)
            request_id_var.reset(token)

            path = request.url.path
            if path not in _SKIP_LOG_PATHS:
                logger.info(
                    f"{request.method} {path} → {status_code}",
                    extra={
                        "http_method": request.method,
                        "http_path": path,
                        "http_status": status_code,
                        "duration_ms": duration_ms,
                    },
                )

        # Attach request ID to response header for client-side correlation
        response.headers["X-Request-ID"] = rid
        return response
