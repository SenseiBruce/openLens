import React, { useEffect, useState } from 'react';
import { Settings, X, Info, Copy } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { loadAnalyzeSettings, saveAnalyzeSettings } from '../lib/analyzeSettingsStorage';
import { formatAnalyzeLanguage } from '../lib/analyzeLanguage';
import { loadAnalyzeLanguage, saveAnalyzeLanguage } from '../lib/analyzeLanguageStorage';
import { loadWhisperModel, saveWhisperModel } from '../lib/whisperModelStorage';
import { loadMinGap, saveMinGap } from '../lib/minGapStorage';
import { loadInitialPrompt, saveInitialPrompt } from '../lib/initialPromptStorage';
import { formatInitialPrompt } from '../lib/initialPrompt';
import { formatMinGap } from '../lib/minGap';
import { formatWhisperModel } from '../lib/whisperModel';

export const AnalyzeModal: React.FC<{
  onClose: () => void;
  onStart: (settings: { whisper_model: string; min_gap_duration: number; language?: string; initial_prompt?: string }) => void;
}> = ({ onClose, onStart }) => {
  const { project } = useProjectStore();
  const stored = loadAnalyzeSettings();
  const storedLanguage = loadAnalyzeLanguage();
  const storedModel = loadWhisperModel();
  const storedMinGap = loadMinGap();
  const storedPrompt = loadInitialPrompt();
  const [model, setModel] = useState<string>(
    storedModel || project?.settings?.whisper_model || stored?.whisper_model || 'small',
  );
  const [minGap, setMinGap] = useState<number>(
    storedMinGap ?? project?.settings?.min_gap_duration ?? stored?.min_gap_duration ?? 1.0,
  );
  const [language, setLanguage] = useState<string>(
    storedLanguage ?? project?.settings?.language ?? stored?.language ?? 'hinglish',
  );
  const [initialPrompt, setInitialPrompt] = useState<string>(
    storedPrompt ?? (project?.settings?.initial_prompt || stored?.initial_prompt || ''),
  );

  useEffect(() => {
    saveAnalyzeLanguage(language);
  }, [language]);

  useEffect(() => {
    saveWhisperModel(model);
  }, [model]);

  useEffect(() => {
    saveMinGap(minGap);
  }, [minGap]);

  useEffect(() => {
    saveInitialPrompt(initialPrompt);
  }, [initialPrompt]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="h-14 border-b border-zinc-800 px-5 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-2 text-zinc-100 font-semibold">
            <Settings className="w-4 h-4 text-indigo-400" />
            Analysis Settings
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none p-1 rounded-md hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
          {/* Whisper Model */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="analyze-whisper-model" className="text-sm font-medium text-zinc-300">Transcription Accuracy (Whisper Model)</label>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(formatWhisperModel(model));
                  } catch {
                    /* clipboard may be unavailable in tests */
                  }
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300"
                title="Copy Whisper model"
                aria-label="Copy Whisper model"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <select
              id="analyze-whisper-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="tiny">Tiny (Fastest, High Error Rate)</option>
              <option value="base">Base (Fast, Moderate Errors)</option>
              <option value="small">Small (Balanced, Default)</option>
              <option value="medium">Medium (Slow, Accurate)</option>
              <option value="large-v2">Large-v2 (Slowest, Highly Accurate)</option>
              <option value="large-v3">Large-v3 (Slowest, State of the Art)</option>
            </select>
            <div className="flex items-start gap-1.5 mt-1 text-zinc-500">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                Larger models produce fewer lyrical mistakes but require significantly more processing time and memory, especially inside CPU Docker environments.
              </p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="analyze-language" className="text-sm font-medium text-zinc-300">Spoken Language</label>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(formatAnalyzeLanguage(language));
                  } catch {
                    /* clipboard may be unavailable in tests */
                  }
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300"
                title="Copy spoken language"
                aria-label="Copy spoken language"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <select
              id="analyze-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Auto-Detect (Default)</option>
              <option value="en">English</option>
              <option value="hi">Hindi (Devanagari script)</option>
              <option value="hinglish">Hinglish (Mixed English & Hindi)</option>
            </select>
            <div className="flex items-start gap-1.5 mt-1 text-zinc-500">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                If mixing English and Hindi, selecting "Hinglish" is highly recommended.
              </p>
            </div>
          </div>

          {/* Custom Prompt */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Custom Prompt (Optional)</label>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(formatInitialPrompt(initialPrompt));
                  } catch {
                    /* clipboard may be unavailable in tests */
                  }
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300"
                title="Copy custom prompt"
                aria-label="Copy custom prompt"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <textarea
              value={initialPrompt}
              onChange={(e) => setInitialPrompt(e.target.value)}
              placeholder="e.g. This is a vlog about React. My name is Kinshuk..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none h-20"
            />
            <div className="flex items-start gap-1.5 mt-1 text-zinc-500">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                Give the AI context on names, acronyms, or the mix of languages to improve spelling.
              </p>
            </div>
          </div>

          {/* Min Gap Duration */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300 flex justify-between items-center">
              Minimum Silence Gap
              <span className="flex items-center gap-2">
                <span className="text-indigo-400 tabular-nums">{minGap.toFixed(1)}s</span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(formatMinGap(minGap));
                    } catch {
                      /* clipboard may be unavailable in tests */
                    }
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                  title="Copy minimum silence gap"
                  aria-label="Copy minimum silence gap"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </span>
            </label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={minGap}
              onChange={(e) => setMinGap(parseFloat(e.target.value))}
              aria-label="Minimum silence gap"
              className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>0.1s (Aggressive)</span>
              <span>3.0s (Relaxed)</span>
            </div>
            <div className="flex items-start gap-1.5 mt-1 text-zinc-500">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                Silences shorter than this duration will be ignored and not marked as candidate cuts.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-16 border-t border-zinc-800 px-5 flex items-center justify-end gap-3 bg-zinc-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const settings = {
                whisper_model: model,
                min_gap_duration: minGap,
                ...(language ? { language } : {}),
                ...(initialPrompt ? { initial_prompt: initialPrompt } : {}),
              };
              saveAnalyzeSettings(settings);
              saveAnalyzeLanguage(language);
              saveWhisperModel(model);
              saveMinGap(minGap);
              saveInitialPrompt(initialPrompt);
              onStart(settings);
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
          >
            Start Analysis
          </button>
        </div>

      </div>
    </div>
  );
};
