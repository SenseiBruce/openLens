import { useState } from 'react';
import { X, Loader2, Download, Sparkles } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { apiClient } from '../api/client';
import { reportError } from '../lib/errorReporter';
import { loadViralClipLength, saveViralClipLength, type ViralClipLength } from '../lib/viralClipLengthStorage';

export function ViralClipsModal({ onClose }: { onClose: () => void }) {
  const { project } = useProjectStore();
  const [apiKey, setApiKey] = useState('');
  const [targetLength, setTargetLength] = useState<ViralClipLength>(() => loadViralClipLength());
  const [targetLength, setTargetLength] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [clips, setClips] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!project) return;
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await apiClient.generateViralClips(project.id, targetLength, apiKey.trim());
      setClips(response.clips || []);
    } catch (err: unknown) {
      reportError('viral_clips', err);
      setError(err instanceof Error ? err.message : 'Failed to generate viral clips');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-[500px] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2 text-zinc-100 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Generate Viral Clips
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {clips.length === 0 ? (
            <>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Target Length</label>
                  <select 
                    value={targetLength}
                    onChange={(e) => {
                      const next = Number(e.target.value) as ViralClipLength
                      setTargetLength(next)
                      saveViralClipLength(next)
                    }}
                    onChange={(e) => setTargetLength(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  >
                    <option value={15}>15 seconds (Short/Punchy)</option>
                    <option value={30}>30 seconds (Standard Hook)</option>
                    <option value={60}>60 seconds (Deep Dive)</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">OpenRouter API Key</label>
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Your key is only sent securely to our backend and is never stored.</p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
                  {error}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-zinc-300 mb-2">Generated {clips.length} viral clips based on the transcript.</p>
              {clips.map((clip, idx) => (
                <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="text-sm font-medium text-zinc-100">{clip.title}</h4>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {clip.duration.toFixed(1)}s
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{clip.explanation}</p>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-800/50">
                    <div className="text-xs text-zinc-500 font-mono">
                      {clip.start.toFixed(1)}s - {clip.end.toFixed(1)}s
                    </div>
                    {clip.rendered_path && (
                      <a 
                        href={`http://localhost:8000${clip.rendered_path}`}
                        download
                        className="flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download MP4
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-3">
          {clips.length === 0 ? (
            <>
              <button
                onClick={onClose}
                disabled={isGenerating}
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !apiKey.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing & Rendering...
                  </>
                ) : (
                  'Generate Clips'
                )}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
