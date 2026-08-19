"""FFmpeg helpers for 16 kHz mono extraction and duration probing."""
from __future__ import annotations

import asyncio
import json
import shutil
from pathlib import Path

import structlog

logger = structlog.get_logger(__name__)


def ffmpeg_bin() -> str:
    return shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"


def ffprobe_bin() -> str:
    return shutil.which("ffprobe") or "/opt/homebrew/bin/ffprobe"


async def extract_wav_16k_mono(video_path: Path, audio_path: Path) -> Path:
    """Extract 16 kHz mono WAV from video using FFmpeg. Skips work if the WAV exists."""
    audio_path.parent.mkdir(parents=True, exist_ok=True)
    if audio_path.exists():
        return audio_path

    cmd = [
        ffmpeg_bin(),
        "-y",
        "-i",
        str(video_path),
        "-vn",
        "-acodec",
        "pcm_s16le",
        "-ar",
        "16000",
        "-ac",
        "1",
        str(audio_path),
    ]
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    _, stderr = await proc.communicate()
    if proc.returncode != 0:
        raise RuntimeError(f"FFmpeg audio extraction failed:\n{stderr.decode()}")
    logger.info("audio_file_written", path=str(audio_path))
    return audio_path


async def probe_duration(audio_path: Path) -> float:
    """Return media duration in seconds via ffprobe JSON."""
    proc = await asyncio.create_subprocess_exec(
        ffprobe_bin(),
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        str(audio_path),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, _ = await proc.communicate()
    try:
        data = json.loads(stdout)
        return float(data["format"]["duration"])
    except (json.JSONDecodeError, KeyError, ValueError) as exc:
        raise RuntimeError(
            f"ffprobe returned invalid output for {audio_path}. "
            f"The file may be corrupt or unsupported.\nRaw: {stdout[:200]}"
        ) from exc
