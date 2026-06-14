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

def test_silero_adapter_mocked(mocker):
    # Test instantiation and lazy loading behavior
    adapter = SileroVADAdapter()
    assert adapter._model is None
    assert not adapter._loaded

    # Test get_speech_segments with a mocked audio file path
    with patch("pathlib.Path.exists", return_value=True):
        result = adapter.get_speech_segments("dummy.wav")
        assert len(result) == 1
        assert result[0]["start"] == 0.5
        assert result[0]["end"] == 2.0

