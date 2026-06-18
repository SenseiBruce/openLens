"""
VoiceCut — Shared Pydantic Data Models
Used by adapters, services, API routes, and the export engine.
"""
from __future__ import annotations
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
import uuid


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class CutStatus(str, Enum):
    PENDING = "pending"
    CUT = "cut"
    KEPT = "kept"
    IGNORED = "ignored"


class CutReason(str, Enum):
    NO_DIALOGUE = "no_dialogue"
    LONG_PAUSE = "long_pause"
    LOW_SPEECH_DENSITY = "low_speech_density"
    GAP_BETWEEN_SEGMENTS = "gap_between_segments"


class ProjectStatus(str, Enum):
    IDLE = "idle"
    ANALYZING = "analyzing"
    READY = "ready"
    EXPORTING = "exporting"
    ERROR = "error"


class ExportFormat(str, Enum):
    MP4 = "mp4"
    SRT = "srt"
    VTT = "vtt"
    JSON_EDL = "json_edl"


# ---------------------------------------------------------------------------
# Core domain objects
# ---------------------------------------------------------------------------

class SpeechSegment(BaseModel):
    start: float = Field(..., description="Start time in seconds")
    end: float = Field(..., description="End time in seconds")
    confidence: Optional[float] = None

    @property
    def duration(self) -> float:
        return self.end - self.start


class WordTimestamp(BaseModel):
    word: str
    start: float
    end: float
    score: Optional[float] = None


class TranscriptSegment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    start: float
    end: float
    text: str
    words: list[WordTimestamp] = Field(default_factory=list)
    speaker: Optional[str] = None

    @property
    def duration(self) -> float:
        return self.end - self.start


class CandidateCut(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    start: float
    end: float
    reason: CutReason = CutReason.GAP_BETWEEN_SEGMENTS
    status: CutStatus = CutStatus.PENDING
    merged_with_prev: bool = False
    merged_with_next: bool = False

    @property
    def duration(self) -> float:
        return self.end - self.start


class UserDecision(BaseModel):
    cut_id: str
    action: CutStatus
    timestamp: Optional[str] = None


class ProjectSettings(BaseModel):
    min_gap_duration: float = Field(1.0, description="Minimum gap in seconds to create a candidate cut")
    margin: float = Field(0.15, description="Padding around speech segments in seconds")
    whisper_model: str = Field("small", description="WhisperX model name")
    language: Optional[str] = Field("hinglish", description="Language code (e.g. en, hi, hinglish)")
    initial_prompt: Optional[str] = Field(None, description="Initial prompt to guide Whisper")
    device: str = Field("mps", description="torch device: cpu, mps, cuda")
    export_formats: list[ExportFormat] = Field(
        default_factory=lambda: [ExportFormat.MP4],
        description="Formats to export"
    )
    min_speech_confidence: float = Field(0.5, description="Minimum VAD confidence")


class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = "Untitled Project"
    video_path: Optional[str] = None
    audio_path: Optional[str] = None
    status: ProjectStatus = ProjectStatus.IDLE
    error_message: Optional[str] = None
    settings: ProjectSettings = Field(default_factory=ProjectSettings)
    speech_segments: list[SpeechSegment] = Field(default_factory=list)
    transcript_segments: list[TranscriptSegment] = Field(default_factory=list)
    words: list[WordTimestamp] = Field(default_factory=list)
    candidate_cuts: list[CandidateCut] = Field(default_factory=list)
    user_decisions: list[UserDecision] = Field(default_factory=list)
    srt_path: Optional[str] = None
    vtt_path: Optional[str] = None
    output_path: Optional[str] = None
    video_duration: Optional[float] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# ---------------------------------------------------------------------------
# API Request/Response schemas
# ---------------------------------------------------------------------------

class AnalyzeRequest(BaseModel):
    project_id: str
    settings: Optional[ProjectSettings] = None


class DecisionUpdate(BaseModel):
    cut_id: str
    action: CutStatus  # renamed from 'status' to match UserDecision.action


class ExportRequest(BaseModel):
    project_id: str
    formats: list[ExportFormat] = Field(default_factory=lambda: [ExportFormat.MP4])


class PipelineEvent(BaseModel):
    event: str  # "step" | "progress" | "complete" | "error"
    data: dict


# ---------------------------------------------------------------------------
# Adapter output schemas
# ---------------------------------------------------------------------------

class VADResult(BaseModel):
    speech_segments: list[SpeechSegment]
    audio_duration: float


class TranscriptResult(BaseModel):
    transcript: list[TranscriptSegment]
    words: list[WordTimestamp]
    language: Optional[str] = None
    srt_content: Optional[str] = None
    vtt_content: Optional[str] = None


class BaselineCutResult(BaseModel):
    """Output from auto-editor CLI adapter (fallback mode)."""
    auto_cuts: list[dict]
    source: str = "auto-editor"
