import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock
from voicecut.backend.api.main import app
from voicecut.backend.db.database import get_session, init_db, ProjectRecord
from voicecut.backend.api.routes.viral_clips import EXPORTS_DIR

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    init_db()
    with get_session() as session:
        session.query(ProjectRecord).delete()
        session.commit()

@patch("voicecut.backend.api.routes.viral_clips.load_project")
@patch("voicecut.backend.api.routes.viral_clips.OpenRouterClient.extract_viral_clips", new_callable=AsyncMock)
@patch("voicecut.backend.export.renderer.VideoRenderer.render_viral_clip", new_callable=AsyncMock)
def test_generate_viral_clips_success(mock_render, mock_get_clips, mock_load):
    mock_project = MagicMock()
    mock_project.id = "test-project-123"
    mock_project.transcript_segments = [MagicMock(text="Hello", start=0.0, end=1.0)]
    mock_project.video_path = "/tmp/video.mp4"
    mock_project.video_duration = 60.0
    mock_load.return_value = mock_project

    mock_get_clips.return_value = [
        {"title": "Test Clip", "explanation": "Because it is good", "start": 0.0, "end": 30.0, "score": 9.5}
    ]
    mock_render.return_value = EXPORTS_DIR / "clip.mp4"

    response = client.post(
        "/api/viral-clips/test-project-123",
        json={"project_id": "test-project-123", "target_length_seconds": 30, "openrouter_key": "test-key"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "clips" in data
    assert len(data["clips"]) == 1
    assert data["clips"][0]["title"] == "Test Clip"
    assert data["clips"][0]["rendered_path"] == "/files/exports/clip.mp4"

@patch("voicecut.backend.api.routes.viral_clips.load_project")
def test_generate_viral_clips_no_transcript(mock_load):
    mock_project = MagicMock()
    mock_project.id = "test-project-123"
    mock_project.transcript_segments = []
    mock_load.return_value = mock_project
    
    response = client.post(
        "/api/viral-clips/test-project-123",
        json={"project_id": "test-project-123", "target_length_seconds": 30, "openrouter_key": "test-key"}
    )
    
    assert response.status_code == 400

@patch("voicecut.backend.api.routes.viral_clips.load_project")
def test_generate_viral_clips_not_found(mock_load):
    mock_load.return_value = None
    
    response = client.post(
        "/api/viral-clips/missing",
        json={"project_id": "missing", "target_length_seconds": 30, "openrouter_key": "test-key"}
    )
    
    assert response.status_code == 404
