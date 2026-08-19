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
from collections.abc import Callable
from pathlib import Path

import structlog

from voicecut.backend.export.edl import build_edl, compute_kept_segments
from voicecut.shared.models import ExportFormat, Project, ViralClip

logger = structlog.get_logger(__name__)


class VideoRenderer:
    """
    Renders final edited video by:
    1. Determining kept segments from user decisions.
    2. Writing an FFmpeg concat list.
    3. Running FFmpeg to concatenate and output final video.
    """

    def __init__(self, exports_dir: Path):
        self.exports_dir = exports_dir

    # Map resolution label → target height (width calculated to preserve AR)
    RESOLUTION_MAP: dict[str, int] = {
        "2160p": 2160,  # 4K
        "1440p": 1440,  # 2K
        "1080p": 1080,
        "720p":  720,
        "480p":  480,
        "360p":  360,
    }

    async def render(
        self,
        project: Project,
        formats: list[ExportFormat],
        on_event: Callable[[str, dict], None],
        resolution: str | None = None,
    ) -> dict[str, str]:
        """
        Render final output files.

        Args:
            project: Project with all segments and decisions.
            formats: List of ExportFormat to generate.
            on_event: Progress callback.
            resolution: Optional target resolution label e.g. '1080p', '2160p'.
                        None = lossless copy at original resolution.

        Returns:
            Dict mapping format name → output file path.
        """
        output_dir = self.exports_dir / project.id
        output_dir.mkdir(parents=True, exist_ok=True)

        structlog.contextvars.bind_contextvars(project_id=project.id)
        try:
            results = {}

            # Compute kept time ranges
            kept_segments = compute_kept_segments(project)
            if not kept_segments:
                raise ValueError("No segments to keep — all cuts are marked as 'cut'")

            on_event("progress", {"percent": 10, "message": f"Preparing {len(kept_segments)} segments..."})

            # Resolve target height from resolution label
            target_height: int | None = self.RESOLUTION_MAP.get(resolution or "", None)

            # MP4 export
            if ExportFormat.MP4 in formats:
                on_event("step", {"step": "rendering_video", "message": "Rendering final video...", "percent": 20})
                mp4_path = await self._render_mp4(
                    video_path=Path(project.video_path),
                    kept_segments=kept_segments,
                    output_dir=output_dir,
                    on_event=on_event,
                    target_height=target_height,
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
                edl = build_edl(project, kept_segments)
                edl_path.write_text(json.dumps(edl, indent=2))
                results["json_edl"] = str(edl_path)

            on_event("complete", {"percent": 100, "message": "Export complete!", "files": results})
            return results
        finally:
            structlog.contextvars.unbind_contextvars("project_id")

    def _compute_kept_segments(self, project: Project) -> list[tuple[float, float]]:
        return compute_kept_segments(project)

    async def _render_mp4(
        self,
        video_path: Path,
        kept_segments: list[tuple[float, float]],
        output_dir: Path,
        on_event: Callable[[str, dict], None],
        target_height: int | None = None,
    ) -> Path:
        """Render MP4 using FFmpeg concat demuxer.
        
        - target_height=None → lossless copy at original resolution.
        - target_height set  → re-encode with scale filter (preserves AR).
          Uses -2 for width so it's divisible by 2 (required by libx264).
        """
        output_path = output_dir / "final_output.mp4"
        concat_list = output_dir / "concat_list.txt"

        # Build concat list
        lines = []
        for start, end in kept_segments:
            lines.append(f"file '{video_path.resolve()}'")
            lines.append(f"inpoint {start:.6f}")
            lines.append(f"outpoint {end:.6f}")
        concat_list.write_text("\n".join(lines))

        on_event("progress", {"percent": 40, "message": "Running FFmpeg..."})

        if target_height is None:
            # --- Lossless copy (no re-encode) ---
            cmd = [
                "ffmpeg", "-y",
                "-f", "concat",
                "-safe", "0",
                "-i", str(concat_list),
                "-c", "copy",
                "-movflags", "+faststart",
                str(output_path),
            ]
            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            _, stderr = await proc.communicate()

            if proc.returncode != 0:
                logger.warning("lossless_copy_failed", fallback="re-encode")
                target_height = -1  # sentinel: re-encode without scale

        if target_height is not None:
            # --- Re-encode with optional scale ---
            scale_filter = (
                f"scale=-2:{target_height}" if target_height > 0 else "scale=iw:ih"
            )
            on_event("progress", {"percent": 50, "message": f"Re-encoding video{f' at {target_height}p' if target_height > 0 else ''}..."})
            cmd_reenc = [
                "ffmpeg", "-y",
                "-f", "concat",
                "-safe", "0",
                "-i", str(concat_list),
                "-vf", scale_filter,
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
        logger.info("video_rendered", path=str(output_path))
        return output_path

    def _build_edl(self, project: Project, kept_segments: list[tuple[float, float]]) -> dict:
        return build_edl(project, kept_segments)

    async def render_viral_clip(self, project: Project, clip: ViralClip) -> Path:
        """Render a single standalone viral clip without re-encoding (if possible)."""
        output_dir = self.exports_dir / project.id / "viral_clips"
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Sanitize title for filename
        import re
        safe_title = re.sub(r'[^a-zA-Z0-9_\-]', '_', clip.title.lower())
        output_path = output_dir / f"{safe_title}_{clip.id}.mp4"
        
        # Fast extraction using copy
        cmd = [
            "ffmpeg", "-y",
            "-i", str(project.video_path),
            "-ss", str(clip.start),
            "-to", str(clip.end),
            "-c:v", "copy",
            "-c:a", "copy",
            "-movflags", "+faststart",
            str(output_path),
        ]
        
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr = await proc.communicate()
        
        if proc.returncode != 0:
            logger.error("viral_clip_render_failed", error=stderr.decode())
            raise RuntimeError("Failed to render viral clip")
            
        return output_path

