"""
VoiceCut Export Engine
=======================
Renders final edited video using FFmpeg based on user decisions.
Also exports SRT, VTT, and JSON EDL.

Uses FFmpeg concat demuxer for lossless segment stitching when possible.
Falls back to re-encode (libx264/aac) if streams are not compatible.
"""
from __future__ import annotations
import asyncio
import json
import logging
from pathlib import Path
from typing import Callable

from voicecut.shared.models import (
    Project, CandidateCut, CutStatus, ExportFormat
)

logger = logging.getLogger(__name__)


class VideoRenderer:
    """
    Renders final edited video by:
    1. Determining kept segments from user decisions.
    2. Writing an FFmpeg concat list.
    3. Running FFmpeg to concatenate and output final video.
    """

    def __init__(self, exports_dir: Path):
        self.exports_dir = exports_dir

    async def render(
        self,
        project: Project,
        formats: list[ExportFormat],
        on_event: Callable[[str, dict], None],
    ) -> dict[str, str]:
        """
        Render final output files.

        Args:
            project: Project with all segments and decisions.
            formats: List of ExportFormat to generate.
            on_event: Progress callback.

        Returns:
            Dict mapping format name → output file path.
        """
        output_dir = self.exports_dir / project.id
        output_dir.mkdir(parents=True, exist_ok=True)

        results = {}

        # Compute kept time ranges
        kept_segments = self._compute_kept_segments(project)
        if not kept_segments:
            raise ValueError("No segments to keep — all cuts are marked as 'cut'")

        on_event("progress", {"percent": 10, "message": f"Preparing {len(kept_segments)} segments..."})

        # MP4 export
        if ExportFormat.MP4 in formats:
            on_event("step", {"step": "rendering_video", "message": "Rendering final video...", "percent": 20})
            mp4_path = await self._render_mp4(
                video_path=Path(project.video_path),
                kept_segments=kept_segments,
                output_dir=output_dir,
                on_event=on_event,
            )
            results["mp4"] = str(mp4_path)
            project.output_path = str(mp4_path)

        # SRT export
        if ExportFormat.SRT in formats and project.srt_path:
            srt_out = output_dir / "final_subtitles.srt"
            srt_out.write_text(Path(project.srt_path).read_text())
            results["srt"] = str(srt_out)

        # VTT export
        if ExportFormat.VTT in formats and project.vtt_path:
            vtt_out = output_dir / "final_subtitles.vtt"
            vtt_out.write_text(Path(project.vtt_path).read_text())
            results["vtt"] = str(vtt_out)

        # JSON EDL export
        if ExportFormat.JSON_EDL in formats:
            edl_path = output_dir / "edit_decision_list.json"
            edl = self._build_edl(project, kept_segments)
            edl_path.write_text(json.dumps(edl, indent=2))
            results["json_edl"] = str(edl_path)

        on_event("complete", {"percent": 100, "message": "Export complete!", "files": results})
        return results

    def _compute_kept_segments(self, project: Project) -> list[tuple[float, float]]:
        """
        Determine which time ranges to keep based on user decisions.

        Logic:
        - Start with full video duration.
        - For each candidate cut marked as CUT, remove that range.
        - Sort remaining ranges and return them.
        """
        if not project.video_duration:
            raise ValueError("Project has no video_duration set")

        # Build set of cut ranges from decisions
        cut_ranges: list[tuple[float, float]] = []
        cut_ids = {d.cut_id for d in project.user_decisions if d.action == CutStatus.CUT}

        for cut in project.candidate_cuts:
            # Default status from the cut itself, or override from user decision
            decision_action = None
            for d in project.user_decisions:
                if d.cut_id == cut.id:
                    decision_action = d.action
                    break

            effective_status = decision_action or cut.status
            if effective_status == CutStatus.CUT:
                cut_ranges.append((cut.start, cut.end))

        # Start with full timeline
        kept: list[tuple[float, float]] = [(0.0, project.video_duration)]

        # Subtract each cut range
        for cut_start, cut_end in cut_ranges:
            new_kept = []
            for seg_start, seg_end in kept:
                if cut_end <= seg_start or cut_start >= seg_end:
                    # No overlap
                    new_kept.append((seg_start, seg_end))
                else:
                    # Partial overlap — keep parts outside the cut
                    if seg_start < cut_start:
                        new_kept.append((seg_start, cut_start))
                    if seg_end > cut_end:
                        new_kept.append((cut_end, seg_end))
            kept = new_kept

        # Filter very short segments (< 0.1s)
        kept = [(s, e) for s, e in kept if e - s >= 0.1]
        kept.sort(key=lambda x: x[0])
        return kept

    async def _render_mp4(
        self,
        video_path: Path,
        kept_segments: list[tuple[float, float]],
        output_dir: Path,
        on_event: Callable[[str, dict], None],
    ) -> Path:
        """Render MP4 using FFmpeg concat demuxer (lossless copy mode)."""
        output_path = output_dir / "final_output.mp4"
        concat_list = output_dir / "concat_list.txt"

        # Build concat list
        lines = []
        for start, end in kept_segments:
            lines.append(f"file '{video_path.resolve()}'")
            lines.append(f"inpoint {start:.6f}")
            lines.append(f"outpoint {end:.6f}")
        concat_list.write_text("\n".join(lines))

        cmd = [
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_list),
            "-c", "copy",              # lossless copy
            "-movflags", "+faststart",  # web-optimized
            str(output_path),
        ]

        on_event("progress", {"percent": 40, "message": "Running FFmpeg..."})

        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr = await proc.communicate()

        if proc.returncode != 0:
            # Fallback: re-encode (handles stream incompatibilities)
            logger.warning("Lossless copy failed, falling back to re-encode")
            on_event("progress", {"percent": 50, "message": "Re-encoding video..."})
            cmd_reenc = [
                "ffmpeg", "-y",
                "-f", "concat",
                "-safe", "0",
                "-i", str(concat_list),
                "-c:v", "libx264",
                "-preset", "fast",
                "-crf", "18",
                "-c:a", "aac",
                "-b:a", "192k",
                "-movflags", "+faststart",
                str(output_path),
            ]
            proc2 = await asyncio.create_subprocess_exec(
                *cmd_reenc,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            _, stderr2 = await proc2.communicate()
            if proc2.returncode != 0:
                raise RuntimeError(f"FFmpeg re-encode failed:\n{stderr2.decode()}")

        on_event("progress", {"percent": 90, "message": "Video rendered successfully"})
        logger.info(f"Final video: {output_path}")
        return output_path

    def _build_edl(self, project: Project, kept_segments: list[tuple[float, float]]) -> dict:
        """Build JSON Edit Decision List."""
        return {
            "version": "1.0",
            "project_id": project.id,
            "source_video": project.video_path,
            "kept_segments": [
                {"start": round(s, 3), "end": round(e, 3), "duration": round(e - s, 3)}
                for s, e in kept_segments
            ],
            "candidate_cuts": [
                {
                    "id": c.id,
                    "start": c.start,
                    "end": c.end,
                    "duration": c.duration,
                    "reason": c.reason.value,
                    "status": c.status.value,
                }
                for c in project.candidate_cuts
            ],
            "user_decisions": [
                {"cut_id": d.cut_id, "action": d.action.value}
                for d in project.user_decisions
            ],
        }
