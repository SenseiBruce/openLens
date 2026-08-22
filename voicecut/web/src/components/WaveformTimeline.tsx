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
  const { project, currentTime, setCurrentTime, setSeekTo, updateCutStatus } = useProjectStore();

  useEffect(() => {
    if (!containerRef.current || !timelineRef.current || !project?.audio_path) return;

    const audioUrl = `/files/uploads/${project.id}/audio.wav`;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#3f3f46',       // zinc-700
      progressColor: '#6366f1',   // indigo-500
      cursorColor: '#a5b4fc',     // indigo-300
      cursorWidth: 1,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 56,
      plugins: [
        TimelinePlugin.create({
          container: timelineRef.current,
          timeInterval: 5,
          primaryLabelInterval: 10,
          style: { fontSize: '9px', color: '#52525b' },
        }),
        RegionsPlugin.create(),
      ],
    });

    wsRef.current = ws;
    wsRegionsRef.current = ws.getActivePlugins()[1];
    ws.load(audioUrl);

    ws.on('timeupdate', (time) => {
      if (Math.abs(currentTime - time) > 0.1) setCurrentTime(time);
    });

    ws.on('interaction', (time) => {
      setSeekTo(time);
    });

    return () => { ws.destroy(); };
  }, [project?.audio_path]);

  // Sync external seeks
  useEffect(() => {
    if (wsRef.current && wsRef.current.getDuration() > 0) {
      if (Math.abs(wsRef.current.getCurrentTime() - currentTime) > 0.1) {
        wsRef.current.setTime(currentTime);
      }
    }
  }, [currentTime]);

  // Draw regions
  useEffect(() => {
    if (!wsRegionsRef.current || !project) return;
    const reg = wsRegionsRef.current;
    reg.clearRegions();

    project.speech_segments.forEach((seg) => {
      reg.addRegion({
        start: seg.start,
        end: seg.end,
        color: 'rgba(99, 102, 241, 0.12)',   // indigo tint for speech
        drag: false,
        resize: false,
      });
    });

    project.candidate_cuts.forEach((cut) => {
      const userDecision = (project.user_decisions || []).find(d => d.cut_id === cut.id);
      const activeStatus = userDecision ? userDecision.action : cut.status;

      const color =
        activeStatus === 'cut'  ? 'rgba(239, 68, 68, 0.25)' :   // red
        activeStatus === 'kept' ? 'rgba(34, 197, 94, 0.20)'  :   // green
                                  'rgba(161,161,170, 0.15)';      // gray pending

      const region = reg.addRegion({
        id: cut.id,
        start: cut.start,
        end: cut.end,
        color,
        drag: false,
        resize: false,
      });

      region.on('click', (e: Event) => {
        e.stopPropagation();
        updateCutStatus(cut.id, activeStatus === 'cut' ? 'kept' : 'cut');
      });
    });
  }, [project?.candidate_cuts, project?.user_decisions, project?.speech_segments]);

  return (
    <div className="shrink-0 bg-zinc-950 border-t border-zinc-800">
      {/* Track label row */}
      <div className="flex items-center gap-3 px-4 pt-2 pb-1">
        <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">Subtitle</span>
        <div className="flex items-center gap-3 ml-auto text-[10px] text-zinc-600">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-500/40 inline-block"/>Speech</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500/50 inline-block"/>Cut</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500/40 inline-block"/>Kept</span>
        </div>
      </div>
      {/* Timeline ticks */}
      <div ref={timelineRef} className="px-4 h-4" />
      {/* Waveform */}
      <div ref={containerRef} className="w-full px-4 pb-3" />
    </div>
  );
};
