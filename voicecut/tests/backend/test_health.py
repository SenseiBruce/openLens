from fastapi.testclient import TestClient

from voicecut.backend.api.main import app

client = TestClient(app)


def test_health_ok():
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "voicecut-api"


def test_root_message():
    response = client.get("/")
    assert response.status_code == 200
    assert "VoiceCut" in response.json()["message"]


def test_health_detailed_has_checks():
    response = client.get("/health/detailed")
    assert response.status_code == 200
    body = response.json()
    assert "checks" in body
    assert "database" in body["checks"]
    assert "metrics" in body
