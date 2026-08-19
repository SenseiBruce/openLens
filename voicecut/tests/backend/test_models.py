from voicecut.shared.models import (
    CandidateCut,
    Chapter,
    CutReason,
    Project,
    SpeechSegment,
    TranscriptSegment,
    ViralClip,
    WordTimestamp,
)


def test_segment_durations():
    assert SpeechSegment(start=1.0, end=4.0).duration == 3.0
    assert TranscriptSegment(start=0.0, end=2.5, text="hi").duration == 2.5
    assert CandidateCut(start=5.0, end=6.5, reason=CutReason.LONG_PAUSE).duration == 1.5
    assert ViralClip(start=10.0, end=40.0, title="hook").duration == 30.0
    assert Chapter(start=0.0, end=12.0, title="intro").duration == 12.0
    assert WordTimestamp(word="hi", start=0.0, end=0.2).end == 0.2


def test_project_defaults():
    project = Project(name="x")
    assert project.candidate_cuts == []
    assert project.speech_segments == []
    dumped = project.model_dump()
    assert dumped["name"] == "x"
