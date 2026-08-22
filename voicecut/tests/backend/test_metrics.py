from voicecut.monitoring.metrics import metrics


def test_metrics_snapshot_has_expected_keys():
    snap = metrics.snapshot()
    assert "pipeline" in snap
    assert "uptime_s" in snap or "started_at" in snap or isinstance(snap, dict)
    assert "error_rate_pct" in snap["pipeline"]
    assert "active_count" in snap["pipeline"]
