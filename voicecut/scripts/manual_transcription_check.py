#!/usr/bin/env python3
"""Manual WhisperX transcription check — not part of the automated test suite.

Requires a real audio file and model weights. Run from the repo after
`pip install -r voicecut/requirements-ml.txt`.
"""
from pathlib import Path
import sys

from voicecut.integrations.whisperx_adapter import WhisperXAdapter

adapter = WhisperXAdapter(model_name="small", device="cpu")

print("Testing Auto-Detect (no initial prompt)...")
audio_path = "data/uploads/2a3d9cd8-462c-4e3c-b457-9d22cc038304/audio.wav"

if not Path(audio_path).exists():
    print(f"File not found: {audio_path}")
    sys.exit(1)

result1 = adapter.transcribe(audio_path, language=None)
print("Detected Language:", result1.get("language"))
print("First segment:", result1["transcript"][0]["text"] if result1["transcript"] else "No transcript")

print("\n----------------\n")
print("Testing Hinglish preset (with initial prompt)...")

initial_prompt = (
    "This audio contains a mix of English and Hindi. "
    "The speaker frequently switches between languages."
)
result2 = adapter.transcribe(audio_path, language=None, initial_prompt=initial_prompt)
print("Detected Language:", result2.get("language"))
print("First segment:", result2["transcript"][0]["text"] if result2["transcript"] else "No transcript")
