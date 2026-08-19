from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from voicecut.backend.api.main import app
from voicecut.backend.db.database import ProjectRecord, get_session, init_db
from voicecut.shared.models import Chapter

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    init_db()
    with get_session() as session:
        session.query(ProjectRecord).delete()
        session.commit()

@patch("voicecut.backend.api.routes.analyze.load_project")
@patch("voicecut.backend.api.routes.analyze.save_project")
@patch("voicecut.integrations.llm_adapter.LLMAdapter.generate_chapters")
def test_generate_chapters_success(mock_generate, mock_save, mock_load):
    mock_project = MagicMock()
    mock_project.id = "test-project-123"
    mock_project.transcript_segments = [MagicMock()]
    mock_load.return_value = mock_project
    
    mock_generate.return_value = [
        Chapter(title="Intro", summary="Summary", start=0.0, end=10.0)
    ]
    
    response = client.post(
        "/api/analyze/test-project-123/chapters/generate",
        json={"model_name": "test-model", "api_key": "test-key"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "chapters" in data
    assert len(data["chapters"]) == 1
    assert data["chapters"][0]["title"] == "Intro"

@patch("voicecut.backend.api.routes.analyze.load_project")
def test_generate_chapters_no_transcripts(mock_load):
    mock_project = MagicMock()
    mock_project.id = "test-project-123"
    mock_project.transcript_segments = []
    mock_load.return_value = mock_project
    
    response = client.post(
        "/api/analyze/test-project-123/chapters/generate",
        json={"model_name": "test-model"}
    )
    
    assert response.status_code == 400
    assert "No transcript available to generate chapters." in response.json()["detail"]

@patch("voicecut.backend.api.routes.analyze.load_project")
def test_generate_chapters_not_found(mock_load):
    mock_load.return_value = None
    
    response = client.post(
        "/api/analyze/missing-project/chapters/generate",
        json={"model_name": "test-model"}
    )
    
    assert response.status_code == 404
