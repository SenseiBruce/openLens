"""
VoiceCut — Structured JSON Logging
====================================
Replaces basicConfig plain-text logging with structured JSON output.

Every log line is a valid JSON object:
    {"ts": "2026-06-18T02:00:01.123Z", "level": "INFO", "logger": "voicecut.api",
     "msg": "Analysis complete", "request_id": "xk9f", "project_id": "abc123",
     "duration_s": 14.3}

Context variables (request_id, project_id) are automatically injected from
contextvars — no need to pass them through every function call.
"""
from __future__ import annotations
import json
import logging
import sys
import time
from contextvars import ContextVar
from datetime import datetime, timezone
from typing import Optional

# ---------------------------------------------------------------------------
# Context variables — set per-request, auto-injected into log records
# ---------------------------------------------------------------------------

request_id_var: ContextVar[str] = ContextVar("request_id", default="")
project_id_var: ContextVar[str] = ContextVar("project_id", default="")


# ---------------------------------------------------------------------------
# JSON Formatter
# ---------------------------------------------------------------------------

class JSONFormatter(logging.Formatter):
    """Formats log records as single-line JSON objects."""

    # Fields from LogRecord to skip (noisy / redundant with JSON keys)
    _SKIP = frozenset({
        "args", "created", "exc_info", "exc_text", "filename", "funcName",
        "levelno", "lineno", "module", "msecs", "msg", "name", "pathname",
        "process", "processName", "relativeCreated", "stack_info",
        "taskName", "thread", "threadName",
    })

    def format(self, record: logging.LogRecord) -> str:
        # Ensure exc_text is populated if needed
        if record.exc_info and not record.exc_text:
            record.exc_text = self.formatException(record.exc_info)

        doc: dict = {
            "ts": datetime.fromtimestamp(record.created, tz=timezone.utc).strftime(
                "%Y-%m-%dT%H:%M:%S.%f"
            )[:-3] + "Z",
            "level": record.levelname,
            "logger": record.name,
            "msg": record.getMessage(),
        }

        # Inject context vars
        rid = request_id_var.get("")
        pid = project_id_var.get("")
        if rid:
            doc["request_id"] = rid
        if pid:
            doc["project_id"] = pid

        # Attach exception info
        if record.exc_text:
            doc["exc"] = record.exc_text

        # Attach any extra fields the caller added (e.g. duration_s, status_code)
        for k, v in record.__dict__.items():
            if k not in self._SKIP and not k.startswith("_"):
                if isinstance(v, (str, int, float, bool, type(None))):
                    doc[k] = v

        return json.dumps(doc, ensure_ascii=False)


# ---------------------------------------------------------------------------
# Setup function
# ---------------------------------------------------------------------------

def setup_logging(level: str = "INFO", json_output: bool = True) -> None:
    """
    Configure root logging for VoiceCut.

    Args:
        level: Log level string (INFO, DEBUG, WARNING, ERROR).
        json_output: If True, use JSON formatter. If False, use readable text
                     (useful for local development tailing).
    """
    root = logging.getLogger()
    root.setLevel(getattr(logging, level.upper(), logging.INFO))

    # Remove any existing handlers
    root.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(root.level)

    if json_output:
        handler.setFormatter(JSONFormatter())
    else:
        handler.setFormatter(logging.Formatter(
            "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        ))

    root.addHandler(handler)

    # Silence noisy third-party loggers
    for noisy in ("uvicorn.access", "uvicorn.error", "httpx", "httpcore"):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    logging.getLogger("voicecut").setLevel(root.level)
