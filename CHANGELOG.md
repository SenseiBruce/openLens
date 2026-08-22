# Changelog

## Unreleased

- Runnable pytest and Vitest suites with coverage floors, Docker Compose, and GitHub Actions CI.
- Structured frontend error reporting (`reportError`) instead of `window.alert`.
- HuggingFace offline flags documented in `.env.example` (`HF_HUB_OFFLINE`, `TRANSFORMERS_OFFLINE`, `HF_DATASETS_OFFLINE`).
- Extracted `audio_utils` and `edl` helpers with unit tests; pytest/vitest coverage floors at 70%.
- CI `docker-smoke` job curls `/health` after `docker compose up --build`.
