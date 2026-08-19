from pydantic import ValidationError

from voicecut.backend.config import Settings


def test_default_settings_are_valid():
    settings = Settings()
    assert settings.database_url.startswith("sqlite:///")
    assert settings.upload_dir
    assert settings.export_dir


def test_blank_database_url_fails_with_clear_error(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "   ")
    try:
        Settings()
        assert False, "expected ValidationError"
    except ValidationError as exc:
        assert "database_url" in str(exc).lower() or "DATABASE_URL" in str(exc)


def test_blank_upload_dir_fails(monkeypatch):
    monkeypatch.setenv("UPLOAD_DIR", "")
    try:
        Settings()
        assert False, "expected ValidationError"
    except ValidationError:
        pass
