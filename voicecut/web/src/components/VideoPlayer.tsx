import React, { useRef, useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { formatVideoFilename } from '../lib/videoFilename';
import { reportError } from '../lib/errorReporter';

export const VideoPlayer: React.FC = () => {
  const { project, setCurrentTime, seekTo, clearSeekTo, skipCuts } = useProjectStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (seekTo !== null && videoRef.current) {
      videoRef.current.currentTime = seekTo;
      videoRef.current.play().catch(() => {});
      clearSeekTo();
    }
  }, [seekTo, clearSeekTo]);

  if (!project?.video_path) {
    return (
      <div className="flex-1 bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-600 text-sm">Upload a video to begin</p>
      </div>
    );
  }

  const videoFilename = project.video_path.split(/[\\/]/).pop() ?? 'video.mp4';
  const videoUrl = `http://localhost:8000/files/uploads/${project.id}/${videoFilename}`;

  // Skip over segments marked as cuts
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    const userDecisions = project?.user_decisions || [];
    const cuts = project?.candidate_cuts || [];
    const activeCut = cuts.find(cut => {
      const decision = userDecisions.find(d => d.cut_id === cut.id);
      const status = decision ? decision.action : cut.status;
      return status === 'cut' && current >= cut.start && current < cut.end;
    });
    if (skipCuts && activeCut && videoRef.current) {
      videoRef.current.currentTime = activeCut.end;
    }
  };

  const handleCopyFilename = async () => {
    try {
      await navigator.clipboard.writeText(formatVideoFilename(project.video_path));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      reportError('copy-video-filename', err);
    }
  };

  return (
    <div className="flex-1 bg-black overflow-hidden flex flex-col">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        playsInline
        crossOrigin="anonymous"
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="shrink-0 flex items-center justify-between px-3 py-1.5 bg-zinc-950 border-t border-zinc-800">
        <span className="text-xs text-zinc-400 truncate" title={videoFilename}>{videoFilename}</span>
        <button
          type="button"
          onClick={handleCopyFilename}
          className="p-0.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-800"
          title="Copy video filename"
          aria-label="Copy video filename"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
