import React, { useEffect, useState } from 'react';
import { Scissors, Upload, Clock, Loader2, Trash2, Video } from 'lucide-react';
import { apiClient } from '../api/client';
import type { ProjectSummary } from '../types';

interface ProjectListProps {
  onSelect: (projectId: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onSelect, onUpload, isUploading }) => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const data = await apiClient.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project?')) return;
    try {
      await apiClient.deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  return (
    <div className="flex-1 bg-zinc-950 flex flex-col overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto px-8 py-12 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Your Projects</h1>
            <p className="text-sm text-zinc-400 mt-1">Manage and resume your video edits.</p>
          </div>
          <label className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg px-5 py-2.5 transition-colors">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Import New Video
            <input type="file" className="hidden" accept="video/*" onChange={onUpload} disabled={isUploading} />
          </label>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/50">
            <Video className="w-12 h-12 text-zinc-700 mb-4" />
            <h3 className="text-lg font-medium text-white">No projects yet</h3>
            <p className="text-sm text-zinc-500 mt-1 mb-6">Upload a video to get started.</p>
            <label className="cursor-pointer text-sm font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-md transition-colors">
              Browse files
              <input type="file" className="hidden" accept="video/*" onChange={onUpload} />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelect(p.id)}
                className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <Scissors className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white truncate w-40" title={p.name}>
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                        <span className={
                          p.status === 'ready' ? 'text-green-400' :
                          p.status === 'error' ? 'text-red-400' :
                          p.status === 'idle' ? 'text-zinc-400' :
                          'text-indigo-400'
                        }>
                          • {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800 pt-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {p.video_duration ? fmt(p.video_duration) : '--:--'}
                  </div>
                  <span>
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>

                {/* Delete button (shows on hover) */}
                <button
                  onClick={(e) => handleDelete(e, p.id)}
                  className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-400 bg-zinc-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
