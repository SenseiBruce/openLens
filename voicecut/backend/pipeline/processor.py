"""
VoiceCut Processing Pipeline
=============================
Orchestrates the full speech-aware video analysis pipeline:

1. Extract audio from video (FFmpeg)
2. Run Silero VAD → speech segments
3. Run WhisperX → transcript + word timestamps
4. Generate gap analysis → candidate cuts
5. Apply merge rules (configurable thresholds)
6. Return structured project data

Each step emits progress events (for SSE streaming to the frontend).
"""
from __future__ import annotations

import asyncio
from collections.abc import Callable
from pathlib import Path

import structlog

from voicecut.backend.pipeline.audio_utils import extract_wav_16k_mono, probe_duration
from voicecut.integrations.silero_vad_adapter import SileroVADAdapter
from voicecut.integrations.whisperx_adapter import WhisperXAdapter
from voicecut.shared.models import (
    CandidateCut,
    CutReason,
    CutStatus,
    Project,
    ProjectSettings,
    ProjectStatus,
    SpeechSegment,
    TranscriptSegment,
    WordTimestamp,
)

logger = structlog.get_logger(__name__)


class PipelineProcessor:
    """
    Core processing engine for VoiceCut.
    
    Uses Silero VAD (primary) + WhisperX (transcript) to produce:
    - Normalized speech segments
    - Full transcript with word-level timestamps
    - Candidate cuts (gaps between speech segments)
    
    Designed to be called from FastAPI background tasks with SSE streaming.
    """

    def __init__(
        self,
        uploads_dir: Path,
        exports_dir: Path,
        settings: ProjectSettings | None = None,
    ):
        self.uploads_dir = uploads_dir
        self.exports_dir = exports_dir
        self.settings = settings or ProjectSettings()

        self._vad = SileroVADAdapter(device=self.settings.device)
        self._whisperx = WhisperXAdapter(
            model_name=self.settings.whisper_model,
            device=self.settings.device,
        )

    async def process(
        self,
        project: Project,
        on_event: Callable[[str, dict], None],
    ) -> Project:
        """
        Run the full pipeline for a project.
        
        Args:
            project: Project object with video_path set.
            on_event: Callback for progress events (event_type, data).
            
        Returns:
            Updated Project with all segments, transcript, and candidate cuts.
        """
        structlog.contextvars.bind_contextvars(project_id=project.id)
        try:
            project.status = ProjectStatus.ANALYZING

            # Step 1: Extract audio
            on_event("step", {"step": "extracting_audio", "message": "Extracting audio track...", "percent": 5})
            audio_path = await self._extract_audio(project)
            project.audio_path = str(audio_path)

            # Get duration
            duration = await self._get_duration(audio_path)
            project.video_duration = duration
            logger.info("audio_extracted", project_id=project.id, duration=duration)
            on_event("progress", {"percent": 15, "message": f"Audio extracted ({duration:.1f}s)"})

            # Step 2: Silero VAD
            on_event("step", {"step": "running_vad", "message": "Detecting speech regions...", "percent": 20})
            speech_segments = await asyncio.get_running_loop().run_in_executor(
                None,
                self._run_vad,
                audio_path,
            )
            project.speech_segments = speech_segments
            on_event("progress", {
                "percent": 45,
                "message": f"Found {len(speech_segments)} speech regions"
            })

            # Step 3: WhisperX transcription
            on_event("step", {"step": "transcribing", "message": "Transcribing audio...", "percent": 50})
            transcript_result = await asyncio.get_running_loop().run_in_executor(
                None,
                self._run_transcription,
                audio_path,
            )

            project.transcript_segments = transcript_result["segments"]
            project.words = transcript_result["words"]

            # Save SRT/VTT
            srt_path = self.exports_dir / project.id / "subtitles.srt"
            vtt_path = self.exports_dir / project.id / "subtitles.vtt"
            srt_path.parent.mkdir(parents=True, exist_ok=True)
            srt_path.write_text(transcript_result["srt_content"])
            vtt_path.write_text(transcript_result["vtt_content"])
            project.srt_path = str(srt_path)
            project.vtt_path = str(vtt_path)

            on_event("progress", {
                "percent": 80,
                "message": f"Transcript ready ({len(project.transcript_segments)} segments)"
            })

            # Step 4: Gap detection → candidate cuts
            on_event("step", {"step": "detecting_cuts", "message": "Identifying candidate cuts...", "percent": 85})
            candidate_cuts = self._detect_candidate_cuts(
                speech_segments=project.speech_segments,
                audio_duration=duration,
                settings=self.settings,
            )
            project.candidate_cuts = candidate_cuts

            project.status = ProjectStatus.READY
            on_event("complete", {
                "percent": 100,
                "message": f"Analysis complete — {len(candidate_cuts)} cuts identified",
                "project_id": project.id,
                "cuts_count": len(candidate_cuts),
                "segments_count": len(project.transcript_segments),
            })

        except Exception as e:
            logger.exception("pipeline_error", project_id=project.id)
            project.status = ProjectStatus.ERROR
            project.error_message = str(e)
            on_event("error", {"message": str(e)})
        finally:
            structlog.contextvars.unbind_contextvars("project_id")

        return project

    async def _extract_audio(self, project: Project) -> Path:
        """Extract 16kHz mono WAV from video using FFmpeg."""
        video_path = Path(project.video_path)
        audio_path = Path(self.uploads_dir) / project.id / "audio.wav"
        return await extract_wav_16k_mono(video_path, audio_path)

    async def _get_duration(self, audio_path: Path) -> float:
        """Get audio duration via ffprobe."""
        return await probe_duration(audio_path)

    def _run_vad(self, audio_path: Path) -> list[SpeechSegment]:
        """Run Silero VAD (blocking, called in executor)."""
        raw_segments = self._vad.get_speech_segments(
            audio_path,
            threshold=self.settings.min_speech_confidence,
        )
        return [
            SpeechSegment(start=s["start"], end=s["end"])
            for s in raw_segments
        ]

    def _run_transcription(self, audio_path: Path) -> dict:
        """Run WhisperX transcription (blocking, called in executor)."""
        language = self.settings.language
        initial_prompt = self.settings.initial_prompt
        
        if language == "hinglish":
            language = "hi"  # explicitly force Hindi to prevent Whisper from outputting Urdu script
            if not initial_prompt:
                initial_prompt = "This audio contains a mix of English and Hindi. The speaker frequently switches between languages."
                
        result = self._whisperx.transcribe(
            str(audio_path), 
            language=language,
            initial_prompt=initial_prompt
        )

        segments = []
        for seg in result["transcript"]:
            words = [WordTimestamp(**w) for w in seg.get("words", [])]
            segments.append(TranscriptSegment(
                start=seg["start"],
                end=seg["end"],
                text=seg["text"],
                words=words,
            ))

        all_words = [WordTimestamp(**w) for w in result["words"]]

        return {
            "segments": segments,
            "words": all_words,
            "srt_content": result["srt_content"],
            "vtt_content": result["vtt_content"],
        }

    def _detect_candidate_cuts(
        self,
        speech_segments: list[SpeechSegment],
        audio_duration: float,
        settings: ProjectSettings,
    ) -> list[CandidateCut]:
        """
        Identify gaps between speech segments as candidate cuts.

        Algorithm:
        1. Sort speech segments by start time.
        2. For each gap between consecutive segments, check duration.
        3. If gap >= min_gap_duration, create a CandidateCut.
        4. Apply margin padding to speech segment boundaries.
        5. Also check gap before first speech and after last speech.

        Returns list of CandidateCut objects sorted by start time.
        """
        if not speech_segments:
            # No speech detected at all — entire video is a candidate cut
            return [CandidateCut(
                start=0.0,
                end=audio_duration,
                reason=CutReason.NO_DIALOGUE,
                status=CutStatus.CUT,
            )]

        margin = settings.margin
        min_gap = settings.min_gap_duration

        # Sort by start time
        segs = sorted(speech_segments, key=lambda s: s.start)

        # Apply margin (shrink gap boundaries)
        def effective_end(seg: SpeechSegment) -> float:
            return min(seg.end + margin, audio_duration)

        def effective_start(seg: SpeechSegment) -> float:
            return max(0.0, seg.start - margin)

        cuts = []

        # Gap before first speech segment
        first_start = effective_start(segs[0])
        if first_start >= min_gap:
            cuts.append(CandidateCut(
                start=0.0,
                end=first_start,
                reason=CutReason.NO_DIALOGUE,
                status=CutStatus.CUT,
            ))

        # Gaps between speech segments
        for i in range(len(segs) - 1):
            gap_start = effective_end(segs[i])
            gap_end = effective_start(segs[i + 1])
            gap_duration = gap_end - gap_start

            if gap_duration < 0:
                # Overlapping or margin-absorbed: skip
                continue

            if gap_duration < min_gap:
                # Too short to cut; skip
                continue

            # Classify reason
            reason = _classify_gap_reason(gap_duration)

            cuts.append(CandidateCut(
                start=round(gap_start, 3),
                end=round(gap_end, 3),
                reason=reason,
                status=CutStatus.CUT,
            ))

        # Gap after last speech segment
        last_end = effective_end(segs[-1])
        trailing_gap = audio_duration - last_end
        if trailing_gap >= min_gap:
            cuts.append(CandidateCut(
                start=round(last_end, 3),
                end=round(audio_duration, 3),
                reason=CutReason.NO_DIALOGUE,
                status=CutStatus.CUT,
            ))

        logger.info("gap_detection_complete", cuts=len(cuts), speech_segments=len(segs))
        return cuts


def _classify_gap_reason(duration: float) -> CutReason:
    """Classify a gap by duration into a human-readable reason."""
    if duration >= 5.0:
        return CutReason.NO_DIALOGUE
    elif duration >= 2.0:
        return CutReason.LONG_PAUSE
    elif duration >= 1.0:
        return CutReason.GAP_BETWEEN_SEGMENTS
    else:
        return CutReason.LOW_SPEECH_DENSITY
