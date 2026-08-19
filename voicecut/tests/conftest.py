"""Session-wide fixtures: tests must never download models or hit the network."""
from __future__ import annotations

import os

import pytest


def pytest_configure(config):
    os.environ["HF_HUB_OFFLINE"] = "1"
    os.environ["TRANSFORMERS_OFFLINE"] = "1"
    os.environ["HF_DATASETS_OFFLINE"] = "1"


@pytest.fixture(scope="session", autouse=True)
def fail_if_hub_not_offline():
    """Fail fast if Hugging Face hub downloads could run during tests."""
    flag = os.environ.get("HF_HUB_OFFLINE", "")
    if flag not in {"1", "true", "True", "yes"}:
        pytest.fail(
            "HF_HUB_OFFLINE must be set so tests never download model weights. "
            "The session fixture sets this automatically; if you see this, something unset it."
        )
