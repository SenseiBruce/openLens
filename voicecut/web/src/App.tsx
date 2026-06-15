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
          <div className="flex-1 flex bg-zinc-950 items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Stepper details */}
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-white">Transcoding your video for editing</h1>
                  <p className="text-sm text-zinc-400">Please stay on the page. We are processing your media files.</p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-3">
                    {renderStepIcon(getStepStatus('upload'))}
                    <span className={`text-sm ${getStepStatus('upload') === 'pending' ? 'text-zinc-500' : 'text-zinc-200'}`}>Upload</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {renderStepIcon(getStepStatus('create'))}
                    <span className={`text-sm ${getStepStatus('create') === 'pending' ? 'text-zinc-500' : 'text-zinc-200'}`}>Create project</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {renderStepIcon(getStepStatus('processing'))}
                    <span className={`text-sm ${getStepStatus('processing') === 'pending' ? 'text-zinc-500' : 'text-zinc-200'}`}>Processing video</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {renderStepIcon(getStepStatus('transcribe'))}
                    <span className={`text-sm ${getStepStatus('transcribe') === 'pending' ? 'text-zinc-500' : 'text-zinc-200'}`}>Transcribe</span>
                  </div>
                </div>

                {progressMsg && (
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400 max-w-md">
                    {progressMsg}
                  </div>
                )}
              </div>

              {/* Tutorial panel */}
              <div className="md:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Tutorial</span>
                  <span className="text-xs text-zinc-500">2/6</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-white">Clip with your own prompt</h2>
                  <p className="text-xs text-zinc-400">
                    Our VAD and transcription model lets you clip any moment from ANY video using audio boundaries and text highlights. Just highlight the text or toggle silence clips to edit the video.
                  </p>
                </div>

                {/* Mockup card */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-3 relative overflow-hidden aspect-video flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[10px] text-zinc-500">
                    <span>Project-Preview.mp4</span>
                    <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">1080p</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-xs text-zinc-600 italic">
                    [Video Preview Mockup]
                  </div>
                  <div className="h-6 bg-indigo-500/20 border-t border-indigo-500/30 rounded flex items-center px-2 text-[8px] text-indigo-300">
                    [3.8s] Speech text starts here... [1.6s]
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button className="text-xs text-zinc-500 hover:text-zinc-300 font-medium">Previous</button>
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                  </div>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Next</button>
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

