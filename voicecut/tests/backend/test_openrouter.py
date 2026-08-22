import asyncio
from unittest.mock import AsyncMock, MagicMock

from voicecut.backend.integrations.openrouter_client import OpenRouterClient


def test_extract_viral_clips_parses_json_array():
    client = OpenRouterClient(api_key="test-key")
    resp = MagicMock()
    resp.choices = [MagicMock()]
    resp.choices[0].message.content = (
        '[{"start": 0, "end": 5, "title": "Hook", "explanation": "strong", "score": 8}]'
    )
    client.client.chat.completions.create = AsyncMock(return_value=resp)
    result = asyncio.run(client.extract_viral_clips("hello", 30))
    assert result[0]["title"] == "Hook"


def test_extract_viral_clips_parses_wrapped_object():
    client = OpenRouterClient(api_key="test-key")
    resp = MagicMock()
    resp.choices = [MagicMock()]
    resp.choices[0].message.content = '{"clips": [{"start": 1, "end": 2, "title": "A"}]}'
    client.client.chat.completions.create = AsyncMock(return_value=resp)
    result = asyncio.run(client.extract_viral_clips("hello", 10))
    assert result[0]["title"] == "A"
