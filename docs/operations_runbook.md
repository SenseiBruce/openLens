# VoiceCut Local Operations Runbook

## 1. Launching and Stopping the Application
To launch the application locally, use the unified startup script from the root workspace directory:
```bash
./voicecut/infrastructure/launch_local.sh
```
This script spins up both the `uvicorn` backend on port `8000` (logging to `voicecut/voicecut_backend.log`) and the `vite` frontend on port `5173` (logging to `voicecut/voicecut_frontend.log`).

To stop both services and terminate any active processes on these ports, run:
```bash
./voicecut/infrastructure/stop_local.sh
```

## 2. File & Log Storage Locations
- **SQLite Database**: Stored in `voicecut/data/voicecut.db`.
- **Uploaded Media & Exports**: Stored in `voicecut/data/uploads/` and `voicecut/data/exports/`.
- **Logs**:
  - **Backend Logs**: `voicecut/voicecut_backend.log` (Stream with `tail -f voicecut/voicecut_backend.log`)
  - **Frontend Logs**: `voicecut/voicecut_frontend.log` (Stream with `tail -f voicecut/voicecut_frontend.log`)
- **Transcripts**: Generated word-level transcripts are stored inside the SQLite database.


## 3. Common Issues and Troubleshooting

### Port Conflicts
**Symptom**: Script fails to bind to port `8000` or `5173`.
**Fix**: Find the zombie process and kill it:
```bash
lsof -i :8000
kill -9 <PID>
```

### FFmpeg Not Found
**Symptom**: Exports fail instantly or video won't load.
**Fix**: Ensure FFmpeg is installed globally on your M1 Mac:
```bash
brew install ffmpeg
```

### Model Downloading Timeouts
**Symptom**: App hangs for a long time on the first analysis run.
**Fix**: The app dynamically downloads Silero and WhisperX weights on the first run. Ensure you have a stable internet connection. Models are cached in `~/.cache/torch/hub/`.

### MPS Backend Failure
**Symptom**: WhisperX errors out about "MPS fallback".
**Fix**: Ensure your Mac M1 is updated to macOS 12.3+ and PyTorch is installed with MPS support. If all else fails, set `device="cpu"` in `voicecut/backend/pipeline/processor.py`.
