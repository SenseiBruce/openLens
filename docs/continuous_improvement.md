# Continuous Improvement Strategy

To ensure VoiceCut remains robust and up-to-date, we follow this continuous improvement cycle.

## 1. Feedback Loop
- **User Reports**: If speech is missed, users can check the transcript panel. If the confidence threshold is too strict, this indicates a need to tweak `min_speech_confidence` in `shared/models.py`.
- **Telemetry Review**: Weekly, review `voicecut/monitoring/voicecut_metrics.log` to identify if memory leaks exist during prolonged use (e.g., if API memory usage climbs steadily without returning to baseline).

## 2. Dependency Updates
The core AI integrations (`whisperX`, `silero-vad`, `auto-editor`) are cloned locally.
- **Monthly Sync**: Check the upstream repositories for these tools. If a major performance enhancement is released (e.g., a new Silero VAD model version):
  1. `git pull` inside the respective cloned repository.
  2. Rerun `pip install -e .` if their requirements have changed.
  3. Run the VoiceCut test suite (`pytest voicecut/tests/backend/`) to ensure no breaking API changes occurred.

## 3. Planned Architectural Iterations (Phase 7)
Based on current usage, future iterations should focus on:
- Adding **Diarization**: Re-enabling speaker identification in WhisperX if an easy local fallback to a non-gated model can be found.
- **Hardware Acceleration**: Adding dynamic detection for CUDA (Windows/Linux) alongside the existing MPS (Mac) support for broader local compatibility.
