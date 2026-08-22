from pathlib import Path

import pytest
from voicecut.backend.export.renderer import VideoRenderer
from voicecut.shared.models import CandidateCut, CutStatus, Project, UserDecision


def _renderer() -> VideoRenderer:
    return VideoRenderer(exports_dir=Path("/tmp/voicecut-exports"))


def _cut(start: float, end: float, status: CutStatus = CutStatus.CUT) -> CandidateCut:
    return CandidateCut(start=start, end=end, status=status)


def test_compute_kept_segments_no_cuts():
    project = Project(video_duration=10.0, candidate_cuts=[])
    assert _renderer()._compute_kept_segments(project) == [(0.0, 10.0)]


def test_compute_kept_segments_overlapping_cuts():
    project = Project(
        video_duration=10.0,
        candidate_cuts=[
            _cut(1.0, 3.0),
            _cut(2.5, 4.0),
        ],
    )
    kept = _renderer()._compute_kept_segments(project)
    assert kept == [(0.0, 1.0), (4.0, 10.0)]


def test_compute_kept_segments_short_segment_filtering():
    project = Project(
        video_duration=10.0,
        candidate_cuts=[_cut(0.05, 9.96)],
    )
    kept = _renderer()._compute_kept_segments(project)
    assert kept == []


def test_compute_kept_segments_requires_duration():
    project = Project(video_duration=None, candidate_cuts=[])
    with pytest.raises(ValueError, match="video_duration"):
        _renderer()._compute_kept_segments(project)


def test_user_decision_overrides_cut_status():
    cut = _cut(2.0, 4.0, status=CutStatus.CUT)
    project = Project(
        video_duration=10.0,
        candidate_cuts=[cut],
        user_decisions=[UserDecision(cut_id=cut.id, action=CutStatus.KEPT)],
    )
    assert _renderer()._compute_kept_segments(project) == [(0.0, 10.0)]
