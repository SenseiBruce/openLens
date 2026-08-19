"""Edit-decision helpers: merge cut ranges and carve kept segments."""
from __future__ import annotations

from voicecut.shared.models import CutStatus, Project


def compute_kept_segments(project: Project) -> list[tuple[float, float]]:
    """
    Determine which time ranges to keep based on user decisions.

    Algorithm (linear sweep — O(n log n)):
    1. Collect all CUT ranges, sort them, then merge overlapping cuts.
    2. Walk the merged cuts to carve the [0, duration] timeline.
    """
    if not project.video_duration:
        raise ValueError("Project has no video_duration set")

    duration = project.video_duration

    decision_override: dict[str, CutStatus] = {d.cut_id: d.action for d in project.user_decisions}
    cut_ranges: list[tuple[float, float]] = []
    for cut in project.candidate_cuts:
        effective = decision_override.get(cut.id, cut.status)
        if effective == CutStatus.CUT:
            cut_ranges.append((cut.start, cut.end))

    if not cut_ranges:
        return [(0.0, duration)]

    cut_ranges.sort()
    merged_cuts: list[tuple[float, float]] = [cut_ranges[0]]
    for cs, ce in cut_ranges[1:]:
        ms, me = merged_cuts[-1]
        if cs <= me:
            merged_cuts[-1] = (ms, max(me, ce))
        else:
            merged_cuts.append((cs, ce))

    kept: list[tuple[float, float]] = []
    cursor = 0.0
    for cs, ce in merged_cuts:
        if cursor < cs:
            kept.append((cursor, cs))
        cursor = max(cursor, ce)
    if cursor < duration:
        kept.append((cursor, duration))

    return [(s, e) for s, e in kept if e - s >= 0.1]


def build_edl(project: Project, kept_segments: list[tuple[float, float]]) -> dict:
    """Build JSON Edit Decision List."""
    return {
        "version": "1.0",
        "project_id": project.id,
        "source_video": project.video_path,
        "kept_segments": [
            {"start": round(s, 3), "end": round(e, 3), "duration": round(e - s, 3)}
            for s, e in kept_segments
        ],
        "candidate_cuts": [
            {
                "id": c.id,
                "start": c.start,
                "end": c.end,
                "duration": c.duration,
                "reason": c.reason.value,
                "status": c.status.value,
            }
            for c in project.candidate_cuts
        ],
        "user_decisions": [
            {"cut_id": d.cut_id, "action": d.action.value}
            for d in project.user_decisions
        ],
    }
