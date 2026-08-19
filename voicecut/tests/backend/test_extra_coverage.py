from fastapi.testclient import TestClient

from voicecut.backend.api.main import app
from voicecut.monitoring.metrics import MetricsStore
from voicecut.integrations.whisperx_adapter import _format_timestamp, _format_vtt_timestamp
from voicecut.backend.export.renderer import VideoRenderer
from voicecut.shared.models import CandidateCut, CutReason, CutStatus, Project, UserDecision
from pathlib import Path

client = TestClient(app)


def test_video_info_not_found():
    from unittest.mock import patch
    with patch("voicecut.backend.api.routes.export_routes.load_project", return_value=None):
        response = client.get("/api/projects/missing/video-info")
    assert response.status_code == 404


def test_upload_rejects_unsupported_extension():
    response = client.post(
        "/api/upload",
        files={"file": ("notes.txt", b"hello", "text/plain")},
    )
    assert response.status_code == 400


def test_request_too_large_rejected():
    response = client.post(
        "/api/projects/x/decisions",
        content=b"x",
        headers={"content-length": str(11 * 1024 * 1024), "content-type": "application/json"},
    )
    assert response.status_code == 413


def test_whisperx_timestamp_helpers():
    assert _format_timestamp(3661.5) == "01:01:01,500"
    assert _format_vtt_timestamp(3661.5) == "01:01:01.500"


def test_build_edl():
    cut = CandidateCut(start=1.0, end=2.0, reason=CutReason.LONG_PAUSE, status=CutStatus.CUT)
    project = Project(
        id="abc",
        video_path="/tmp/in.mp4",
        candidate_cuts=[cut],
        user_decisions=[UserDecision(cut_id=cut.id, action=CutStatus.CUT)],
    )
    edl = VideoRenderer(Path("/tmp"))._build_edl(project, [(0.0, 1.0), (2.0, 10.0)])
    assert edl["project_id"] == "abc"
    assert edl["kept_segments"][0]["start"] == 0.0
    assert len(edl["candidate_cuts"]) == 1


def test_metrics_pipeline_lifecycle():
    store = MetricsStore()
    store.record_upload()
    run = store.pipeline_start("p1", "small", "en")
    store.pipeline_complete("p1", cuts_count=2, segments_count=4)
    snap = store.snapshot()
    assert snap["counters"]["uploads"] == 1
    assert snap["counters"]["analyses"] >= 0
    assert run.project_id == "p1"
    store.pipeline_start("p2", "small", "en")
    store.pipeline_error("p2", "boom")
    snap2 = store.snapshot()
    assert snap2["counters"]["errors"] >= 1
