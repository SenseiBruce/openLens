import React, { useRef, useState, useEffect } from 'react';
import { useProjectStore } from '../store/useProjectStore';

export const VideoPlayer: React.FC = () => {
  const { project, setCurrentTime } = useProjectStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  if (!project?.video_path) {
    return (
      <div className="flex-1 bg-black flex items-center justify-center rounded-xl border border-border">
        <p className="text-muted-foreground">Upload a video to begin</p>
      </div>
    );
  }

  const videoFilename = project.video_path.split(/[\\\/]/).pop() ?? 'video.mp4';
  const videoUrl = `http://localhost:8000/files/uploads/${project.id}/${videoFilename}`;

  // Skip over segments marked as cuts
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    // Update store
    setCurrentTime(current);

    const userDecisions = project?.user_decisions || [];
    const cuts = project?.candidate_cuts || [];
    const activeCut = cuts.find(cut => {
      const decision = userDecisions.find(d => d.cut_id === cut.id);
      const status = decision ? decision.action : cut.status;
      return status === 'cut' && current >= cut.start && current < cut.end;
    });
    if (activeCut && videoRef.current) {
      videoRef.current.currentTime = activeCut.end;
    }
  };

  useEffect(() => {
    if (videoRef.current && isReady) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error('Autoplay failed', err);
        });
      }
    }
  }, [isReady]);

  return (
    <div className="flex-1 bg-black rounded-xl overflow-hidden border border-border flex flex-col relative group">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        muted
        playsInline
        crossOrigin="anonymous"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        onCanPlay={() => setIsReady(true)}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};
