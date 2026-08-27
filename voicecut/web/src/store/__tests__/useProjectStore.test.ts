import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Project } from '../../types'
import { useProjectStore } from '../useProjectStore'
import { apiClient } from '../../api/client'

vi.mock('../../api/client', () => ({
  apiClient: {
    updateCutDecision: vi.fn().mockResolvedValue(undefined),
  },
}))

vi.mock('../../lib/errorReporter', () => ({
  reportError: vi.fn(),
}))

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    name: 'Demo',
    status: 'ready',
    settings: {
      min_gap_duration: 1,
      margin: 0.15,
      whisper_model: 'small',
      device: 'cpu',
      export_formats: ['mp4'],
      min_speech_confidence: 0.5,
    },
    speech_segments: [],
    transcript_segments: [],
    words: [],
    candidate_cuts: [
      {
        id: 'c1',
        start: 1,
        end: 2,
        reason: 'long_pause',
        status: 'pending',
        duration: 1,
      },
    ],
    user_decisions: [],
    video_duration: 10,
    ...overrides,
  }
}

describe('useProjectStore cut undo', () => {
  beforeEach(() => {
    useProjectStore.setState({
      project: makeProject(),
      cutUndoStack: [],
      currentTime: 0,
      seekTo: null,
      isUploading: false,
      skipCuts: true,
    })
    vi.mocked(apiClient.updateCutDecision).mockClear()
  })

  it('restores the previous keep/cut decision', () => {
    const { updateCutStatus, undoLastCutDecision } = useProjectStore.getState()
    updateCutStatus('c1', 'cut')
    expect(useProjectStore.getState().project?.candidate_cuts[0].status).toBe('cut')
    expect(useProjectStore.getState().project?.user_decisions).toEqual([
      { cut_id: 'c1', action: 'cut' },
    ])

    expect(undoLastCutDecision()).toBe(true)
    expect(useProjectStore.getState().project?.candidate_cuts[0].status).toBe('pending')
    expect(useProjectStore.getState().project?.user_decisions).toEqual([
      { cut_id: 'c1', action: 'pending' },
    ])
    expect(apiClient.updateCutDecision).toHaveBeenLastCalledWith('p1', 'c1', 'pending')
  })

  it('is a no-op when the undo stack is empty', () => {
    const { undoLastCutDecision } = useProjectStore.getState()
    expect(undoLastCutDecision()).toBe(false)
    expect(useProjectStore.getState().project?.candidate_cuts[0].status).toBe('pending')
  })

  it('clears undo history when a new project is loaded', () => {
    const { updateCutStatus, setProject, undoLastCutDecision } = useProjectStore.getState()
    updateCutStatus('c1', 'kept')
    setProject(makeProject({ id: 'p2' }))
    expect(undoLastCutDecision()).toBe(false)
  })
})
