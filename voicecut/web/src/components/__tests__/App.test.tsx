import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import { apiClient } from '../../api/client'
import { useProjectStore } from '../../store/useProjectStore'
import { reportError } from '../../lib/errorReporter'
import type { Project } from '../../types'

vi.mock('../../api/client', () => ({
  apiClient: {
    getProjects: vi.fn().mockResolvedValue([]),
    getProject: vi.fn(),
    uploadVideo: vi.fn(),
    deleteProject: vi.fn(),
    analyzeProjectStream: vi.fn(),
  },
}))

vi.mock('../../lib/errorReporter', async () => {
  const actual = await vi.importActual<typeof import('../../lib/errorReporter')>(
    '../../lib/errorReporter',
  )
  return {
    ...actual,
    reportError: vi.fn(actual.reportError),
  }
})

vi.mock('../TopBar', () => ({
  TopBar: ({
    onAnalyzeStart,
    onExportStart,
  }: {
    onAnalyzeStart: (s: { whisper_model: string; min_gap_duration: number }) => void
    onExportStart: () => void
  }) => (
    <div>
      <button
        type="button"
        onClick={() => onAnalyzeStart({ whisper_model: 'small', min_gap_duration: 1 })}
      >
        start-analyze
      </button>
      <button type="button" onClick={onExportStart}>
        start-export
      </button>
    </div>
  ),
}))

vi.mock('../VideoPlayer', () => ({ VideoPlayer: () => null }))
vi.mock('../WaveformTimeline', () => ({ WaveformTimeline: () => null }))
vi.mock('../TranscriptPanel', () => ({ TranscriptPanel: () => null }))
vi.mock('../ExportModal', () => ({ ExportModal: () => <div>export-modal</div> }))
vi.mock('../ViralClipsModal', () => ({ ViralClipsModal: () => null }))

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    name: 'Demo',
    status: 'idle',
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
    candidate_cuts: [],
    user_decisions: [],
    video_duration: 10,
    ...overrides,
  }
}

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
    useProjectStore.setState({ project: null, isUploading: false })
    vi.mocked(apiClient.getProjects).mockResolvedValue([])
    vi.mocked(apiClient.uploadVideo).mockReset()
    vi.mocked(apiClient.getProject).mockReset()
    vi.mocked(apiClient.deleteProject).mockReset()
    vi.mocked(apiClient.analyzeProjectStream).mockReset()
    vi.mocked(reportError).mockClear()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }),
    )
  })

  it('handleUpload loads the new project', async () => {
    const user = userEvent.setup()
    const created = makeProject({ id: 'new-1', name: 'Uploaded' })
    vi.mocked(apiClient.uploadVideo).mockResolvedValue({
      project_id: 'new-1',
      video_path: '/tmp/v.mp4',
    })
    vi.mocked(apiClient.getProject).mockResolvedValue(created)
    vi.mocked(apiClient.getProjects).mockResolvedValue([])

    render(<App />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'clip.mp4', { type: 'video/mp4' })
    await user.upload(input, file)

    await waitFor(() => {
      expect(apiClient.uploadVideo).toHaveBeenCalled()
      expect(useProjectStore.getState().project?.id).toBe('new-1')
    })
  })

  it('reports an error when upload fails', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.uploadVideo).mockRejectedValue(new Error('disk full'))
    vi.mocked(apiClient.getProjects).mockResolvedValue([])

    render(<App />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(input, new File(['x'], 'clip.mp4', { type: 'video/mp4' }))

    await waitFor(() => {
      expect(reportError).toHaveBeenCalledWith('upload', expect.any(Error))
    })
    expect(useProjectStore.getState().project).toBeNull()
  })

  it('handleAnalyzeStart branches on complete and error events', async () => {
    const user = userEvent.setup()
    const project = makeProject()
    useProjectStore.setState({ project })
    vi.mocked(apiClient.getProject).mockResolvedValue({ ...project, status: 'ready' })

    let onEvent: ((ev: { step?: string; message?: string; project_id?: string }) => void) | undefined
    vi.mocked(apiClient.analyzeProjectStream).mockImplementation((_id, _settings, cb) => {
      onEvent = cb
      return () => {}
    })

    render(<App />)
    await user.click(screen.getByText('start-analyze'))
    expect(useProjectStore.getState().project?.status).toBe('analyzing')

    act(() => {
      onEvent?.({ step: 'transcribing', message: 'Transcribing...' })
      onEvent?.({ step: 'complete', project_id: 'p1' })
    })
    await waitFor(() => {
      expect(apiClient.getProject).toHaveBeenCalledWith('p1')
    })

    act(() => {
      onEvent?.({ step: 'error', message: 'vad failed' })
    })
    await waitFor(() => {
      expect(reportError).toHaveBeenCalledWith('analysis', 'vad failed')
    })
  })
})
