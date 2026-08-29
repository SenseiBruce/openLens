import React, { useMemo, useEffect, useState } from 'react';
import { Upload, Play, Scissors, Download, Loader2, Clock, Sparkles, Copy, Check, List } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { apiClient } from '../api/client';
import { reportError } from '../lib/errorReporter';
import { computeKeptDuration, formatClock, formatDurationPill, formatKeptDurationSummary } from '../lib/keptDuration';
import { formatCutDecisionCounts } from '../lib/cutDecisionCounts';
import { formatProjectIdentity } from '../lib/projectIdentity';
import { formatBackendHealth } from '../lib/backendHealth';
import { formatSkipCuts } from '../lib/skipCuts';
import { formatWhisperModel } from '../lib/whisperModel';
import { formatProjectName } from '../lib/projectName';
import { formatKeptPercent } from '../lib/keptPercent';
import { AnalyzeModal } from './AnalyzeModal';
import { ChaptersModal } from './ChaptersModal';

export const TopBar: React.FC<{
  onAnalyzeStart: (settings: { whisper_model: string; min_gap_duration: number; language?: string; initial_prompt?: string }) => void;
  onExportStart: () => void;
  onViralClipsStart: () => void;
}> = ({ onAnalyzeStart, onExportStart, onViralClipsStart }) => {
  const [showAnalyzeModal, setShowAnalyzeModal] = React.useState(false);
  const [showChaptersModal, setShowChaptersModal] = React.useState(false);
  const { project, setProject, setIsUploading, skipCuts, setSkipCuts } = useProjectStore();
  const [health, setHealth] = useState<'live' | 'degraded' | 'offline'>('live');
  const [copiedDuration, setCopiedDuration] = useState(false);
  const [copiedDurationSummary, setCopiedDurationSummary] = useState(false);
  const [copiedCuts, setCopiedCuts] = useState(false);
  const [copiedIdentity, setCopiedIdentity] = useState(false);
  const [copiedProjectName, setCopiedProjectName] = useState(false);
  const [copiedKeptPercent, setCopiedKeptPercent] = useState(false);

  // Poll backend health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await apiClient.getDetailedHealth();
        setHealth(data.status === 'healthy' ? 'live' : 'degraded');
      } catch {
        setHealth('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Live kept-duration: total minus all effectively-cut segments
  const { totalDur, keptDur, removedDur } = useMemo(
    () => computeKeptDuration(project),
    [project],
  );

  const handleHome = () => {
    setProject(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const { project_id } = await apiClient.uploadVideo(file);
      const newProject = await apiClient.getProject(project_id);
      setProject(newProject);
    } catch (err) {
      reportError('upload', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyIdentity = async () => {
    if (!project) return;
    try {
      await navigator.clipboard.writeText(formatProjectIdentity({ id: project.id, name: project.name }));
      setCopiedIdentity(true);
      window.setTimeout(() => setCopiedIdentity(false), 2000);
    } catch (err) {
      reportError('copy-project-id', err);
    }
  };

  const handleCopyProjectName = async () => {
    if (!project) return;
    try {
      await navigator.clipboard.writeText(formatProjectName(project.name));
      setCopiedProjectName(true);
      window.setTimeout(() => setCopiedProjectName(false), 2000);
    } catch (err) {
      reportError('copy-project-name', err);
    }
  };

  const showDuration = project?.status === 'ready' && totalDur > 0;
  const pct = totalDur > 0 ? (keptDur / totalDur) * 100 : 100;

  return (
    <div className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-5 shrink-0 gap-4">
      {/* Brand */}
      <button onClick={handleHome} className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity focus:outline-none">
        <Scissors className="w-4 h-4 text-indigo-400" />
        <span className="font-bold text-sm tracking-tight text-white">VoiceCut</span>
      </button>

      {/* Duration indicator */}
      {showDuration ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />

            {/* Bar */}
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(formatKeptPercent(keptDur, totalDur));
                  setCopiedKeptPercent(true);
                  window.setTimeout(() => setCopiedKeptPercent(false), 2000);
                } catch {
                  setCopiedKeptPercent(false);
                }
              }}
              className="text-[10px] font-medium text-zinc-400 hover:text-white"
              title="Copy kept percent"
              aria-label="Copy kept percent"
            >
              {copiedKeptPercent ? 'Copied %' : `${pct.toFixed(0)}%`}
            </button>
            <div className="w-32 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${pct}%`,
                  background: pct > 70
                    ? '#6366f1'   // indigo — healthy
                    : pct > 40
                    ? '#f59e0b'   // amber — moderate cuts
                    : '#ef4444',  // red — heavy cuts
                }}
              />
            </div>

            {/* Times */}
            <span className="text-xs font-mono text-white tabular-nums">
              {formatClock(keptDur)}
            </span>
            <span className="text-[10px] text-zinc-500 tabular-nums">
              / {formatClock(totalDur)}
            </span>
            {removedDur > 0.5 && (
              <span className="text-[10px] font-medium text-red-400 tabular-nums">
                -{formatClock(removedDur)}
              </span>
            )}
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(formatDurationPill(project));
                  setCopiedDuration(true);
                  window.setTimeout(() => setCopiedDuration(false), 2000);
                } catch {
                  setCopiedDuration(false);
                }
              }}
              className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white"
              title="Copy kept duration"
              aria-label="Copy kept duration"
            >
              {copiedDuration ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedDuration ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    formatKeptDurationSummary({ totalDur, keptDur, removedDur }),
                  );
                  setCopiedDurationSummary(true);
                  window.setTimeout(() => setCopiedDurationSummary(false), 2000);
                } catch {
                  setCopiedDurationSummary(false);
                }
              }}
              className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white"
              title="Copy kept duration summary"
              aria-label="Copy kept duration summary"
            >
              {copiedDurationSummary ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedDurationSummary ? 'Copied' : 'Copy summary'}
            </button>
            <button
              type="button"
              className="text-[10px] font-medium text-zinc-400 hover:text-white"
              aria-label="Copy cuts"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(formatCutDecisionCounts(project));
                  setCopiedCuts(true);
                  window.setTimeout(() => setCopiedCuts(false), 2000);
                } catch {
                  setCopiedCuts(false);
                }
              }}
            >
              {copiedCuts ? 'Copied' : 'Copy cuts'}
            </button>
            <button
              type="button"
              className="text-[10px] font-medium text-zinc-400 hover:text-white"
              aria-label="Copy project name"
              title="Copy project name"
              onClick={() => {
                void handleCopyProjectName();
              }}
            >
              {copiedProjectName ? 'Copied name' : 'Copy name'}
            </button>
          </div>
        </div>
      ) : (
        /* Project name pill when no duration yet */
        project?.name ? (
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="max-w-48 truncate">{project.name}</span>
              <button
                type="button"
                onClick={handleCopyProjectName}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                title="Copy project name"
                aria-label="Copy project name"
              >
                {copiedProjectName ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <button
                type="button"
                onClick={handleCopyIdentity}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                title="Copy project id"
                aria-label="Copy project id"
              >
                {copiedIdentity ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        ) : <div className="flex-1" />
      )}

      {/* Actions (Only show if project exists) */}
      {project ? (
        <div className="flex items-center gap-4 shrink-0">
          <label className="flex items-center cursor-pointer gap-2 mr-2">
            <span className="text-xs font-medium text-zinc-300">Skip Cuts</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={skipCuts}
                onChange={(e) => setSkipCuts(e.target.checked)}
              />
              <div className={`block w-8 h-5 rounded-full transition-colors ${skipCuts ? 'bg-indigo-600' : 'bg-zinc-700'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${skipCuts ? 'transform translate-x-3' : ''}`}></div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void navigator.clipboard.writeText(formatSkipCuts(skipCuts)).catch((err) => {
                  reportError('copy-skip-cuts', err);
                });
              }}
              className="p-0.5 rounded hover:bg-zinc-800"
              aria-label="Copy skip-cuts setting"
              title="Copy skip-cuts setting"
            >
              <Copy className="w-3 h-3 text-zinc-500" />
            </button>
          </label>

          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  formatWhisperModel(project.settings?.whisper_model),
                );
              } catch (err) {
                reportError('copy-whisper-model', err);
              }
            }}
            className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white"
            title="Copy Whisper model"
            aria-label="Copy Whisper model"
          >
            <Copy className="w-3 h-3" />
            {project.settings?.whisper_model || 'model'}
          </button>

          <label className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md px-3 py-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Import Video
            <input type="file" className="hidden" accept="video/*" onChange={handleUpload} />
          </label>

          <button
            onClick={() => setShowAnalyzeModal(true)}
            disabled={project.status !== 'idle'}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-md px-3 py-1.5 transition-colors"
          >
            {project.status === 'analyzing'
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Play className="w-3.5 h-3.5" />}
            Remove Silences
          </button>

          <button
            onClick={() => setShowChaptersModal(true)}
            disabled={project.status === 'analyzing'}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-700 rounded-md px-3 py-1.5 transition-colors"
          >
            <List className="w-3.5 h-3.5" />
            Chapters
          </button>

          <button
            onClick={onViralClipsStart}
            disabled={project.status !== 'ready'}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-700 rounded-md px-3 py-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Viral Clips
          </button>

          <button
            onClick={onExportStart}
            disabled={project.status !== 'ready'}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-md px-3 py-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      ) : (
        <div className="shrink-0 w-32" /> /* Placeholder to balance the layout */
      )}

      {/* Health Indicator */}
      <button
        type="button"
        className="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800"
        title={`Backend Status: ${health.toUpperCase()}`}
        aria-label="Copy backend status"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(formatBackendHealth(health));
          } catch (err) {
            reportError('copy-backend-health', err);
          }
        }}
      >
        <span className={`w-2 h-2 rounded-full ${
          health === 'live' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
          health === 'degraded' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
          'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.5)]'
        }`} />
        <span className="text-[10px] font-medium text-zinc-400 capitalize">{health}</span>
      </button>

      {showAnalyzeModal && (
        <AnalyzeModal
          onClose={() => setShowAnalyzeModal(false)}
          onStart={(settings) => {
            setShowAnalyzeModal(false);
            onAnalyzeStart(settings);
          }}
        />
      )}

      {showChaptersModal && (
        <ChaptersModal onClose={() => setShowChaptersModal(false)} />
      )}
    </div>
  );
};
