import React, { useRef, useEffect } from 'react';
import { useProjectStore } from '../store/useProjectStore';

export const VideoPlayer: React.FC = () => {
  const { project, setCurrentTime, seekTo, clearSeekTo, skipCuts } = useProjectStore();
  const videoRef = useRef<HTMLVideoElement>(null);

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
    </div>
  );
};
