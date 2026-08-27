import { create } from 'zustand';
import type { Project, CutStatus } from '../types';
import { apiClient } from '../api/client';
import { reportError } from '../lib/errorReporter';
import { loadSkipCuts, saveSkipCuts } from '../lib/skipCutsStorage';

export type CutUndoEntry = {
  cutId: string;
  previousStatus: CutStatus;
};

function applyCutStatus(project: Project, cutId: string, status: CutStatus): Project {
  const newCuts = project.candidate_cuts.map((cut) =>
    cut.id === cutId ? { ...cut, status } : cut
  );

  const newDecisions = [...(project.user_decisions || [])];
  const existingIdx = newDecisions.findIndex((d) => d.cut_id === cutId);
  if (existingIdx >= 0) {
    newDecisions[existingIdx] = { ...newDecisions[existingIdx], action: status };
  } else {
    newDecisions.push({ cut_id: cutId, action: status });
  }

  return {
    ...project,
    candidate_cuts: newCuts,
    user_decisions: newDecisions,
  };
}

interface ProjectState {
  project: Project | null;
  setProject: (project: Project | null) => void;
  updateCutStatus: (cutId: string, status: CutStatus) => void;
  undoLastCutDecision: () => boolean;
  cutUndoStack: CutUndoEntry[];
  currentTime: number;
  setCurrentTime: (time: number) => void;
  seekTo: number | null;          // set by transcript/waveform clicks to seek video
  setSeekTo: (time: number) => void;
  clearSeekTo: () => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  skipCuts: boolean;
  setSkipCuts: (skip: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  cutUndoStack: [],
  setProject: (project) => set({ project, cutUndoStack: [] }),
  updateCutStatus: (cutId, status) =>
    set((state) => {
      if (!state.project) return state;
      const current = state.project.candidate_cuts.find((cut) => cut.id === cutId);
      const previousStatus: CutStatus = current?.status ?? 'pending';

      apiClient.updateCutDecision(state.project.id, cutId, status).catch((err) => {
        reportError('cut_decision_sync', err);
      });

      return {
        cutUndoStack: [...state.cutUndoStack, { cutId, previousStatus }],
        project: applyCutStatus(state.project, cutId, status),
      };
    }),
  undoLastCutDecision: () => {
    const state = get();
    if (!state.project || state.cutUndoStack.length === 0) return false;
    const entry = state.cutUndoStack[state.cutUndoStack.length - 1];

    apiClient.updateCutDecision(state.project.id, entry.cutId, entry.previousStatus).catch((err) => {
      reportError('cut_decision_sync', err);
    });

    set({
      cutUndoStack: state.cutUndoStack.slice(0, -1),
      project: applyCutStatus(state.project, entry.cutId, entry.previousStatus),
    });
    return true;
  },
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: time }),
  seekTo: null,
  setSeekTo: (time) => set({ seekTo: time, currentTime: time }),
  clearSeekTo: () => set({ seekTo: null }),
  isUploading: false,
  setIsUploading: (isUploading) => set({ isUploading }),
  skipCuts: loadSkipCuts(),
  setSkipCuts: (skip) => {
    saveSkipCuts(skip);
    set({ skipCuts: skip });
  },
}));
