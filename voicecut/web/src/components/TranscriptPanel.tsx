import React, { useRef, useEffect, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import clsx from 'clsx';
import { Search, Copy, Download, AlignLeft } from 'lucide-react';
import {
  buildPlainText,
  buildSrt,
  cuesFromTranscript,
  downloadTextFile,
  wordMatchesQuery,
} from '../lib/transcriptUtils';
import { reportError } from '../lib/errorReporter';
import React, { useRef, useEffect } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import clsx from 'clsx';
import { Search, Copy, Download, AlignLeft } from 'lucide-react';

export const TranscriptPanel: React.FC = () => {
  const { project, currentTime, setSeekTo, updateCutStatus } = useProjectStore();
  const activeRef = useRef<HTMLSpanElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  // Auto-scroll active word into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [Math.floor(currentTime)]);

  if (!project || (!project.transcript_segments.length && !project.words.length)) {
    return (
      <div className="w-72 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center justify-center p-6 text-center">
        <AlignLeft className="w-8 h-8 text-zinc-700 mb-3" />
        <p className="text-zinc-600 text-sm">Transcript will appear here after analysis.</p>
      </div>
    );
  }

  // Interleave words and cuts sorted by start time
  const elements: ({ type: 'word'; data: any } | { type: 'cut'; data: any })[] = [];
  const textItems = project.words.length > 0
    ? project.words
    : project.transcript_segments.map(seg => ({ word: seg.text, start: seg.start, end: seg.end }));

  const handleCopy = async () => {
    const text = buildPlainText(project.transcript_segments, project.words);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 2000);
    } catch (err) {
      setCopyState('failed');
      reportError('transcript_copy', err);
      window.setTimeout(() => setCopyState('idle'), 2000);
    }
  };

  const handleExportSrt = () => {
    const cues = cuesFromTranscript(project.transcript_segments, project.words);
    if (cues.length === 0) return;
    downloadTextFile('subtitles.srt', buildSrt(cues), 'application/x-subrip');
  };

  // Interleave words and cuts sorted by start time
  const elements: ({ type: 'word'; data: (typeof textItems)[number] } | { type: 'cut'; data: (typeof project.candidate_cuts)[number] })[] = [];

  let wi = 0, ci = 0;
  while (wi < textItems.length || ci < project.candidate_cuts.length) {
    const txt = textItems[wi];
    const cut = project.candidate_cuts[ci];
    if (!txt) { elements.push({ type: 'cut', data: cut }); ci++; }
    else if (!cut || txt.start < cut.start) { elements.push({ type: 'word', data: txt }); wi++; }
    else { elements.push({ type: 'cut', data: cut }); ci++; }
  }

  return (
    <div className="w-72 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-11 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
        <span className="text-xs font-semibold text-zinc-300">Transcript</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Search"
            aria-label="Search transcript"
            onClick={() => setShowSearch((open) => !open)}
            className="text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title={copyState === 'copied' ? 'Copied' : 'Copy'}
            aria-label="Copy transcript"
            onClick={() => {
              void handleCopy();
            }}
            className="text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Export SRT"
            aria-label="Export SRT"
            onClick={handleExportSrt}
            className="text-zinc-600 hover:text-zinc-300 transition-colors"
          >
          <button title="Search" className="text-zinc-600 hover:text-zinc-300 transition-colors">
            <Search className="w-3.5 h-3.5" />
          </button>
          <button title="Copy" className="text-zinc-600 hover:text-zinc-300 transition-colors">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button title="Export SRT" className="text-zinc-600 hover:text-zinc-300 transition-colors">
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="px-4 py-2 border-b border-zinc-800 shrink-0">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Find in transcript..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/60"
            aria-label="Find in transcript"
          />
        </div>
      )}

      <p className="text-[10px] text-zinc-600 px-4 py-2 shrink-0">
        Click silence badge to toggle cut/restore
      </p>

      {/* Transcript flow */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="text-sm leading-7 tracking-wide text-zinc-300 break-words">
          {elements.map((el, idx) => {
            if (el.type === 'word') {
              const item = el.data;
              const isActive = currentTime >= item.start && currentTime <= item.end;
              const isPast = currentTime > item.end;
              const isMatch = wordMatchesQuery(item.word, searchQuery);
              return (
                <span
                  key={`w-${idx}`}
                  ref={isActive ? activeRef : undefined}
                  className={clsx(
                    'cursor-pointer rounded px-0.5 transition-all duration-150',
                    isMatch && 'bg-amber-400/30 text-amber-100',
                    !isMatch && isActive && 'bg-indigo-500/25 text-white font-medium',
                    !isMatch && !isActive && isPast && 'text-zinc-300 hover:bg-zinc-800',
                    !isMatch && !isActive && !isPast && 'text-zinc-600 hover:bg-zinc-800'
              return (
                <span
                  key={`w-${idx}`}
                  ref={isActive ? (activeRef as any) : undefined}
                  className={clsx(
                    'cursor-pointer rounded px-0.5 transition-all duration-150',
                    isActive
                      ? 'bg-indigo-500/25 text-white font-medium'
                      : isPast
                        ? 'text-zinc-300 hover:bg-zinc-800'
                        : 'text-zinc-600 hover:bg-zinc-800'
                  )}
                  onClick={() => setSeekTo(item.start)}
                >
                  {item.word}{' '}
                </span>
              );
            }

            // Cut badge — Vizard-style inline [Xs]
            const cut = el.data;
            const userDecision = (project.user_decisions || []).find(d => d.cut_id === cut.id);
            const activeStatus = userDecision ? userDecision.action : cut.status;
            const dur = (cut.duration ?? (cut.end - cut.start)).toFixed(1);

            return (
              <span
                key={`c-${cut.id}`}
                onClick={() => updateCutStatus(cut.id, activeStatus === 'cut' ? 'kept' : 'cut')}
                title={activeStatus === 'cut' ? 'Click to restore' : 'Click to cut'}
                className={clsx(
                  'inline-flex items-center mx-1 my-0.5 px-1.5 py-px rounded text-[10px] font-mono font-semibold cursor-pointer transition-all duration-200 select-none align-middle',
                  activeStatus === 'cut'
                    ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                    : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/25'
                )}
              >
                [{dur}s]
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
