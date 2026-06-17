import type { Project, PipelineEvent, ProjectSummary } from '../types';

const API_BASE = '/api';

export const apiClient = {
  async uploadVideo(file: File): Promise<{ project_id: string; video_path: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  async getProjects(): Promise<ProjectSummary[]> {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(projectId: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  },

  async deleteProject(projectId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete project');
  },

  async updateCutDecision(projectId: string, cutId: string, status: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/cuts/${cutId}?status=${status}`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to update cut decision');
  },

  analyzeProjectStream(
    projectId: string,
    settings: { whisper_model?: string; min_gap_duration?: number; language?: string; initial_prompt?: string } | null,
    onEvent: (ev: PipelineEvent) => void
  ): EventSource {
    let url = `${API_BASE}/analyze/${projectId}`;
    if (settings) {
      const params = new URLSearchParams();
      if (settings.whisper_model) params.append('whisper_model', settings.whisper_model);
      if (settings.min_gap_duration) params.append('min_gap_duration', settings.min_gap_duration.toString());
      if (settings.language) params.append('language', settings.language);
      if (settings.initial_prompt) params.append('initial_prompt', settings.initial_prompt);
      url += `?${params.toString()}`;
    }
    
    const sse = new EventSource(url);
    
    sse.addEventListener('step', (e) => onEvent(JSON.parse((e as MessageEvent).data)));
    sse.addEventListener('progress', (e) => onEvent(JSON.parse((e as MessageEvent).data)));
    sse.addEventListener('complete', (e) => {
      onEvent({ step: 'complete', ...JSON.parse((e as MessageEvent).data) });
      sse.close();
    });
    sse.addEventListener('error', (e) => {
      onEvent({ step: 'error', message: JSON.parse((e as MessageEvent).data).message });
      sse.close();
    });
    
    return sse;
  },

  async getVideoInfo(projectId: string): Promise<{ width: number; height: number }> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/video-info`);
    if (!res.ok) throw new Error('Failed to get video info');
    return res.json();
  },

  exportProjectStream(projectId: string, resolution: string | null, onEvent: (ev: PipelineEvent) => void): EventSource {
    const url = resolution
      ? `${API_BASE}/export/${projectId}?resolution=${resolution}`
      : `${API_BASE}/export/${projectId}`;
    const sse = new EventSource(url);
    
    sse.addEventListener('step', (e) => onEvent(JSON.parse((e as MessageEvent).data)));
    sse.addEventListener('progress', (e) => onEvent(JSON.parse((e as MessageEvent).data)));
    sse.addEventListener('files', (e) => {
      onEvent({ step: 'files', files: JSON.parse((e as MessageEvent).data) });
      sse.close();
    });
    sse.addEventListener('error', (e) => {
      onEvent({ step: 'error', message: JSON.parse((e as MessageEvent).data).message });
      sse.close();
    });
    
    return sse;
  }
};
