from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from voicecut.backend.api.main import app
from voicecut.shared.models import CandidateCut, CutStatus, Project, UserDecision

client = TestClient(app)


@patch("voicecut.backend.api.routes.projects.list_projects")
def test_list_projects(mock_list):
    mock_list.return_value = [{"id": "p1", "name": "Demo", "status": "ready"}]
    response = client.get("/api/projects")
    assert response.status_code == 200
    assert response.json()[0]["id"] == "p1"


@patch("voicecut.backend.api.routes.projects.load_project")
def test_get_project_not_found(mock_load):
    mock_load.return_value = None
    response = client.get("/api/projects/missing")
    assert response.status_code == 404


@patch("voicecut.backend.api.routes.projects.save_project")
@patch("voicecut.backend.api.routes.projects.load_project")
def test_get_project_ok(mock_load, mock_save):
    mock_load.return_value = Project(id="p1", name="Demo")
    response = client.get("/api/projects/p1")
    assert response.status_code == 200
    assert response.json()["name"] == "Demo"


@patch("voicecut.backend.api.routes.projects.save_project")
@patch("voicecut.backend.api.routes.projects.load_project")
def test_update_decisions(mock_load, mock_save):
    cut = CandidateCut(start=1.0, end=2.0, status=CutStatus.PENDING)
    mock_load.return_value = Project(id="p1", candidate_cuts=[cut])
    response = client.patch(
        "/api/projects/p1/decisions",
        json=[{"cut_id": cut.id, "action": "cut"}],
    )
    assert response.status_code == 200
    assert response.json()["decisions_updated"] == 1
    mock_save.assert_called_once()


@patch("voicecut.backend.api.routes.projects.delete_project")
def test_delete_project_route(mock_delete):
    mock_delete.return_value = True
    response = client.delete("/api/projects/p1")
    assert response.status_code in (200, 204)
