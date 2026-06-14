# VoiceCut — Usage Guide

## Prerequisites

- Python 3.10+
- Node.js 18+
- FFmpeg installed and on PATH (`brew install ffmpeg` on macOS)
- ~2GB disk space for ML models (Silero VAD + WhisperX)

## Setup

```bash
cd voicecut
./setup.sh
```

This creates a `.venv`, installs Python dependencies (including local `silero-vad` and `whisperX` repos), and runs `npm install` in the `web/` folder.

## Running

**Option A — Manual (two terminals):**

```bash
# Terminal 1: Backend
source .venv/bin/activate
uvicorn voicecut.backend.api.main:app --reload

# Terminal 2: Frontend
cd web
npm run dev
```

**Option B — Single command:**

```bash
./infrastructure/launch_local.sh
```

Then open **http://localhost:5173** in your browser.

---

## Workflow

### 1. Import Video

- Click **Import Video** in the top bar.
- Select any video file (MP4, MOV, AVI, MKV, WebM — up to 4GB).
- The file uploads to the backend and a new project is created.

### 2. Analyze (Remove Silences)

- Click **Remove Silences** to start the AI pipeline.
- Progress streams in real-time via SSE:
  1. **Extracting audio** — FFmpeg extracts 16kHz mono WAV.
  2. **Detecting speech** — Silero VAD identifies speech regions.
  3. **Transcribing** — WhisperX generates word-level transcript.
  4. **Identifying cuts** — Gaps between speech become candidate cuts.

### 3. Review Cuts

Once analysis completes, the UI shows:

| Component | Description |
|-----------|-------------|
| **Video Player** | Plays the original video. Click transcript or waveform to seek. |
| **Waveform Timeline** | Visual audio waveform with colored regions: green = speech, gray = pending cut, red = confirmed cut, blue = kept. Click a region to toggle cut/keep. |
| **Transcript Panel** | Interleaved transcript segments and cut markers. Click **Cut** or **Restore** to toggle each gap. |

### 4. Export

- Click **Export** in the top bar.
- VoiceCut renders the final video using FFmpeg (lossless concat, falls back to re-encode if needed).
- Download the output MP4 (and optionally SRT/VTT subtitles).

---

## Configuration

Settings are per-project and can be adjusted before analysis:

| Setting | Default | Description |
|---------|---------|-------------|
| `min_gap_duration` | 1.0s | Minimum silence gap to flag as candidate cut |
| `margin` | 0.15s | Padding kept around speech boundaries |
| `whisper_model` | `small.en` | WhisperX model (`tiny.en`, `base.en`, `small.en`, `medium.en`, `large-v3`) |
| `device` | `mps` | Torch device: `cpu`, `mps` (Apple Silicon), `cuda` (NVIDIA) |
| `min_speech_confidence` | 0.5 | VAD confidence threshold (0–1) |

Larger models are more accurate but slower. For quick edits, `tiny.en` works. For final exports, use `medium.en` or `large-v3`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload video, returns `project_id` |
| POST | `/api/analyze/{id}` | Start analysis (SSE stream) |
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/{id}` | Get project details |
| PATCH | `/api/projects/{id}/decisions` | Batch update cut decisions |
| PATCH | `/api/projects/{id}/cuts/{cut_id}?status=cut` | Update single cut |
| POST | `/api/export/{id}` | Render & export (SSE stream) |
| GET | `/api/export/{id}/download/{filename}` | Download exported file |
| GET | `/health` | Health check |

Interactive docs available at **http://localhost:8000/docs** (Swagger UI).

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ffmpeg not found` | Install FFmpeg: `brew install ffmpeg` |
| `silero-vad not installed` | Run `pip install -e ../silero-vad` from within the venv |
| `whisperX not installed` | Run `pip install -e ../whisperX` from within the venv |
| MPS/CUDA errors | Set device to `cpu` in project settings |
| Upload fails (413) | File exceeds 4GB limit |
| Waveform not loading | Ensure analysis completed (audio.wav must exist) |
| Export fails | Check FFmpeg is on PATH and video file still exists |

---

## Monitoring (Optional)

Run the local telemetry monitor to track resource usage:

```bash
python monitoring/local_monitor.py
```

Metrics are written to `voicecut_metrics.log`.
