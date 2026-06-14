# VoiceCut Test Plan
## Overview
This document outlines the testing strategy for the VoiceCut application, ensuring stability, correctness, and security.

## Unit Testing
- **Adapters**: Mock dependencies (e.g. `silero_vad`, `whisperx`, `subprocess`) to ensure that `SileroVADAdapter`, `WhisperXAdapter`, and `AutoEditorAdapter` correctly parse inputs and return strictly typed outputs (Pydantic models / lists of dicts).
- **Processing Pipeline**: Test `_detect_candidate_cuts` function isolated from external API calls to verify logic around `min_gap_duration` and `margin`.

## Integration Testing
- **API Endpoints**: Test FastAPI routes (`/api/upload`, `/api/analyze/{id}`, `/api/export/{id}`) with mock files and a temporary SQLite database.
- **SSE Stream**: Ensure pipeline events correctly trigger and stream out over `StreamingResponse`.

## Security Testing
- Automated shell script to scan codebase for any leaked secrets (API keys, passwords, tokens), preventing them from being checked into the repository.
