import React from 'react';
import { Upload, Play, Scissors, Download, Loader2 } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { apiClient } from '../api/client';

export const TopBar: React.FC<{
  onAnalyzeStart: () => void;
  onExportStart: () => void;
}> = ({ onAnalyzeStart, onExportStart }) => {
  const { project, setProject, setIsUploading } = useProjectStore();

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

  return (
    <div className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-5 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <Scissors className="w-4 h-4 text-indigo-400" />
        <span className="font-bold text-sm tracking-tight text-white">VoiceCut</span>
      </div>

      {/* Project name pill */}
      {project?.name && (
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="max-w-48 truncate">{project.name}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <label className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md px-3 py-1.5 transition-colors">
          <Upload className="w-3.5 h-3.5" />
          Import Video
          <input type="file" className="hidden" accept="video/*" onChange={handleUpload} />
        </label>

        <button
          onClick={onAnalyzeStart}
          disabled={!project || project.status !== 'idle'}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-md px-3 py-1.5 transition-colors"
        >
          {project?.status === 'analyzing'
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Play className="w-3.5 h-3.5" />}
          Remove Silences
        </button>

        <button
          onClick={onExportStart}
          disabled={!project || project.status !== 'ready'}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-md px-3 py-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
    </div>
  );
};
