import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import { useProjectStore } from '../store/useProjectStore';

export const WaveformTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const wsRegionsRef = useRef<any>(null);
  const { project, currentTime, setCurrentTime, updateCutStatus } = useProjectStore();

  useEffect(() => {
    if (!containerRef.current || !timelineRef.current || !project?.audio_path) return;

    // We can fetch the audio file from the backend
    const audioUrl = `/files/uploads/${project.id}/audio.wav`;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#3f3f46', // tailwind zinc-700
      progressColor: '#6366f1', // tailwind indigo-500
      cursorColor: '#818cf8',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 80,
      plugins: [
        TimelinePlugin.create({ container: timelineRef.current }),
        RegionsPlugin.create(),
      ],
    });

    wsRef.current = ws;
    wsRegionsRef.current = ws.getActivePlugins()[1];

    ws.load(audioUrl);

    ws.on('timeupdate', (time) => {
      // Avoid infinite loops with react-player by only setting if diff > 0.1
      if (Math.abs(currentTime - time) > 0.1) {
        setCurrentTime(time);
      }
    });

    return () => {
      ws.destroy();
    };
  }, [project?.audio_path]);

  // Sync external time changes (from VideoPlayer or Transcript)
  useEffect(() => {
    if (wsRef.current && wsRef.current.getDuration() > 0) {
      if (Math.abs(wsRef.current.getCurrentTime() - currentTime) > 0.1) {
        wsRef.current.setTime(currentTime);
      }
    }
  }, [currentTime]);

  // Draw regions when cuts change
  useEffect(() => {
    if (!wsRegionsRef.current || !project) return;
    const regionsPlugin = wsRegionsRef.current;
    
    // Clear existing
    regionsPlugin.clearRegions();

    // Draw speech segments (Greenish)
    project.speech_segments.forEach((seg) => {
      regionsPlugin.addRegion({
        start: seg.start,
        end: seg.end,
        color: 'rgba(34, 197, 94, 0.2)', // green-500 with opacity
        drag: false,
        resize: false,
      });
    });

    // Draw candidate cuts (Grayish or Reddish if cut)
    project.candidate_cuts.forEach((cut) => {
      // Check user decision override
      const userDecision = (project.user_decisions || []).find((d) => d.cut_id === cut.id);
      const activeStatus = userDecision ? userDecision.action : cut.status;

      let color = 'rgba(161, 161, 170, 0.4)'; // Default gray (pending)
      if (activeStatus === 'cut') color = 'rgba(239, 68, 68, 0.4)'; // Red
      if (activeStatus === 'kept') color = 'rgba(59, 130, 246, 0.4)'; // Blue

      const region = regionsPlugin.addRegion({
        id: cut.id,
        start: cut.start,
        end: cut.end,
        color: color,
        drag: false,
        resize: false,
      });

      // Context menu event (could be standard click for simplicity)
      region.on('click', (e: Event) => {
        e.stopPropagation();
        const nextStatus = activeStatus === 'cut' ? 'kept' : 'cut';
        updateCutStatus(cut.id, nextStatus);
      });
    });
  }, [project?.candidate_cuts, project?.user_decisions, project?.speech_segments]);

  return (
    <div className="h-32 bg-card border-t border-border p-4 shrink-0 flex flex-col">
      <div ref={timelineRef} className="h-6 text-xs text-muted-foreground" />
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  );
};
