import sys
from unittest.mock import MagicMock, patch

# Mock the silero_vad module before importing/instantiating
mock_silero = MagicMock()
mock_silero.load_silero_vad.return_value = MagicMock()
mock_silero.read_audio.return_value = MagicMock()
mock_silero.get_speech_timestamps.return_value = [
    {"start": 0.5, "end": 2.0}
]
sys.modules['silero_vad'] = mock_silero

from voicecut.integrations.silero_vad_adapter import SileroVADAdapter

def test_silero_adapter_mocked():
    # Test instantiation and lazy loading behavior
    adapter = SileroVADAdapter()
    assert adapter._model is None
    assert not adapter._loaded

    import numpy as np
    # Test get_speech_segments with a mocked audio file path
    with patch("pathlib.Path.exists", return_value=True), patch("soundfile.read", return_value=(np.zeros((16000,), dtype=np.float32), 16000)):
        result = adapter.get_speech_segments("dummy.wav")
        assert len(result) == 1
        assert result[0]["start"] == 0.5
        assert result[0]["end"] == 2.0


from voicecut.integrations.llm_adapter import LLMAdapter
from voicecut.shared.models import TranscriptSegment

def test_llm_adapter_no_api_key():
    adapter = LLMAdapter(api_key="")
    segments = [TranscriptSegment(start=0.0, end=1.0, text="hello")]
    assert adapter.generate_chapters(segments) == []

@patch("voicecut.integrations.llm_adapter.completion")
def test_llm_adapter_success(mock_completion):
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = '''```json
[
  {"title": "Intro", "summary": "Hello", "start_time": 0.0, "end_time": 10.0}
]
```'''
    mock_completion.return_value = mock_response

    adapter = LLMAdapter(api_key="dummy_key")
    segments = [TranscriptSegment(start=0.0, end=1.0, text="hello")]
    chapters = adapter.generate_chapters(segments)
    
    assert len(chapters) == 1
    assert chapters[0].title == "Intro"
    assert chapters[0].summary == "Hello"
    assert chapters[0].start == 0.0
    assert chapters[0].end == 10.0

@patch("voicecut.integrations.llm_adapter.completion")
def test_llm_adapter_exception(mock_completion, caplog):
    mock_completion.side_effect = Exception("API error")
    
    adapter = LLMAdapter(api_key="dummy_key")
    segments = [TranscriptSegment(start=0.0, end=1.0, text="hello")]
    chapters = adapter.generate_chapters(segments)
    
    assert chapters == []
    assert "Error generating chapters: API error" in caplog.text

