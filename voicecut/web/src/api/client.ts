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
  ): () => void {
    // POST body keeps initial_prompt out of URLs, server logs, and browser history
    const body: Record<string, unknown> = {};
    if (settings?.whisper_model)    body.whisper_model    = settings.whisper_model;
    if (settings?.min_gap_duration) body.min_gap_duration = settings.min_gap_duration;
    if (settings?.language != null) body.language         = settings.language;
    if (settings?.initial_prompt)   body.initial_prompt   = settings.initial_prompt;

    let aborted = false;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/analyze/${projectId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          onEvent({ step: 'error', message: `HTTP ${res.status}` });
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done || aborted) break;
          buffer += decoder.decode(value, { stream: true });

          // Parse SSE lines from buffer
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';  // keep incomplete last line

          let eventType = '';
          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventType = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
              const dataStr = line.slice(5).trim();
              if (!dataStr || dataStr === '{}') continue;
              try {
                const data = JSON.parse(dataStr);
                if (eventType === 'complete') {
                  onEvent({ step: 'complete', ...data });
                  return;
                } else if (eventType === 'error') {
                  onEvent({ step: 'error', message: data.message });
                  return;
                } else {
                  onEvent(data);
                }
              } catch { /* malformed data line, skip */ }
            } else if (line === '') {
              eventType = '';  // reset between events
            }
          }
        }
      } catch (err: unknown) {
        if (!aborted) {
          onEvent({ step: 'error', message: String(err) });
        }
      }
    })();

    // Return a cancel function (mirrors EventSource .close())
    return () => {
      aborted = true;
      controller.abort();
    };
  },


  async getVideoInfo(projectId: string): Promise<{ width: number; height: number }> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/video-info`);
    if (!res.ok) throw new Error('Failed to get video info');
    return res.json();
  },

  async generateChapters(projectId: string, modelName: string = "gemini/gemini-2.5-flash", apiKey?: string): Promise<{ chapters: any[] }> {
    const body: Record<string, any> = { model_name: modelName };
    if (apiKey) body.api_key = apiKey;
    
    const res = await fetch(`${API_BASE}/analyze/${projectId}/chapters/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to generate chapters');
    return res.json();
  },

  async generateViralClips(projectId: string, targetLength: number, openRouterKey: string): Promise<{ clips: any[] }> {
    const res = await fetch(`${API_BASE}/viral-clips/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        project_id: projectId,
        target_length_seconds: targetLength,
        openrouter_key: openRouterKey 
      }),
    });
    if (!res.ok) {
      let errorMsg: string
      try {
        const errJson = await res.json();
        errorMsg = errJson.detail || JSON.stringify(errJson);
      } catch {
        errorMsg = await res.text();
      }
      throw new Error(errorMsg);
    }
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
