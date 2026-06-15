import { create } from 'zustand';
import type { Project, CutStatus } from '../types';

interface ProjectState {
  project: Project | null;
  setProject: (project: Project | null) => void;
  updateCutStatus: (cutId: string, status: CutStatus) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  seekTo: number | null;          // set by transcript/waveform clicks to seek video
  setSeekTo: (time: number) => void;
  clearSeekTo: () => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
  updateCutStatus: (cutId, status) =>
    set((state) => {
      if (!state.project) return state;
      
      const newCuts = state.project.candidate_cuts.map((cut) =>
        cut.id === cutId ? { ...cut, status } : cut
      );
      
      const newDecisions = [...(state.project.user_decisions || [])];
      const existingIdx = newDecisions.findIndex(d => d.cut_id === cutId);
      if (existingIdx >= 0) {
        newDecisions[existingIdx] = { ...newDecisions[existingIdx], action: status };
      } else {
        newDecisions.push({ cut_id: cutId, action: status });
      }

      return {
        project: {
          ...state.project,
          candidate_cuts: newCuts,
          user_decisions: newDecisions,
        },
      };
    }),
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: time }),
  seekTo: null,
  setSeekTo: (time) => set({ seekTo: time, currentTime: time }),
  clearSeekTo: () => set({ seekTo: null }),
  isUploading: false,
  setIsUploading: (isUploading) => set({ isUploading }),
}));

