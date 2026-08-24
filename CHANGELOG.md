# Changelog

## Unreleased

- Timeline keyboard shortcuts: `J`/`L` (or `[`/`]`) jump cuts, `X` cuts, `K` keeps, `Z`/`U` undo last keep/cut
- Transcript toolbar: search, copy plain text, and export SRT
- Project list search and status filter on the home screen
- Runnable pytest and Vitest suites with coverage floors, Docker Compose, and GitHub Actions CI.
- Structured frontend error reporting (`reportError`) instead of `window.alert`.
- HuggingFace offline flags documented in `.env.example` (`HF_HUB_OFFLINE`, `TRANSFORMERS_OFFLINE`, `HF_DATASETS_OFFLINE`).
- Extracted `audio_utils` and `edl` helpers with unit tests; pytest/vitest coverage floors at 70%.
- Copy kept / total / removed duration from the VoiceCut top bar.
- Pin `filelock==3.32.4` in `voicecut/requirements.lock`.
- CI `docker-smoke` job curls `/health` after `docker compose up --build`.
