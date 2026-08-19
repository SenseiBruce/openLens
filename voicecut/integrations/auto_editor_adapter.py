"""
Auto-Editor Adapter
===================
Wraps the locally-cloned auto-editor repo via subprocess CLI.
Used ONLY as a fallback baseline engine, not the primary speech-detection approach.

Repo: /OpenLens/auto-editor  (Nim binary, no Python API)
Usage: auto-editor binary must be on PATH (compiled from repo or pip install auto-editor)
License: Unlicense (public domain)

Integration note:
  auto-editor works on audio loudness, NOT speech. It is used here for:
  1. "Quick Mode" baseline cuts without AI (fallback if VAD/WhisperX fail)
  2. Compare mode to show difference between loudness-based vs speech-based cuts
  3. Testing/debugging the export pipeline

The adapter calls: auto-editor <video> --export json
and parses the resulting JSON timeline to extract cut segments.
"""
from __future__ import annotations

import json
import logging
import shutil
import subprocess
import tempfile
from pathlib import Path

logger = logging.getLogger(__name__)


class AutoEditorAdapter:
    """
    CLI subprocess adapter for WyattBlue/auto-editor.

    Auto-editor is a Nim binary; we call it via subprocess and parse JSON output.
    This is strictly a fallback/comparison tool — primary detection is Silero VAD.
    """

    def __init__(self, binary_path: str | None = None):
        """
        Args:
            binary_path: Optional path to auto-editor binary.
                         Defaults to searching PATH for 'auto-editor'.
        """
        self._binary = binary_path or self._find_binary()

    def _find_binary(self) -> str:
        """Locate auto-editor binary on PATH."""
        path = shutil.which("auto-editor")
        if not path:
            raise RuntimeError(
                "auto-editor not found on PATH. "
                "Install with: pip install auto-editor"
            )
        return path

    def is_available(self) -> bool:
        """Check if auto-editor binary is available."""
        try:
            self._find_binary()
            return True
        except RuntimeError:
            return False

    def get_version(self) -> str:
        """Return auto-editor version string."""
        result = subprocess.run(
            [self._binary, "--version"],
            capture_output=True, text=True
        )
        return result.stdout.strip()

    def baseline_cuts(
        self,
        video_path: str | Path,
        silence_threshold: float = 0.04,
        margin: float = 0.2,
    ) -> list[dict]:
        """
        Run auto-editor loudness-based silence detection.

        Args:
            video_path: Input video file path.
            silence_threshold: Audio threshold below which is considered silence (0–1).
            margin: Padding around non-silent regions in seconds.

        Returns:
            List of gap (silence) segments: [{"start": float, "end": float}, ...]
            These represent regions auto-editor WOULD cut (silent sections).
        """
        video_path = Path(video_path)
        if not video_path.exists():
            raise FileNotFoundError(f"Video not found: {video_path}")

        logger.info(f"Running auto-editor baseline on: {video_path}")

        with tempfile.TemporaryDirectory() as tmpdir:
            output_json = Path(tmpdir) / "timeline.json"

            cmd = [
                self._binary,
                str(video_path),
                "--edit", f"audio:threshold={silence_threshold}",
                "--margin", f"{margin}sec",
                "--export", "json",
                "--output", str(output_json),
                "--no-open",
            ]

            try:
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    cwd=tmpdir,
                    timeout=300,
                )
            except subprocess.TimeoutExpired as exc:
                raise RuntimeError("auto-editor timed out after 5 minutes") from exc

            if result.returncode != 0:
                raise RuntimeError(
                    f"auto-editor failed (exit {result.returncode}):\n{result.stderr}"
                )

            # Locate the exported JSON (auto-editor may name it differently)
            json_files = list(Path(tmpdir).glob("*.json"))
            if not json_files:
                raise RuntimeError("auto-editor did not produce a JSON output file")

            with open(json_files[0]) as f:
                data = json.load(f)

        return self._parse_timeline(data)

    def _parse_timeline(self, data: dict) -> list[dict]:
        """
        Parse auto-editor JSON timeline to extract silence/cut regions.

        auto-editor JSON structure (v25+):
        {
          "timeline": {
            "v": [...video clips...],
            "a": [...audio clips...],
          }
        }
        We look for gaps between kept clips to find cut regions.
        """
        try:
            timeline = data.get("timeline", data)
            fps = float(timeline.get("fps", [30])[0] if isinstance(timeline.get("fps"), list) else timeline.get("fps", 30))

            # Try to extract kept video clips
            kept_clips = []

            v_tracks = timeline.get("v", [])
            for track in v_tracks:
                for clip in track:
                    if isinstance(clip, dict):
                        src_start = clip.get("offset", 0) / fps
                        duration = clip.get("dur", 0) / fps
                        kept_clips.append({
                            "start": round(src_start, 3),
                            "end": round(src_start + duration, 3),
                        })

            if not kept_clips:
                logger.warning("Could not parse auto-editor timeline; returning empty baseline")
                return []

            # Sort by original source position
            kept_clips.sort(key=lambda c: c["start"])

            # Gaps between kept clips = auto-editor's cut regions
            cuts = []
            for i in range(len(kept_clips) - 1):
                gap_start = kept_clips[i]["end"]
                gap_end = kept_clips[i + 1]["start"]
                if gap_end - gap_start > 0.05:  # ignore tiny rounding gaps
                    cuts.append({
                        "start": round(gap_start, 3),
                        "end": round(gap_end, 3),
                    })

            logger.info(f"auto-editor baseline: {len(cuts)} cut regions identified")
            return cuts

        except Exception as e:
            logger.warning(f"Could not parse auto-editor JSON: {e}")
            return []
