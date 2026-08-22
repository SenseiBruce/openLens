import pytest

from voicecut.shared.models import ProjectSettings


@pytest.fixture
def default_settings():
    return ProjectSettings()
