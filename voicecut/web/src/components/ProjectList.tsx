import React, { useEffect, useMemo, useState } from 'react';
import { Scissors, Upload, Clock, Loader2, Trash2, Video } from 'lucide-react';
import { apiClient } from '../api/client';
import { reportError } from '../lib/errorReporter';
import { filterProjects } from '../lib/projectListFilters';
import type { ProjectStatus, ProjectSummary } from '../types';
import React, { useEffect, useState } from 'react';
import { Scissors, Upload, Clock, Loader2, Trash2, Video, Copy, Check } from 'lucide-react';
import { apiClient } from '../api/client';
import { reportError } from '../lib/errorReporter';
import { formatSourceDuration } from '../lib/sourceDuration';
import React, { useEffect, useState } from 'react';
import { Scissors, Upload, Clock, Loader2, Trash2, Video, Copy, Check } from 'lucide-react';
import { apiClient } from '../api/client';
import { reportError } from '../lib/errorReporter';
import { formatProjectName } from '../lib/projectName';
import React, { useEffect, useState } from 'react';
import { Scissors, Upload, Clock, Loader2, Trash2, Video, Copy, Check } from 'lucide-react';
import { apiClient } from '../api/client';
import { reportError } from '../lib/errorReporter';
import { formatProjectDate } from '../lib/projectDate';
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  const filteredProjects = useMemo(
    () => filterProjects(projects, { query: searchQuery, status: statusFilter }),
    [projects, searchQuery, statusFilter],
  );

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };
  const [copiedDurationId, setCopiedDurationId] = useState<string | null>(null);
  const [copiedNameId, setCopiedNameId] = useState<string | null>(null);
  const [copiedDateId, setCopiedDateId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const data = await apiClient.getProjects();
      setProjects(data);
    } catch (err) {
      reportError('load_projects', err);
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
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      reportError('project_delete', err);
    }
  };

  const handleMassDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} projects?`)) return;
    try {
      for (const id of Array.from(selectedIds)) {
        await apiClient.deleteProject(id);
      }
      setSelectedIds(new Set());
      setIsSelectMode(false);
      fetchProjects();
    } catch (err) {
      reportError('project_mass_delete', err);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copySourceDuration = async (e: React.MouseEvent, project: ProjectSummary) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(formatSourceDuration(project.video_duration));
      setCopiedDurationId(project.id);
      window.setTimeout(() => setCopiedDurationId(null), 2000);
    } catch (err) {
      reportError('copy-source-duration', err);
  const copyProjectName = async (e: React.MouseEvent, project: ProjectSummary) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(formatProjectName(project.name));
      setCopiedNameId(project.id);
      window.setTimeout(() => setCopiedNameId(null), 2000);
    } catch (err) {
      reportError('copy-project-name', err);
  const copyProjectDate = async (e: React.MouseEvent, project: ProjectSummary) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(formatProjectDate(project.created_at));
      setCopiedDateId(project.id);
      window.setTimeout(() => setCopiedDateId(null), 2000);
    } catch (err) {
      reportError('copy-project-date', err);
    }
  };

  const handleCardClick = (id: string) => {
    if (isSelectMode) {
      toggleSelect(id);
    } else {
      onSelect(id);
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
          <div className="flex items-center gap-3">
            {projects.length > 0 && (
              <button
                onClick={() => {
                  setIsSelectMode(!isSelectMode);
                  if (isSelectMode) setSelectedIds(new Set());
                }}
                className={`text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${
                  isSelectMode ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {isSelectMode ? 'Cancel Selection' : 'Select'}
              </button>
            )}

            {isSelectMode && (
              <button
                onClick={() => {
                  if (selectedIds.size === filteredProjects.length && filteredProjects.length > 0) {
                    setSelectedIds(new Set());
                  } else {
                    setSelectedIds(new Set(filteredProjects.map(p => p.id)));
                  }
                }}
                className="text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 px-4 py-2.5 rounded-lg transition-colors"
              >
                {selectedIds.size === filteredProjects.length && filteredProjects.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
            )}

            {isSelectMode && selectedIds.size > 0 && (
              <button
                onClick={handleMassDelete}
                className="flex items-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg px-4 py-2.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedIds.size})
              </button>
            )}

            <label className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg px-5 py-2.5 transition-colors">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Import New Video
              <input type="file" className="hidden" accept="video/*" onChange={onUpload} disabled={isUploading} />
            </label>
          </div>
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
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects…"
                aria-label="Search projects"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
                aria-label="Filter by status"
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All statuses</option>
                <option value="idle">Idle</option>
                <option value="analyzing">Analyzing</option>
                <option value="ready">Ready</option>
                <option value="exporting">Exporting</option>
                <option value="error">Error</option>
              </select>
            </div>
            {filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-zinc-800 rounded-2xl bg-zinc-900/40">
                <h3 className="text-lg font-medium text-white">No projects match your filters</h3>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Clear filters
                </button>
              </div>
            ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((p) => {
              const isSelected = selectedIds.has(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleCardClick(p.id)}
                  className={`group relative bg-zinc-900 border hover:border-zinc-600 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-zinc-800'
                  }`}
                >
                  {isSelectMode && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600 bg-zinc-950 group-hover:border-indigo-400'
                      }`}>
                        {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </div>
                  )}

                  <div className={`flex justify-between items-start mb-4 ${isSelectMode ? 'ml-8' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                        <Scissors className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate" title={p.name}>
                          {p.name}
                        </h3>
                        <button
                          type="button"
                          onClick={(e) => copyProjectName(e, p)}
                          className="mt-1 p-0.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-800"
                          title="Copy project name"
                          aria-label={`Copy project name for ${p.name}`}
                        >
                          {copiedNameId === p.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
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
                      <button
                        type="button"
                        onClick={(e) => copySourceDuration(e, p)}
                        className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800"
                        title="Copy source duration"
                        aria-label={`Copy source duration for ${p.name}`}
                      >
                        {copiedDurationId === p.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <span className="flex items-center gap-1">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Unknown date'}
                      <button
                        type="button"
                        onClick={(e) => copyProjectDate(e, p)}
                        className="p-0.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-800"
                        title="Copy project date"
                        aria-label={`Copy project date for ${p.name}`}
                      >
                        {copiedDateId === p.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </span>
                  </div>

                  {/* Delete button (shows on hover, disabled in select mode) */}
                  {!isSelectMode && (
                    <button
                      onClick={(e) => handleDelete(e, p.id)}
                      className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-400 bg-zinc-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

