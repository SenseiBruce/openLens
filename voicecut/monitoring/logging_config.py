"""
VoiceCut — Structured JSON Logging
====================================
Configures structlog to emit JSON lines with bound context
(request_id, project_id) for tracing a pipeline run.
"""
from __future__ import annotations

import logging
import sys
from contextvars import ContextVar

import structlog

# Kept for callers that still set stdlib context vars.
request_id_var: ContextVar[str] = ContextVar("request_id", default="")
project_id_var: ContextVar[str] = ContextVar("project_id", default="")


def setup_logging(level: str = "INFO", json_output: bool = True) -> None:
    """
    Configure structlog + stdlib logging for VoiceCut.

    Args:
        level: Log level string (INFO, DEBUG, WARNING, ERROR).
        json_output: If True, emit JSON. If False, use a readable key-value format.
    """
    log_level = getattr(logging, level.upper(), logging.INFO)
    shared_processors: list = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
    ]

    structlog.configure(
        processors=shared_processors,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    renderer = (
        structlog.processors.JSONRenderer()
        if json_output
        else structlog.dev.ConsoleRenderer()
    )
    formatter = structlog.stdlib.ProcessorFormatter(
        processors=[
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            renderer,
        ],
    )

    root = logging.getLogger()
    root.setLevel(log_level)
    root.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(log_level)
    handler.setFormatter(formatter)
    root.addHandler(handler)

    for noisy in ("uvicorn.access", "uvicorn.error", "httpx", "httpcore"):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    logging.getLogger("voicecut").setLevel(log_level)
