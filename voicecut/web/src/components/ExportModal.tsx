import React, { useEffect, useState } from 'react';
import { Loader2, Download, X } from 'lucide-react';
import { apiClient } from '../api/client';
import { useProjectStore } from '../store/useProjectStore';
import type { PipelineEvent } from '../types';
import { resolutionsAtOrBelow } from '../lib/exportResolutions';
import {
  loadExportResolution,
  saveExportResolution,
  type StoredExportResolution,
} from '../lib/exportResolutionStorage';
import { formatExportFiles } from '../lib/exportFilesClipboard';

interface ExportModalProps {
  onClose: () => void;
}

type Phase = 'picking' | 'exporting' | 'done' | 'error';

export const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const { project } = useProjectStore();
  const [phase, setPhase] = useState<Phase>('picking');
  const [originalHeight, setOriginalHeight] = useState<number>(2160);
  const [selectedRes, setSelectedRes] = useState<string | null>(() => loadExportResolution());
  const [progressMsg, setProgressMsg] = useState('');
  const [exportFiles, setExportFiles] = useState<Record<string, string> | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedFiles, setCopiedFiles] = useState(false);

  // Fetch original resolution on mount
  useEffect(() => {
    if (!project?.id) return;
    apiClient.getVideoInfo(project.id).then(({ height }) => {
      setOriginalHeight(height);
    }).catch(() => {
      setOriginalHeight(2160); // fallback: allow all
    });
  }, [project?.id]);

  const validOptions = resolutionsAtOrBelow(originalHeight);

  useEffect(() => {
    const options = resolutionsAtOrBelow(originalHeight);
    if (selectedRes && !options.some(option => option.value === selectedRes)) {
      setSelectedRes(null);
    }
  }, [originalHeight, selectedRes]);

  const chooseResolution = (value: StoredExportResolution) => {
    setSelectedRes(value);
    saveExportResolution(value);
  };

  const handleExport = () => {
    if (!project?.id) return;
    setPhase('exporting');
    setProgressMsg('Starting export...');

    apiClient.exportProjectStream(project.id, selectedRes, (ev: PipelineEvent) => {
      if (ev.step === 'progress' || ev.step === 'step') {
        setProgressMsg((ev as any).message || progressMsg);
      } else if (ev.step === 'files') {
        setExportFiles((ev as any).files);
        setPhase('done');
      } else if (ev.step === 'error') {
        setErrorMsg((ev as any).message || 'Export failed');
        setPhase('error');
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Picking phase */}
        {phase === 'picking' && (
          <>
            <h2 className="text-xl font-bold mb-1">Export Video</h2>
            <p className="text-sm text-zinc-400 mb-6">
              Original resolution: <span className="text-white font-medium">{originalHeight}p</span>
            </p>

            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Output Resolution
            </label>

            {/* Lossless original option */}
            <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 hover:border-indigo-500 cursor-pointer mb-2 transition-colors"
              style={{ backgroundColor: selectedRes === null ? 'rgba(99,102,241,0.1)' : undefined, borderColor: selectedRes === null ? 'rgb(99,102,241)' : undefined }}>
              <input
                type="radio"
                name="resolution"
                className="accent-indigo-500"
                checked={selectedRes === null}
                onChange={() => chooseResolution(null)}
              />
              <span className="flex-1 text-sm">
                Original ({originalHeight}p) — <span className="text-green-400 text-xs font-medium">Lossless copy</span>
              </span>
            </label>

            {/* Downscale options */}
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {validOptions.map(opt => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 hover:border-indigo-500 cursor-pointer transition-colors"
                  style={{ backgroundColor: selectedRes === opt.value ? 'rgba(99,102,241,0.1)' : undefined, borderColor: selectedRes === opt.value ? 'rgb(99,102,241)' : undefined }}>
                  <input
                    type="radio"
                    name="resolution"
                    className="accent-indigo-500"
                    checked={selectedRes === opt.value}
                    onChange={() => chooseResolution(opt.value)}
                  />
                  <span className="text-sm">{opt.label}</span>
                  {opt.height < originalHeight && (
                    <span className="ml-auto text-xs text-zinc-500">Re-encode</span>
                  )}
                </label>
              ))}
            </div>

            <button
              onClick={handleExport}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </>
        )}

        {/* Exporting phase */}
        {phase === 'exporting' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <h2 className="text-xl font-bold">Exporting Video</h2>
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-zinc-400 text-center">{progressMsg}</p>
          </div>
        )}

        {/* Done phase */}
        {phase === 'done' && exportFiles && (
          <>
            <h2 className="text-xl font-bold mb-2">Export Complete</h2>
            <p className="text-sm text-green-400 mb-6">Your video is ready to download.</p>
            <div className="space-y-2">
              {Object.entries(exportFiles).map(([format, path]) => (
                <a
                  key={format}
                  href={`/api/export/${project?.id}/download/${path.split('/').pop()}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 text-sm font-medium transition-colors"
                  download
                >
                  <Download className="w-4 h-4" />
                  Download {format.toUpperCase()}
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(formatExportFiles(exportFiles));
                  setCopiedFiles(true);
                  window.setTimeout(() => setCopiedFiles(false), 2000);
                } catch {
                  setCopiedFiles(false);
                }
              }}
              className="w-full mt-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium transition-colors text-sm"
            >
              {copiedFiles ? 'Copied paths' : 'Copy paths'}
            </button>
            <button
              onClick={onClose}
              className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
            >
              Close
            </button>
          </>
        )}

        {/* Error phase */}
        {phase === 'error' && (
          <>
            <h2 className="text-xl font-bold mb-2 text-red-400">Export Failed</h2>
            <p className="text-sm text-zinc-400 mb-6">{errorMsg}</p>
            <button
              onClick={() => setPhase('picking')}
              className="w-full py-2.5 bg-zinc-700 hover:bg-zinc-600 rounded-xl font-medium transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};
