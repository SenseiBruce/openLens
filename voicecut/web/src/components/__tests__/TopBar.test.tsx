import React from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TopBar } from '../TopBar'
import { computeKeptDuration } from '../../lib/keptDuration'
import { useProjectStore } from '../../store/useProjectStore'
import type { Project } from '../../types'

vi.mock('../AnalyzeModal', () => ({ AnalyzeModal: () => null }))
vi.mock('../ChaptersModal', () => ({ ChaptersModal: () => null }))
vi.mock('../../api/client', () => ({
  apiClient: {
    uploadVideo: vi.fn(),
    getProject: vi.fn(),
  },
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
    candidate_cuts: [],
    user_decisions: [],
    video_duration: 10,
    ...overrides,
  }
}

describe('computeKeptDuration', () => {
  it('returns zeros without a project or duration', () => {
    expect(computeKeptDuration(null)).toEqual({ totalDur: 0, keptDur: 0, removedDur: 0 })
  })

  it('subtracts cuts, honoring user decisions', () => {
    const project = makeProject({
      candidate_cuts: [
        { id: 'c1', start: 2, end: 5, reason: 'long_pause', status: 'cut', duration: 3 },
        { id: 'c2', start: 8, end: 9, reason: 'long_pause', status: 'cut', duration: 1 },
      ],
      user_decisions: [{ cut_id: 'c2', action: 'kept' }],
    })
    expect(computeKeptDuration(project)).toEqual({ totalDur: 10, keptDur: 7, removedDur: 3 })
  })
})

describe('TopBar', () => {
  beforeEach(() => {
    useProjectStore.setState({ project: null, isUploading: false, skipCuts: true })
    vi.unstubAllGlobals()
  })

  it('polls health and shows offline when the backend is down', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    render(
      <TopBar onAnalyzeStart={vi.fn()} onExportStart={vi.fn()} onViralClipsStart={vi.fn()} />,
    )
    expect(await screen.findByText('offline')).toBeInTheDocument()
  })

  it('shows live when /health/detailed reports healthy', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'healthy' }),
      }),
    )
    render(
      <TopBar onAnalyzeStart={vi.fn()} onExportStart={vi.fn()} onViralClipsStart={vi.fn()} />,
    )
    expect(await screen.findByText('live')).toBeInTheDocument()
  })

  it('renders kept and removed duration for a ready project', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'healthy' }) }),
    )
    useProjectStore.setState({
      project: makeProject({
        candidate_cuts: [
          { id: 'c1', start: 0, end: 3, reason: 'no_dialogue', status: 'cut', duration: 3 },
        ],
      }),
    })
    render(
      <TopBar onAnalyzeStart={vi.fn()} onExportStart={vi.fn()} onViralClipsStart={vi.fn()} />,
    )
    expect(await screen.findByText('0:07')).toBeInTheDocument()
    expect(screen.getByText('/ 0:10')).toBeInTheDocument()
    expect(screen.getByText('-0:03')).toBeInTheDocument()
  })
})
