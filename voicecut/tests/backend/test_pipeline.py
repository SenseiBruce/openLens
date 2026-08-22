from pathlib import Path
from unittest.mock import MagicMock, patch

from voicecut.backend.pipeline.processor import PipelineProcessor
from voicecut.shared.models import CutStatus, ProjectSettings, SpeechSegment


@patch("voicecut.backend.pipeline.processor.WhisperXAdapter")
@patch("voicecut.backend.pipeline.processor.SileroVADAdapter")
def test_gap_calculation(mock_vad_cls, mock_wx_cls, tmp_path: Path):
    mock_vad_cls.return_value = MagicMock()
    mock_wx_cls.return_value = MagicMock()

    settings = ProjectSettings(min_gap_duration=1.0, margin=0.1)
    duration = 10.0
    speech_segments = [
        SpeechSegment(start=1.0, end=3.0, confidence=0.9),
        SpeechSegment(start=5.0, end=8.0, confidence=0.9),
    ]

    processor = PipelineProcessor(
        tmp_path / "uploads",
        tmp_path / "exports",
        settings,
    )
    cuts = processor._detect_candidate_cuts(speech_segments, duration, settings)

    assert isinstance(cuts, list)
    assert len(cuts) >= 2
    for cut in cuts:
        assert cut.status == CutStatus.PENDING
