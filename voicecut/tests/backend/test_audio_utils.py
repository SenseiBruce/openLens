"""Unit tests for FFmpeg audio helpers without invoking a real ffmpeg binary."""
from __future__ import annotations

import asyncio

import pytest

from voicecut.backend.pipeline import audio_utils


class _FakeProc:
    def __init__(self, returncode: int = 0, stdout: bytes = b"", stderr: bytes = b""):
        self.returncode = returncode
        self._stdout = stdout
        self._stderr = stderr

    async def communicate(self):
        return self._stdout, self._stderr


def test_extract_wav_skips_when_file_exists(tmp_path, monkeypatch):
    video = tmp_path / "in.mp4"
    video.write_bytes(b"x")
    wav = tmp_path / "out" / "audio.wav"
    wav.parent.mkdir()
    wav.write_bytes(b"already")

    async def _boom(*_a, **_k):
        raise AssertionError("ffmpeg should not run when WAV exists")

    monkeypatch.setattr(audio_utils.asyncio, "create_subprocess_exec", _boom)
    result = asyncio.run(audio_utils.extract_wav_16k_mono(video, wav))
    assert result == wav
    assert wav.read_bytes() == b"already"


def test_extract_wav_runs_ffmpeg(tmp_path, monkeypatch):
    video = tmp_path / "in.mp4"
    video.write_bytes(b"x")
    wav = tmp_path / "audio.wav"
    captured = {}

    async def fake_exec(*cmd, **_kwargs):
        captured["cmd"] = cmd
        return _FakeProc()

    monkeypatch.setattr(audio_utils.asyncio, "create_subprocess_exec", fake_exec)
    result = asyncio.run(audio_utils.extract_wav_16k_mono(video, wav))
    assert result == wav
    assert "-ar" in captured["cmd"] and "16000" in captured["cmd"]


def test_extract_wav_raises_on_ffmpeg_failure(tmp_path, monkeypatch):
    video = tmp_path / "in.mp4"
    video.write_bytes(b"x")
    wav = tmp_path / "audio.wav"

    async def fake_exec(*_cmd, **_kwargs):
        return _FakeProc(returncode=1, stderr=b"bad input")

    monkeypatch.setattr(audio_utils.asyncio, "create_subprocess_exec", fake_exec)
    with pytest.raises(RuntimeError, match="FFmpeg audio extraction failed"):
        asyncio.run(audio_utils.extract_wav_16k_mono(video, wav))


def test_probe_duration_parses_ffprobe_json(tmp_path, monkeypatch):
    wav = tmp_path / "a.wav"
    wav.write_bytes(b"x")

    async def fake_exec(*_cmd, **_kwargs):
        return _FakeProc(stdout=b'{"format": {"duration": "12.5"}}')

    monkeypatch.setattr(audio_utils.asyncio, "create_subprocess_exec", fake_exec)
    assert asyncio.run(audio_utils.probe_duration(wav)) == 12.5


def test_probe_duration_rejects_garbage(tmp_path, monkeypatch):
    wav = tmp_path / "a.wav"
    wav.write_bytes(b"x")

    async def fake_exec(*_cmd, **_kwargs):
        return _FakeProc(stdout=b"not-json")

    monkeypatch.setattr(audio_utils.asyncio, "create_subprocess_exec", fake_exec)
    with pytest.raises(RuntimeError, match="ffprobe returned invalid output"):
        asyncio.run(audio_utils.probe_duration(wav))
