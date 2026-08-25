import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TopBar } from '../TopBar'
import { useProjectStore } from '../../store/useProjectStore'
import { apiClient } from '../../api/client'
import type { Project } from '../../types'

vi.mock('../AnalyzeModal', () => ({ AnalyzeModal: () => null }))
vi.mock('../ChaptersModal', () => ({ ChaptersModal: () => null }))
vi.mock('../../api/client', () => ({
  apiClient: {
    uploadVideo: vi.fn(),
    getProject: vi.fn(),
    getDetailedHealth: vi.fn(),
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

describe('TopBar', () => {
  beforeEach(() => {
    useProjectStore.setState({ project: null, isUploading: false, skipCuts: true })
    vi.mocked(apiClient.getDetailedHealth).mockReset()
  })

  it('polls health and shows offline when the backend is down', async () => {
    vi.mocked(apiClient.getDetailedHealth).mockRejectedValue(new Error('network'))
    render(
      <TopBar onAnalyzeStart={vi.fn()} onExportStart={vi.fn()} onViralClipsStart={vi.fn()} />,
    )
    expect(await screen.findByText('offline')).toBeInTheDocument()
  })

  it('shows live when /health/detailed reports healthy', async () => {
    vi.mocked(apiClient.getDetailedHealth).mockResolvedValue({ status: 'healthy' })
    render(
      <TopBar onAnalyzeStart={vi.fn()} onExportStart={vi.fn()} onViralClipsStart={vi.fn()} />,
    )
    expect(await screen.findByText('live')).toBeInTheDocument()
  })

  it('shows degraded when health is not healthy', async () => {
    vi.mocked(apiClient.getDetailedHealth).mockResolvedValue({ status: 'degraded' })
    render(
      <TopBar onAnalyzeStart={vi.fn()} onExportStart={vi.fn()} onViralClipsStart={vi.fn()} />,
    )
    expect(await screen.findByText('degraded')).toBeInTheDocument()
  })

  it('toggles skip-cuts from the store', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.getDetailedHealth).mockResolvedValue({ status: 'healthy' })
    useProjectStore.setState({ project: makeProject(), skipCuts: true })
    render(
      <TopBar onAnalyzeStart={vi.fn()} onExportStart={vi.fn()} onViralClipsStart={vi.fn()} />,
    )
    expect(useProjectStore.getState().skipCuts).toBe(true)
    await user.click(screen.getByText('Skip Cuts'))
    expect(useProjectStore.getState().skipCuts).toBe(false)
  })

  it('renders kept and removed duration for a ready project', async () => {
    vi.mocked(apiClient.getDetailedHealth).mockResolvedValue({ status: 'healthy' })
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
    expect(screen.getByRole('button', { name: /^copy$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy cuts/i })).toBeInTheDocument()
  })

  it('copies project id from the name pill when duration is hidden', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    vi.mocked(apiClient.getDetailedHealth).mockResolvedValue({ status: 'healthy' })
    useProjectStore.setState({
      project: makeProject({ status: 'idle', video_duration: 0, name: 'Demo' }),
    })
    render(
      <TopBar onAnalyzeStart={vi.fn()} onExportStart={vi.fn()} onViralClipsStart={vi.fn()} />,
    )
    await user.click(screen.getByRole('button', { name: /copy project id/i }))
    expect(writeText).toHaveBeenCalledWith('Demo\nid: p1')
  })

  it('copies the duration pill text', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    vi.mocked(apiClient.getDetailedHealth).mockResolvedValue({ status: 'healthy' })
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
    await user.click(screen.getByRole('button', { name: /copy kept duration/i }))
    expect(writeText).toHaveBeenCalledWith('0:07 / 0:10 -0:03')
  })
})
