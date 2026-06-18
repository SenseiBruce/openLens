"""
VoiceCut — SQLite Database Layer
Uses SQLAlchemy Core with aiosqlite for async support.
Stores projects, segments, cuts, and decisions.
"""
from __future__ import annotations
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

from sqlalchemy import (
    Column, String, Float, Text, Boolean, DateTime, JSON,
    create_engine, MetaData, Table, select, insert, update, delete
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

logger = logging.getLogger(__name__)

DB_PATH = Path(__file__).parent.parent.parent / "data" / "voicecut.db"


class Base(DeclarativeBase):
    pass


class ProjectRecord(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, default="Untitled Project")
    video_path: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    audio_path: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="idle")
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    settings_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    speech_segments_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    transcript_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    words_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    candidate_cuts_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    user_decisions_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    srt_path: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    vtt_path: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    output_path: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    video_duration: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    updated_at: Mapped[Optional[str]] = mapped_column(String, nullable=True)


def get_engine(db_path: Path = DB_PATH):
    db_path.parent.mkdir(parents=True, exist_ok=True)
    engine = create_engine(f"sqlite:///{db_path}", echo=False)
    Base.metadata.create_all(engine)
    return engine


def get_session_factory(engine):
    return sessionmaker(engine, expire_on_commit=False)


# Module-level engine/session (initialized on startup)
_engine = None
_Session = None


def init_db(db_path: Path = DB_PATH):
    global _engine, _Session
    _engine = get_engine(db_path)
    _Session = get_session_factory(_engine)
    logger.info(f"Database initialized: {db_path}")


def get_session():
    if _Session is None:
        init_db()
    return _Session()


# ---------------------------------------------------------------------------
# Repository functions
# ---------------------------------------------------------------------------

def _serialize(obj) -> Optional[str]:
    if obj is None:
        return None
    if isinstance(obj, list):
        return json.dumps([
            item.model_dump() if hasattr(item, 'model_dump') else item
            for item in obj
        ])
    return json.dumps(obj.model_dump() if hasattr(obj, 'model_dump') else obj)


def _deserialize_list(json_str: Optional[str], model_class=None) -> list:
    if not json_str:
        return []
    items = json.loads(json_str)
    if model_class:
        return [model_class(**item) for item in items]
    return items


def save_project(project) -> None:
    """Save or update a project in the database."""
    from voicecut.shared.models import Project

    with get_session() as session:
        now = datetime.utcnow().isoformat()
        existing = session.get(ProjectRecord, project.id)

        data = {
            "name": project.name,
            "video_path": project.video_path,
            "audio_path": project.audio_path,
            "status": project.status.value if hasattr(project.status, 'value') else project.status,
            "error_message": project.error_message,
            "settings_json": _serialize(project.settings),
            "speech_segments_json": _serialize(project.speech_segments),
            "transcript_json": _serialize(project.transcript_segments),
            "words_json": _serialize(project.words),
            "candidate_cuts_json": _serialize(project.candidate_cuts),
            "user_decisions_json": _serialize(project.user_decisions),
            "srt_path": project.srt_path,
            "vtt_path": project.vtt_path,
            "output_path": project.output_path,
            "video_duration": project.video_duration,
            "updated_at": now,
        }

        if existing:
            for k, v in data.items():
                setattr(existing, k, v)
        else:
            data["id"] = project.id
            data["created_at"] = project.created_at or now
            record = ProjectRecord(**data)
            session.add(record)

        session.commit()


def load_project(project_id: str):
    """Load a project from the database. Returns Project or None."""
    from voicecut.shared.models import (
        Project, ProjectSettings, SpeechSegment, TranscriptSegment,
        WordTimestamp, CandidateCut, UserDecision, ProjectStatus
    )

    with get_session() as session:
        record = session.get(ProjectRecord, project_id)
        if not record:
            return None

        settings_data = json.loads(record.settings_json) if record.settings_json else {}

        return Project(
            id=record.id,
            name=record.name,
            video_path=record.video_path,
            audio_path=record.audio_path,
            status=ProjectStatus(record.status),
            error_message=record.error_message,
            settings=ProjectSettings(**settings_data) if settings_data else ProjectSettings(),
            speech_segments=_deserialize_list(record.speech_segments_json, SpeechSegment),
            transcript_segments=_deserialize_list(record.transcript_json, TranscriptSegment),
            words=_deserialize_list(record.words_json, WordTimestamp),
            candidate_cuts=_deserialize_list(record.candidate_cuts_json, CandidateCut),
            user_decisions=_deserialize_list(record.user_decisions_json, UserDecision),
            srt_path=record.srt_path,
            vtt_path=record.vtt_path,
            output_path=record.output_path,
            video_duration=record.video_duration,
            created_at=record.created_at,
            updated_at=record.updated_at,
        )


def list_projects() -> list:
    """List all projects (summary only)."""
    with get_session() as session:
        records = session.query(ProjectRecord).order_by(
            ProjectRecord.updated_at.desc()
        ).all()
        return [
            {
                "id": r.id,
                "name": r.name,
                "status": r.status,
                "video_duration": r.video_duration,
                "created_at": r.created_at,
                "updated_at": r.updated_at,
            }
            for r in records
        ]


def delete_project(project_id: str) -> bool:
    """Delete a project from the database."""
    with get_session() as session:
        record = session.get(ProjectRecord, project_id)
        if record:
            session.delete(record)
            session.commit()
            return True
        return False
