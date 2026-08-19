from voicecut.backend.pipeline.processor import PipelineProcessor, _classify_gap_reason
from voicecut.shared.models import CutReason, ProjectSettings, SpeechSegment


def test_no_speech_marks_entire_duration_as_cut():
    processor = PipelineProcessor("uploads", "exports")
    cuts = processor._detect_candidate_cuts([], 8.0, ProjectSettings())
    assert len(cuts) == 1
    assert cuts[0].start == 0.0
    assert cuts[0].end == 8.0
    assert cuts[0].reason == CutReason.NO_DIALOGUE


def test_overlapping_speech_skips_negative_gap():
    settings = ProjectSettings(min_gap_duration=0.5, margin=0.0)
    processor = PipelineProcessor("uploads", "exports")
    segs = [
        SpeechSegment(start=0.0, end=3.0),
        SpeechSegment(start=2.5, end=4.0),
        SpeechSegment(start=7.0, end=8.0),
    ]
    cuts = processor._detect_candidate_cuts(segs, 8.0, settings)
    # Only the gap 4.0 -> 7.0 should survive
    assert any(abs(c.start - 4.0) < 1e-6 and abs(c.end - 7.0) < 1e-6 for c in cuts)


def test_classify_gap_reason_thresholds():
    assert _classify_gap_reason(5.0) == CutReason.NO_DIALOGUE
    assert _classify_gap_reason(2.0) == CutReason.LONG_PAUSE
    assert _classify_gap_reason(1.0) == CutReason.GAP_BETWEEN_SEGMENTS
    assert _classify_gap_reason(0.5) == CutReason.LOW_SPEECH_DENSITY
