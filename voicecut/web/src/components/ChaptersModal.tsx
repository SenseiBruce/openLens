import React, { useState } from 'react';
import { X, Loader2, Sparkles, Settings2, Copy, Check } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { apiClient } from '../api/client';
import { formatChapterTimestamps } from '../lib/chapterClipboard';
import { formatChapterModel } from '../lib/chapterModel';
import { reportError } from '../lib/errorReporter';

export const ChaptersModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { project, setProject } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [provider, setProvider] = useState<'google' | 'openrouter' | 'custom'>('google');
  const [modelName, setModelName] = useState('gemini/gemini-2.5-flash');
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);

  // Handle provider preset changes
  const handleProviderChange = (newProvider: 'google' | 'openrouter' | 'custom') => {
    setProvider(newProvider);
    if (newProvider === 'google') setModelName('gemini/gemini-2.5-flash');
    else if (newProvider === 'openrouter') setModelName('openrouter/auto');
  };

  const handleGenerate = async () => {
    if (!project) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.generateChapters(project.id, modelName, apiKey || undefined);
      setProject({ ...project, chapters: res.chapters });
      setShowSettings(false);
    } catch (err: any) {
      setError(err.message || 'Failed to generate chapters');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTimestamps = async () => {
    if (!project?.chapters?.length) return;
    try {
      await navigator.clipboard.writeText(formatChapterTimestamps(project.chapters));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/50 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Auto Chapters</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className={`p-1.5 rounded-md transition-colors ${showSettings ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              title="LLM Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
              {error}
            </div>
          )}

          {showSettings && (
            <div className="mb-6 p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl space-y-4">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">AI Provider Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Provider</label>
                  <select 
                    value={provider}
                    onChange={(e) => handleProviderChange(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="google">Google (Gemini)</option>
                    <option value="openrouter">OpenRouter</option>
                    <option value="custom">Custom (litellm format)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs text-zinc-400">Model Name (litellm format)</label>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(formatChapterModel(modelName));
                        } catch (err) {
                          reportError('copy-chapter-model', err);
                        }
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                      aria-label="Copy chapter model"
                    >
                      Copy
                    </button>
                  </div>
                  <input 
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g. gemini/gemini-2.5-flash"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Provider prefix required (e.g. <code>openrouter/auto</code>, <code>openai/gpt-4o</code>)</p>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">API Key <span className="text-zinc-600">(Optional if set in backend)</span></label>
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Kept in memory for this session only — never written to localStorage.</p>
                </div>
              </div>
            </div>
          )}

          {(!project?.chapters || project.chapters.length === 0) ? (
            <div className="text-center py-8">
              <p className="text-sm text-zinc-400 mb-4">No chapters generated yet.</p>
              <button
                onClick={handleGenerate}
                disabled={loading || !project?.transcript_segments?.length}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Generating...' : 'Generate Chapters with AI'}
              </button>
              {!project?.transcript_segments?.length && (
                <p className="text-xs text-amber-500 mt-2">Transcribe video first (Remove Silences)</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {project.chapters.map((chap, i) => (
                <div key={chap.id || i} className="bg-zinc-800/50 border border-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-white">{chap.title}</h3>
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">
                      {formatTime(chap.start)} - {formatTime(chap.end)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{chap.summary}</p>
                </div>
              ))}
              
              <div className="pt-4 border-t border-zinc-800 text-center flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleCopyTimestamps}
                  className="inline-flex items-center gap-2 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy timestamps'}
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
