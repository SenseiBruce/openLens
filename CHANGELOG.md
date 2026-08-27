# Changelog

## Unreleased

- Timeline keyboard shortcuts: `J`/`L` (or `[`/`]`) jump cuts, `X` cuts, `K` keeps, `Z`/`U` undo last keep/cut
- Transcript toolbar: search, copy plain text, and export SRT
- Project list search and status filter on the home screen
- Chapters modal “Copy timestamps” pastes YouTube-style `0:00 Title` lines for descriptions
- Persist last analysis settings (Whisper model, gap, language, prompt) in `localStorage`
- Export dialog remembers the last output resolution in localStorage.
- Viral clips dialog remembers the last target length (15/30/60s) in localStorage.
- Copy project id (and name) from the TopBar name pill while a project has no duration yet.
- Copy kept / total / removed duration from the TopBar pill.
- Copy backend health (live/degraded/offline) from the TopBar chip.
- Copy Skip Cuts on/off from the TopBar without toggling the setting.
- Copy the current project status (idle/analyzing/ready/…) from the TopBar.
- Project cards can copy source `video_duration` without opening the project.
- Project cards can copy the project name without opening the project.
- Project cards can copy the created date without opening the project.
- Editor video player can copy the source filename.
- Editor top bar can copy the project Whisper model.
- Analysis settings can copy the minimum silence gap.
- Analysis Settings can copy the selected spoken language.
- Analysis Settings can copy the optional custom transcription prompt.
- Export modal can copy the original video resolution.
- Chapters modal can copy the LiteLLM model name.
- Runnable pytest and Vitest suites with coverage floors, Docker Compose, and GitHub Actions CI.
- Structured frontend error reporting (`reportError`) instead of `window.alert`.
- HuggingFace offline flags documented in `.env.example` (`HF_HUB_OFFLINE`, `TRANSFORMERS_OFFLINE`, `HF_DATASETS_OFFLINE`).
- Extracted `audio_utils` and `edl` helpers with unit tests; pytest/vitest coverage floors at 70%.
- Copy kept / total / removed duration from the VoiceCut top bar.
- VoiceCut remembers the Skip Cuts toggle in localStorage (`voicecut_skipCuts`).
- Copy export output paths from the VoiceCut export complete dialog.
- Copy VoiceCut cut/kept/pending counts from the top bar.
- Pin `filelock==3.32.4` in `voicecut/requirements.lock`.
- CI `docker-smoke` job curls `/health` after `docker compose up --build`.
