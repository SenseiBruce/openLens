import React, { useMemo } from 'react';
import { Upload, Play, Scissors, Download, Loader2, Clock } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { apiClient } from '../api/client';

/** Format seconds as m:ss */
function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export const TopBar: React.FC<{
  onAnalyzeStart: () => void;
  onExportStart: () => void;
}> = ({ onAnalyzeStart, onExportStart }) => {
  const { project, setProject, setIsUploading, skipCuts, setSkipCuts } = useProjectStore();

  // Live kept-duration: total minus all effectively-cut segments
  const { totalDur, keptDur, removedDur } = useMemo(() => {
    const total = project?.video_duration ?? 0;
    if (!project || !total) return { totalDur: 0, keptDur: 0, removedDur: 0 };

    const decisionsMap = new Map(
      (project.user_decisions || []).map(d => [d.cut_id, d.action])
    );
    const cutDur = project.candidate_cuts.reduce((acc, cut) => {
      const status = decisionsMap.get(cut.id) ?? cut.status;
      return status === 'cut' ? acc + (cut.end - cut.start) : acc;
    }, 0);

    return {
      totalDur: total,
      keptDur: Math.max(0, total - cutDur),
      removedDur: cutDur,
    };
  }, [project?.user_decisions, project?.candidate_cuts, project?.video_duration]);

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
      console.error(err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
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
              {fmt(keptDur)}
            </span>
            <span className="text-[10px] text-zinc-500 tabular-nums">
              / {fmt(totalDur)}
            </span>
            {removedDur > 0.5 && (
              <span className="text-[10px] font-medium text-red-400 tabular-nums">
                -{fmt(removedDur)}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Project name pill when no duration yet */
        project?.name ? (
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="max-w-48 truncate">{project.name}</span>
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
          </label>

          <label className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md px-3 py-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Import Video
            <input type="file" className="hidden" accept="video/*" onChange={handleUpload} />
          </label>

          <button
            onClick={onAnalyzeStart}
            disabled={project.status !== 'idle'}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-md px-3 py-1.5 transition-colors"
          >
            {project.status === 'analyzing'
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Play className="w-3.5 h-3.5" />}
            Remove Silences
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
    </div>
  );
};
