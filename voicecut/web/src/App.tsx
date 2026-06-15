import { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { VideoPlayer } from './components/VideoPlayer';
import { WaveformTimeline } from './components/WaveformTimeline';
import { TranscriptPanel } from './components/TranscriptPanel';
import { ExportModal } from './components/ExportModal';
import { useProjectStore } from './store/useProjectStore';
import { apiClient } from './api/client';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

function App() {
  const { project, setProject, isUploading } = useProjectStore();
  const [progressMsg, setProgressMsg] = useState('');
  const [showExport, setShowExport] = useState(false);
  
  // Track the active pipeline step for the stepper
  const [analysisStep, setAnalysisStep] = useState<'upload' | 'create' | 'processing' | 'transcribe' | 'complete' | 'idle'>('idle');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let projectId = params.get('project');
    if (!projectId && window.location.hash) {
      projectId = window.location.hash.replace('#', '');
    }
    if (projectId) {
      apiClient.getProject(projectId)
        .then(setProject)
        .catch(err => console.error("Failed to load project:", err));
    }
  }, [setProject]);

  const handleAnalyzeStart = () => {
    if (!project) return;
    
    setProject({ ...project, status: 'analyzing' });
    setProgressMsg('Starting analysis...');
    setAnalysisStep('processing');
    
    apiClient.analyzeProjectStream(project.id, (ev) => {
      if (ev.message) setProgressMsg(ev.message);
      
      if (ev.step === 'extracting_audio' || ev.step === 'running_vad' || ev.step === 'detecting_cuts') {
        setAnalysisStep('processing');
      }
      if (ev.step === 'transcribing') {
        setAnalysisStep('transcribe');
      }
      
      if (ev.step === 'complete' && ev.project_id) {
        apiClient.getProject(ev.project_id).then(setProject);
        setProgressMsg('');
        setAnalysisStep('complete');
      }
      if (ev.step === 'error') {
        alert('Analysis error: ' + ev.message);
        setProject({ ...project, status: 'error' });
        setProgressMsg('');
        setAnalysisStep('idle');
      }
    });
  };

  const handleExportStart = async () => {
    if (!project) return;
    // Sync decisions to backend first, then open modal
    const decisions = (project.user_decisions || []).map(d => ({
      cut_id: d.cut_id,
      status: d.action
    }));
    await fetch(`/api/projects/${project.id}/decisions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decisions)
    });
    setShowExport(true);
  };

  const isTranscodingState = isUploading || project?.status === 'analyzing';

  // Stepper helper
  const getStepStatus = (stepName: 'upload' | 'create' | 'processing' | 'transcribe') => {
    if (isUploading) {
      if (stepName === 'upload') return 'loading';
      return 'pending';
    }
    
    // If we have a project loaded, upload and create project are done
    if (project) {
      if (stepName === 'upload' || stepName === 'create') return 'done';
    }

    if (project?.status === 'analyzing') {
      if (stepName === 'processing') {
        return analysisStep === 'processing' ? 'loading' : 'done';
      }
      if (stepName === 'transcribe') {
        return analysisStep === 'transcribe' ? 'loading' : analysisStep === 'complete' ? 'done' : 'pending';
      }
    }

    return 'pending';
  };

  const renderStepIcon = (status: 'done' | 'loading' | 'pending') => {
    if (status === 'done') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === 'loading') return <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />;
    return <Circle className="w-5 h-5 text-zinc-600" />;
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col text-foreground overflow-hidden">
      <TopBar onAnalyzeStart={handleAnalyzeStart} onExportStart={handleExportStart} />

      <div className="flex-1 flex overflow-hidden">
        {isTranscodingState ? (
          <div className="flex-1 flex bg-zinc-950 overflow-hidden">

            {/* ── LEFT: progress panel ─────────────────────────────── */}
            <div className="w-80 shrink-0 flex flex-col justify-center px-10 py-12 border-r border-zinc-800 space-y-8">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Processing</p>
                <h1 className="text-2xl font-bold text-white leading-snug">Preparing your video for editing</h1>
                <p className="text-xs text-zinc-500 pt-1">Stay on this page — we're doing the heavy lifting.</p>
              </div>

              {/* Stepper */}
              <div className="space-y-5">
                {[
                  { key: 'upload' as const,     label: 'Upload',          sub: 'Receiving file' },
                  { key: 'create' as const,     label: 'Create project',  sub: 'Initialising workspace' },
                  { key: 'processing' as const, label: 'Detect speech',   sub: 'Running VAD & audio analysis' },
                  { key: 'transcribe' as const, label: 'Transcribe',      sub: 'WhisperX word-level timestamps' },
                ].map(({ key, label, sub }) => {
                  const status = getStepStatus(key);
                  return (
                    <div key={key} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {renderStepIcon(status)}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${status === 'pending' ? 'text-zinc-500' : 'text-zinc-100'}`}>{label}</p>
                        <p className={`text-xs ${status === 'pending' ? 'text-zinc-700' : 'text-zinc-500'}`}>{sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {progressMsg && (
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] font-mono text-zinc-400 leading-relaxed">
                  {progressMsg}
                </div>
              )}
            </div>

            {/* ── RIGHT: editor skeleton preview ───────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden opacity-40 pointer-events-none select-none">

              {/* Skeleton transcript + video layout */}
              <div className="flex flex-1 overflow-hidden">

                {/* Fake transcript rail */}
                <div className="w-72 shrink-0 border-r border-zinc-800 p-5 space-y-3 overflow-hidden">
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 h-7 bg-zinc-800 rounded-md animate-pulse" />
                    <div className="w-7 h-7 bg-zinc-800 rounded-md animate-pulse" />
                    <div className="w-7 h-7 bg-zinc-800 rounded-md animate-pulse" />
                  </div>
                  {/* Fake transcript words */}
                  {[
                    ['दोस्तों वापस सेफ्टर में', '[1.9s]', 'का टाइम स्टार्ट'],
                    ['हो चुका है', '[3.6s]', 'पता नहीं कैसा'],
                    ['ब. बना ब्लॉग इस बार', '[3.3s]', 'छोटी-छोटी चीज़'],
                    ['दिखाई मैंने', '[1.2s]', 'कितना नंबक छोटा'],
                  ].map((row, i) => (
                    <div key={i} className="flex flex-wrap gap-1 text-[11px] leading-relaxed">
                      <span className="text-zinc-400">{row[0]}</span>
                      <span className="bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-mono text-[10px]">{row[1]}</span>
                      <span className="text-zinc-400">{row[2]}</span>
                    </div>
                  ))}
                  <div className="h-3 bg-zinc-800/60 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-zinc-800/60 rounded animate-pulse w-1/2" />
                </div>

                {/* Fake video + right sidebar */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Fake video frame */}
                  <div className="flex-1 bg-black flex items-center justify-center m-4 rounded-xl border border-zinc-800">
                    <div className="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[20px] border-l-zinc-600 ml-1" />
                      </div>
                    </div>
                  </div>
                  {/* Fake ratio/controls bar */}
                  <div className="h-8 mx-4 mb-2 flex items-center gap-4 text-[10px] text-zinc-600">
                    <span>□ Ratio (16:9)</span>
                    <span>● Background</span>
                    <span>⊞ Layouts</span>
                  </div>
                </div>

                {/* Fake right tool sidebar */}
                <div className="w-16 shrink-0 border-l border-zinc-800 flex flex-col items-center py-4 gap-5">
                  {['AI', 'Gen', 'Kit', 'Sub', 'Up', 'Aud', 'B-r', 'Tr', 'Txt'].map((t, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                      <span className="text-[8px] text-zinc-700">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fake timeline / waveform at bottom */}
              <div className="h-28 border-t border-zinc-800 px-4 pt-3 pb-2 space-y-2">
                {/* Fake timecode bar */}
                <div className="flex items-center gap-3 text-[9px] text-zinc-700 font-mono">
                  <span>00:00.0</span>
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span>▶</span>
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span>00:29.6</span>
                  <span className="ml-2">1x</span>
                </div>
                {/* Subtitle track label */}
                <div className="text-[9px] text-indigo-400 font-medium pl-1">Subtitle</div>
                {/* Fake waveform bars */}
                <div className="h-10 flex items-center gap-px overflow-hidden">
                  {Array.from({ length: 120 }).map((_, i) => {
                    const h = Math.sin(i * 0.35) * 40 + Math.sin(i * 0.13) * 25 + 20;
                    return (
                      <div
                        key={i}
                        className="w-1 shrink-0 bg-indigo-500/40 rounded-sm"
                        style={{ height: `${Math.max(6, Math.min(100, h))}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <>
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col p-4 space-y-4">
              <VideoPlayer />
              {project?.status === 'ready' && <WaveformTimeline />}
            </div>

            {/* Right Sidebar */}
            <TranscriptPanel />
          </>
        )}
      </div>

      {showExport && (
        <ExportModal onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}

export default App;

