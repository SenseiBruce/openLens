import React from 'react';
import { Upload, Play, Scissors, Download, Loader2 } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { apiClient } from '../api/client';

export const TopBar: React.FC<{
  onAnalyzeStart: () => void;
  onExportStart: () => void;
}> = ({ onAnalyzeStart, onExportStart }) => {
  const { project, setProject, setIsUploading } = useProjectStore();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { project_id } = await apiClient.uploadVideo(file);
      const newProject = await apiClient.getProject(project_id);
      setProject(newProject);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };


  const handleAnalyze = () => {
    if (!project) return;
    onAnalyzeStart();
  };

  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center space-x-2">
        <Scissors className="w-6 h-6 text-indigo-500" />
        <span className="font-bold text-xl tracking-tight text-white">VoiceCut</span>
      </div>

      <div className="flex items-center space-x-4">
        <label className="cursor-pointer bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded-md flex items-center space-x-2 text-sm font-medium transition-colors">
          <Upload className="w-4 h-4" />
          <span>Import Video</span>
          <input type="file" className="hidden" accept="video/*" onChange={handleUpload} />
        </label>

        <button
          onClick={handleAnalyze}
          disabled={!project || project.status !== 'idle'}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center space-x-2 text-sm font-medium transition-colors"
        >
          {project?.status === 'analyzing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>Remove Silences</span>
        </button>

        <button
          onClick={onExportStart}
          disabled={!project || project.status !== 'ready'}
          className="bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-md flex items-center space-x-2 text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};
