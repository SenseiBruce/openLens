# VoiceCut

VoiceCut is an AI-powered speech-aware video editor. It automatically analyzes video, detects human speech, transcribes it, and identifies candidate cuts for non-dialogue gaps. 

It reuses the following open source tools via custom adapters:
1. [Silero VAD](../silero-vad) for rapid voice activity detection.
2. [WhisperX](../whisperX) for transcription and word-level alignment.
3. [Auto-Editor](../auto-editor) as an optional fallback baseline for loudness-based cuts.

## Architecture

* **Backend**: FastAPI + SQLite + FFmpeg + Python adapters
* **Frontend**: React + TypeScript + TailwindCSS + WaveSurfer.js

## Setup

1. From the `voicecut` directory, run the setup script to create a virtual environment and install dependencies:
   ```bash
   ./setup.sh
   ```
2. The setup script will install the local `silero-vad` and `whisperX` repos as editable pip packages.

## Running

1. **Start the Backend**:
   ```bash
   source .venv/bin/activate
   uvicorn voicecut.backend.api.main:app --reload
   ```

2. **Start the Frontend**:
   ```bash
   cd web
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.
