from voicecut.integrations.auto_editor_adapter import AutoEditorAdapter


def test_parse_timeline_extracts_gaps():
    adapter = AutoEditorAdapter.__new__(AutoEditorAdapter)
    data = {
        "timeline": {
            "fps": [30],
            "v": [
                [
                    {"offset": 0, "dur": 30},
                    {"offset": 90, "dur": 30},
                ]
            ],
        }
    }
    cuts = adapter._parse_timeline(data)
    assert cuts == [{"start": 1.0, "end": 3.0}]


def test_parse_timeline_empty_when_unparseable():
    adapter = AutoEditorAdapter.__new__(AutoEditorAdapter)
    assert adapter._parse_timeline({"timeline": {}}) == []


def test_is_available_false_without_binary(monkeypatch):
    monkeypatch.setattr(
        "voicecut.integrations.auto_editor_adapter.shutil.which",
        lambda _name: None,
    )
    adapter = AutoEditorAdapter.__new__(AutoEditorAdapter)
    assert adapter.is_available() is False
