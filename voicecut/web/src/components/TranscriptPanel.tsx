import React from 'react';
import { useProjectStore } from '../store/useProjectStore';
import clsx from 'clsx';

export const TranscriptPanel: React.FC = () => {
  const { project, currentTime, setCurrentTime, updateCutStatus } = useProjectStore();

  if (!project || (!project.transcript_segments.length && !project.words.length)) {
    return (
      <div className="w-96 bg-card border-l border-border flex flex-col items-center justify-center p-6 text-center shrink-0">
        <p className="text-muted-foreground text-sm">Transcript will appear here after analysis.</p>
      </div>
    );
  }

  // Interleave words/segments and candidate cuts based on time
  const elements: ({ type: 'word'; data: any } | { type: 'cut'; data: any })[] = [];
  
  let itemIdx = 0;
  let cutIdx = 0;

  // Use word-level timestamps if available for precise inline placement
  const textItems = project.words.length > 0 ? project.words : project.transcript_segments.map(seg => ({
    word: seg.text,
    start: seg.start,
    end: seg.end
  }));

  while (itemIdx < textItems.length || cutIdx < project.candidate_cuts.length) {
    const txt = textItems[itemIdx];
    const cSeg = project.candidate_cuts[cutIdx];

    if (!txt) {
      elements.push({ type: 'cut', data: cSeg });
      cutIdx++;
    } else if (!cSeg) {
      elements.push({ type: 'word', data: txt });
      itemIdx++;
    } else {
      if (txt.start < cSeg.start) {
        elements.push({ type: 'word', data: txt });
        itemIdx++;
      } else {
        elements.push({ type: 'cut', data: cSeg });
        cutIdx++;
      }
    }
  }

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col overflow-hidden shrink-0">
      <div className="h-12 border-b border-border flex items-center justify-between px-6 font-semibold text-sm select-none">
        <span>Transcript & Edits</span>
        <span className="text-xs text-muted-foreground font-normal">Click silence to toggle cut/restore</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 leading-relaxed text-base tracking-wide space-y-4">
        <div className="paragraph-flow">
          {elements.map((el, idx) => {
            if (el.type === 'word') {
              const item = el.data;
              const isActive = currentTime >= item.start && currentTime <= item.end;
              
              return (
                <span
                  key={`w-${idx}`}
                  className={clsx(
                    "cursor-pointer transition-colors duration-200 rounded px-1 py-0.5",
                    isActive 
                      ? "bg-indigo-500/20 text-white font-medium border-b-2 border-indigo-500" 
                      : "text-foreground hover:bg-secondary"
                  )}
                  onClick={() => setCurrentTime(item.start)}
                >
                  {item.word}{' '}
                </span>
              );
            } else {
              const cut = el.data;
              const userDecision = (project.user_decisions || []).find((d) => d.cut_id === cut.id);
              const activeStatus = userDecision ? userDecision.action : cut.status;
              
              return (
                <span
                  key={`c-${cut.id}`}
                  onClick={() => updateCutStatus(cut.id, activeStatus === 'cut' ? 'kept' : 'cut')}
                  className={clsx(
                    "inline-flex items-center justify-center px-2 py-0.5 mx-1 rounded text-xs font-mono font-bold cursor-pointer transition-all duration-200 border select-none",
                    activeStatus === 'cut' 
                      ? "bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20 line-through opacity-50" 
                      : "bg-blue-500/10 border-blue-500/40 text-blue-400 hover:bg-blue-500/20"
                  )}
                  title={activeStatus === 'cut' ? "Click to restore silence" : "Click to cut silence"}
                >
                  [{(cut.duration !== undefined ? cut.duration : (cut.end - cut.start)).toFixed(1)}s]
                </span>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

