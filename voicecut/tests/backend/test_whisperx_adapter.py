"""Unit tests for WhisperXAdapter with the whisperx module fully mocked."""
from __future__ import annotations

import os
import sys
import types
from pathlib import Path
from unittest.mock import MagicMock

import pytest


def _install_fake_whisperx(monkeypatch, transcribe_result, align_result=None):
    fake = types.ModuleType("whisperx")
    fake_model = MagicMock(spec=["transcribe"])
    fake_model.transcribe.return_value = transcribe_result
    fake.load_model = MagicMock(return_value=fake_model)
    fake.load_audio = MagicMock(return_value=[0.0] * 16000)
    fake.load_align_model = MagicMock(return_value=(MagicMock(), {"language": "en"}))
    fake.align = MagicMock(return_value=align_result or transcribe_result)
    monkeypatch.setitem(sys.modules, "whisperx", fake)
    return fake


def test_huggingface_offline_flags_match_ci():
    """Session conftest and CI both require these so no model weights are fetched."""
    assert os.environ.get("HF_HUB_OFFLINE") in {"1", "true", "True", "yes"}
    assert os.environ.get("TRANSFORMERS_OFFLINE") in {"1", "true", "True", "yes"}
    assert os.environ.get("HF_DATASETS_OFFLINE") in {"1", "true", "True", "yes"}


def test_transcribe_mocked_without_real_model(monkeypatch, tmp_path):
    audio = tmp_path / "clip.wav"
    audio.write_bytes(b"fake-wav")

    segments = {
        "language": "en",
        "segments": [
            {
                "start": 0.0,
                "end": 1.5,
                "text": " hello world ",
                "words": [
                    {"word": "hello", "start": 0.0, "end": 0.5, "score": 0.99},
                    {"word": "world", "start": 0.5, "end": 1.5, "score": 0.98},
                ],
            }
        ],
    }
    fake = _install_fake_whisperx(monkeypatch, segments)
    monkeypatch.setitem(sys.modules, "torch", None)

    from voicecut.integrations.whisperx_adapter import WhisperXAdapter

    adapter = WhisperXAdapter(model_name="tiny", device="cpu")
    result = adapter.transcribe(audio, language="en", align_words=True)

    fake.load_model.assert_called()
    fake.align.assert_called()
    fake.load_audio.assert_called_once()
    assert sys.modules["whisperx"] is fake
    assert sys.modules.get("torch") is None
    assert result["language"] == "en"
    assert result["transcript"][0]["text"] == "hello world"
    assert result["words"][0]["word"] == "hello"
    assert "1\n" in result["srt_content"]
    assert result["vtt_content"].startswith("WEBVTT")


def test_missing_whisperx_module_raises(monkeypatch):
    monkeypatch.setitem(sys.modules, "whisperx", None)
    from voicecut.integrations.whisperx_adapter import WhisperXAdapter

    adapter = WhisperXAdapter(device="cpu")
    adapter._model = None
    with pytest.raises(RuntimeError, match="whisperX is not installed"):
        adapter._ensure_model_loaded()


def test_load_model_falls_back_to_cpu(monkeypatch, tmp_path):
    audio = tmp_path / "clip.wav"
    audio.write_bytes(b"fake-wav")
    segments = {"language": "en", "segments": [{"start": 0.0, "end": 0.5, "text": "ok", "words": []}]}
    fake = _install_fake_whisperx(monkeypatch, segments)
    fake.load_model.side_effect = [RuntimeError("mps unavailable"), fake.load_model.return_value]

    from voicecut.integrations.whisperx_adapter import WhisperXAdapter

    adapter = WhisperXAdapter(device="mps")
    result = adapter.transcribe(audio, align_words=False)
    assert adapter._device == "cpu"
    assert result["transcript"][0]["text"] == "ok"
    assert fake.load_model.call_count == 2


def test_transcribe_missing_file_raises(monkeypatch):
    _install_fake_whisperx(monkeypatch, {"language": "en", "segments": []})
    from voicecut.integrations.whisperx_adapter import WhisperXAdapter

    adapter = WhisperXAdapter(device="cpu")
    with pytest.raises(FileNotFoundError):
        adapter.transcribe(Path("/no/such/audio.wav"))


def test_transcribe_skips_alignment_when_disabled(monkeypatch, tmp_path):
    audio = tmp_path / "clip.wav"
    audio.write_bytes(b"fake-wav")
    segments = {
        "language": "en",
        "segments": [{"start": 0.0, "end": 1.0, "text": "hi", "words": []}],
    }
    fake = _install_fake_whisperx(monkeypatch, segments)

    from voicecut.integrations.whisperx_adapter import WhisperXAdapter

    adapter = WhisperXAdapter(device="cpu")
    result = adapter.transcribe(audio, align_words=False)
    fake.align.assert_not_called()
    assert result["transcript"][0]["text"] == "hi"
