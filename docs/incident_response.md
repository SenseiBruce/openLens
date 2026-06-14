# VoiceCut Incident Response Runbook (Local App)

This runbook defines procedures for diagnosing and mitigating severe application errors while running the VoiceCut desktop environment.

## 1. Out of Memory (OOM) Errors / App Crashing During Analysis
**Symptom**: The backend abruptly terminates or the Mac system prompts "Your system has run out of application memory" during video analysis.
**Diagnosis**: WhisperX or FFmpeg is consuming too much RAM on a large video file.
**Mitigation**:
1. Check `voicecut_metrics.log` to see memory spikes.
2. If WhisperX caused the crash, open `voicecut/shared/models.py` or the backend configuration and ensure `compute_type="int8"` is being used to lower memory footprint.
3. If FFmpeg caused the crash, the video may be too large for local memory. Trim the video externally before importing.

## 2. SQLite Database Corruption
**Symptom**: The UI fails to load projects, or backend logs throw `sqlite3.DatabaseError: database disk image is malformed`.
**Diagnosis**: The application was forcefully killed during a database write transaction.
**Mitigation**:
1. Stop all services (`Ctrl+C` in launch terminal).
2. Navigate to `voicecut/`.
3. Move the corrupt database to a backup: `mv projects.db projects_corrupt.db`.
4. Restart the application. A new, empty database will be generated automatically.

## 3. UI Disconnected from Backend
**Symptom**: The frontend shows a continuous loading spinner or fails to upload, logging `net::ERR_CONNECTION_REFUSED`.
**Diagnosis**: The FastAPI backend has crashed or failed to start, while the Vite server is still running.
**Mitigation**:
1. Check the launch script console output for Python stack traces.
2. If a port conflict caused the crash, kill the existing process on port 8000: `kill -9 $(lsof -ti:8000)`.
3. Restart `./infrastructure/launch_local.sh`.
