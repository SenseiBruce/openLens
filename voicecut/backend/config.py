"""
VoiceCut application settings.

Loaded from environment variables and optional `voicecut/.env`.
Startup fails with a clear error if a required value is blank.
"""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV_FILE = Path(__file__).resolve().parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_FILE if _ENV_FILE.exists() else None,
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )

    database_url: str = Field(default="sqlite:///./data/voicecut.db", alias="DATABASE_URL")
    upload_dir: str = Field(default="./data/uploads", alias="UPLOAD_DIR")
    export_dir: str = Field(default="./data/exports", alias="EXPORT_DIR")
    gemini_api_key: str | None = Field(default=None, alias="GEMINI_API_KEY")
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    openrouter_api_key: str | None = Field(default=None, alias="OPENROUTER_API_KEY")
    api_target: str = Field(default="http://localhost:8000", alias="API_TARGET")

    @field_validator("database_url", "upload_dir", "export_dir")
    @classmethod
    def required_paths_must_not_be_blank(cls, value: str, info) -> str:
        if value is None or not str(value).strip():
            raise ValueError(
                f"{info.field_name} is required and cannot be empty. "
                "Copy voicecut/.env.example to voicecut/.env and set "
                "DATABASE_URL, UPLOAD_DIR, and EXPORT_DIR."
            )
        return value.strip()

    def resolve_path(self, value: str, base_dir: Path) -> Path:
        path = Path(value)
        if not path.is_absolute():
            path = base_dir / path
        return path


@lru_cache
def get_settings() -> Settings:
    return Settings()
