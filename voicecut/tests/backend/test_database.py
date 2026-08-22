from voicecut.backend.db.database import (
    delete_project,
    init_db,
    list_projects,
    load_project,
    save_project,
)
from voicecut.shared.models import Project, ProjectStatus, SpeechSegment


def test_save_load_list_delete_project(tmp_path, monkeypatch):
    from voicecut.backend.db import database as database_mod

    db_file = tmp_path / "test.db"
    monkeypatch.setattr(database_mod, "DB_PATH", db_file)
    database_mod._engine = None
    database_mod._Session = None
    init_db(db_file)

    project = Project(
        name="Demo",
        status=ProjectStatus.READY,
        video_duration=12.5,
        speech_segments=[SpeechSegment(start=0.0, end=2.0)],
    )
    save_project(project)

    loaded = load_project(project.id)
    assert loaded is not None
    assert loaded.name == "Demo"
    assert loaded.video_duration == 12.5
    assert len(loaded.speech_segments) == 1

    summaries = list_projects()
    assert any(item["id"] == project.id for item in summaries)

    assert delete_project(project.id) is True
    assert load_project(project.id) is None
    assert delete_project(project.id) is False
