"""Direct tests for merge/carve EDL helpers."""

import pytest
from voicecut.backend.export.edl import build_edl, compute_kept_segments
from voicecut.shared.models import CandidateCut, CutReason, CutStatus, Project, UserDecision


def _cut(start: float, end: float, status: CutStatus = CutStatus.CUT) -> CandidateCut:
    return CandidateCut(start=start, end=end, status=status)


def test_no_cuts_keeps_full_timeline():
    project = Project(video_duration=10.0, candidate_cuts=[])
    assert compute_kept_segments(project) == [(0.0, 10.0)]


def test_disjoint_cuts_carve_kept_islands():
    project = Project(
        video_duration=10.0,
        candidate_cuts=[_cut(1.0, 2.0), _cut(5.0, 6.0)],
    )
    assert compute_kept_segments(project) == [(0.0, 1.0), (2.0, 5.0), (6.0, 10.0)]


def test_overlapping_cuts_are_merged_then_carved():
    project = Project(
        video_duration=10.0,
        candidate_cuts=[_cut(1.0, 3.0), _cut(2.5, 4.0)],
    )
    assert compute_kept_segments(project) == [(0.0, 1.0), (4.0, 10.0)]


def test_adjacent_cuts_merge():
    project = Project(
        video_duration=8.0,
        candidate_cuts=[_cut(1.0, 3.0), _cut(3.0, 5.0)],
    )
    assert compute_kept_segments(project) == [(0.0, 1.0), (5.0, 8.0)]


def test_short_kept_fragments_are_dropped():
    project = Project(
        video_duration=10.0,
        candidate_cuts=[_cut(0.05, 9.96)],
    )
    assert compute_kept_segments(project) == []


def test_requires_duration():
    project = Project(video_duration=None, candidate_cuts=[])
    with pytest.raises(ValueError, match="video_duration"):
        compute_kept_segments(project)


def test_kept_decision_overrides_cut_status():
    cut = _cut(2.0, 4.0, status=CutStatus.CUT)
    project = Project(
        video_duration=10.0,
        candidate_cuts=[cut],
        user_decisions=[UserDecision(cut_id=cut.id, action=CutStatus.KEPT)],
    )
    assert compute_kept_segments(project) == [(0.0, 10.0)]


def test_build_edl_serializes_segments_and_decisions():
    cut = CandidateCut(start=1.0, end=2.0, reason=CutReason.LONG_PAUSE, status=CutStatus.CUT)
    project = Project(
        id="abc",
        video_path="/tmp/in.mp4",
        candidate_cuts=[cut],
        user_decisions=[UserDecision(cut_id=cut.id, action=CutStatus.CUT)],
    )
    edl = build_edl(project, [(0.0, 1.0), (2.0, 10.0)])
    assert edl["version"] == "1.0"
    assert edl["project_id"] == "abc"
    assert edl["source_video"] == "/tmp/in.mp4"
    assert edl["kept_segments"][0] == {"start": 0.0, "end": 1.0, "duration": 1.0}
    assert edl["candidate_cuts"][0]["id"] == cut.id
    assert edl["user_decisions"][0]["action"] == CutStatus.CUT.value
