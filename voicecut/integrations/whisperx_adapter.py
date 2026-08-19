"""
WhisperX Adapter
================
Wraps the locally-cloned whisperX repo (installed as editable pip package).
Returns transcript segments with word-level timestamps, and generates SRT/VTT content.

Repo: /OpenLens/whisperX
Install: pip install -e ../whisperX
License: BSD-2-Clause

M1 Mac note: device="mps" is supported; falls back to CPU if MPS unavailable.
No speaker diarization — kept simple (no HuggingFace token needed).
"""
from __future__ import annotations

import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def _format_timestamp(seconds: float) -> str:
    """Convert seconds to SRT timestamp: HH:MM:SS,mmm"""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def _format_vtt_timestamp(seconds: float) -> str:
    """Convert seconds to VTT timestamp: HH:MM:SS.mmm"""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


class WhisperXAdapter:
    """
    Thin adapter over m-bain/whisperX.

    Uses whisperX as a Python library (not CLI) for finer control.
    Steps:
      1. whisperx.load_model() — loads faster-whisper backend
      2. model.transcribe()    — ASR with segment timestamps
      3. whisperx.load_align_model() + whisperx.align() — word-level timestamps
      (No diarization — optional HF token not required)

    The adapter returns structured data compatible with VoiceCut's domain models.
    """

    def __init__(self, model_name: str = "small", device: str = "mps", compute_type: str = "float32"):
        self._model_name = model_name
        self._device = device
        self._compute_type = compute_type
        self._model = None
        self._align_models: dict = {}  # cache by language code

    def _ensure_model_loaded(self):
        if self._model is not None:
            return
        try:
            import whisperx  # type: ignore
        except ImportError as e:
            raise RuntimeError(
                "whisperX is not installed. Run: pip install -e ../whisperX"
            ) from e

        logger.info(f"Loading WhisperX model '{self._model_name}' on {self._device} ...")
        try:
            self._model = whisperx.load_model(
                self._model_name,
                device=self._device,
                compute_type=self._compute_type,
                language=None,  # auto-detect
            )
        except Exception as e:
            # MPS sometimes has issues; fall back to CPU
            logger.warning(f"Failed to load on {self._device}: {e}. Falling back to CPU.")
            self._device = "cpu"
            self._compute_type = "float32"
            self._model = whisperx.load_model(
                self._model_name,
                device=self._device,
                compute_type=self._compute_type,
            )
        logger.info("WhisperX model loaded.")

    def transcribe(
        self,
        audio_path: str | Path,
        language: str | None = None,
        batch_size: int = 8,
        align_words: bool = True,
        initial_prompt: str | None = None,
    ) -> dict:
        """
        Transcribe audio file and return structured result.

        Args:
            audio_path: Path to audio file (WAV preferred, 16kHz).
            language: Language code e.g. 'en'. None = auto-detect.
            batch_size: Batch size for faster-whisper (reduce if OOM).
            align_words: Whether to run word-level alignment.

        Returns:
            {
              "transcript": [{"start", "end", "text", "words": [...]}],
              "words": [{"word", "start", "end", "score"}],
              "language": str,
              "srt_content": str,
              "vtt_content": str,
            }
        """
        import whisperx  # type: ignore

        self._ensure_model_loaded()

        audio_path = Path(audio_path)
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        logger.info(f"WhisperX transcribing: {audio_path}")

        # Step 1: Load audio
        audio = whisperx.load_audio(str(audio_path))

        # Step 2: Transcribe
        transcribe_kwargs = {"batch_size": batch_size}
        if language:
            transcribe_kwargs["language"] = language
            
        # whisperX's FasterWhisperPipeline.transcribe() doesn't accept initial_prompt
        # but the underlying model uses self._model.options which is a dataclass.
        if hasattr(self._model, "options"):
            import dataclasses
            # Replace initial_prompt dynamically
            self._model.options = dataclasses.replace(
                self._model.options, 
                initial_prompt=initial_prompt if initial_prompt else None
            )

        result = self._model.transcribe(audio, **transcribe_kwargs)
        detected_language = result.get("language", language or "en")

        logger.info(f"WhisperX: detected language='{detected_language}', "
                    f"{len(result['segments'])} segments")

        # Step 3: Word-level alignment
        if align_words:
            try:
                if detected_language not in self._align_models:
                    align_model, align_metadata = whisperx.load_align_model(
                        language_code=detected_language,
                        device=self._device,
                    )
                    self._align_models[detected_language] = (align_model, align_metadata)

                align_model, align_metadata = self._align_models[detected_language]
                result = whisperx.align(
                    result["segments"],
                    align_model,
                    align_metadata,
                    audio,
                    self._device,
                    return_char_alignments=False,
                )
            except Exception as e:
                logger.warning(f"Word alignment failed: {e}. Using segment-level timestamps only.")

        # Step 4: Normalize output
        transcript = []
        all_words = []

        for seg in result.get("segments", []):
            words_in_seg = []
            for w in seg.get("words", []):
                word_obj = {
                    "word": w.get("word", "").strip(),
                    "start": round(float(w.get("start", seg["start"])), 3),
                    "end": round(float(w.get("end", seg["end"])), 3),
                    "score": round(float(w.get("score", 1.0)), 3),
                }
                words_in_seg.append(word_obj)
                all_words.append(word_obj)

            transcript.append({
                "start": round(float(seg["start"]), 3),
                "end": round(float(seg["end"]), 3),
                "text": seg["text"].strip(),
                "words": words_in_seg,
            })

        srt_content = self._build_srt(transcript)
        vtt_content = self._build_vtt(transcript)

        return {
            "transcript": transcript,
            "words": all_words,
            "language": detected_language,
            "srt_content": srt_content,
            "vtt_content": vtt_content,
        }

    def _build_srt(self, segments: list[dict]) -> str:
        """Generate SRT subtitle content from transcript segments."""
        lines = []
        for i, seg in enumerate(segments, 1):
            start = _format_timestamp(seg["start"])
            end = _format_timestamp(seg["end"])
            lines.append(f"{i}\n{start} --> {end}\n{seg['text']}\n")
        return "\n".join(lines)

    def _build_vtt(self, segments: list[dict]) -> str:
        """Generate WebVTT subtitle content from transcript segments."""
        lines = ["WEBVTT\n"]
        for i, seg in enumerate(segments, 1):
            start = _format_vtt_timestamp(seg["start"])
            end = _format_vtt_timestamp(seg["end"])
            lines.append(f"{i}\n{start} --> {end}\n{seg['text']}\n")
        return "\n".join(lines)
