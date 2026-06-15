"""
Silero VAD Adapter
==================
Wraps the locally-cloned silero-vad repo (installed as editable pip package).
Provides a clean interface: given an audio file path, returns normalized SpeechSegment list.

Repo: /OpenLens/silero-vad
Install: pip install -e ../silero-vad
License: MIT
"""
from __future__ import annotations
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


class SileroVADAdapter:
    """
    Thin adapter over snakers4/silero-vad.

    The silero-vad repo is installed as a local editable package.
    Key functions used:
      - load_silero_vad()          → loads model weights (~2MB)
      - read_audio(path)           → loads audio as torch tensor (16kHz mono)
      - get_speech_timestamps()    → returns list of {start, end} dicts

    Performance (M1/MPS): ~1–2s per minute of audio on CPU.
    Falls back gracefully if MPS is unavailable.
    """

    def __init__(self, device: str = "cpu"):
        self._model = None
        self._device = device
        self._loaded = False

    def _ensure_loaded(self):
        if self._loaded:
            return
        try:
            # Import from locally installed silero-vad editable package
            from silero_vad import load_silero_vad  # type: ignore
            self._model = load_silero_vad()
            # Move to device if possible (MPS on M1, CUDA on NVIDIA)
            if self._device in ("mps", "cuda"):
                try:
                    import torch
                    self._model = self._model.to(self._device)
                except Exception as e:
                    logger.warning(f"Could not move silero model to {self._device}: {e}. Using CPU.")
                    self._device = "cpu"
            self._loaded = True
            logger.info(f"Silero VAD model loaded on {self._device}")
        except ImportError as e:
            raise RuntimeError(
                "silero-vad is not installed. Run: pip install -e ../silero-vad"
            ) from e

    def get_speech_segments(
        self,
        audio_path: str | Path,
        min_speech_duration_ms: int = 250,
        min_silence_duration_ms: int = 100,
        threshold: float = 0.5,
    ) -> list[dict]:
        """
        Detect speech segments in audio file.

        Args:
            audio_path: Path to 16kHz mono WAV file.
            min_speech_duration_ms: Minimum speech duration to keep.
            min_silence_duration_ms: Minimum silence to split on.
            threshold: VAD confidence threshold (0–1).

        Returns:
            List of dicts: [{"start": float, "end": float}, ...]
            Times are in seconds.
        """
        self._ensure_loaded()

        try:
            from silero_vad import get_speech_timestamps  # type: ignore
        except ImportError as e:
            raise RuntimeError("silero-vad not installed") from e

        audio_path = Path(audio_path)
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        logger.info(f"Running Silero VAD on: {audio_path}")

        # torchaudio 2.8 ships with zero audio backends (soundfile/sox removed).
        # Load WAV directly via soundfile → torch tensor to bypass read_audio().
        try:
            import soundfile as sf
            import torch
            data, sr = sf.read(str(audio_path), dtype="float32", always_2d=False)
            wav = torch.from_numpy(data)
            if sr != 16000:
                # Resample if needed (should already be 16kHz from FFmpeg extraction)
                import torchaudio.functional as F
                wav = F.resample(wav, sr, 16000)
        except Exception as e:
            raise RuntimeError(f"Failed to load audio with soundfile: {e}") from e

        if self._device in ("mps", "cuda") and self._model is not None:
            try:
                wav = wav.to(self._device)
            except Exception as e:
                logger.warning(f"Could not move audio tensor to {self._device}: {e}. Keeping on CPU.")

        speech_timestamps = get_speech_timestamps(
            wav,
            self._model,
            return_seconds=True,
            threshold=threshold,
            min_speech_duration_ms=min_speech_duration_ms,
            min_silence_duration_ms=min_silence_duration_ms,
        )

        segments = [
            {"start": round(float(ts["start"]), 3), "end": round(float(ts["end"]), 3)}
            for ts in speech_timestamps
        ]

        logger.info(f"Silero VAD: found {len(segments)} speech segments")
        return segments

    def get_audio_duration(self, audio_path: str | Path) -> float:
        """Return audio duration in seconds using torchaudio."""
        try:
            import torchaudio  # type: ignore
            info = torchaudio.info(str(audio_path))
            return info.num_frames / info.sample_rate
        except Exception:
            # Fallback via ffprobe
            import subprocess, json
            result = subprocess.run(
                ["ffprobe", "-v", "quiet", "-print_format", "json",
                 "-show_format", str(audio_path)],
                capture_output=True, text=True, check=True
            )
            data = json.loads(result.stdout)
            return float(data["format"]["duration"])
