import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TranscriptPanel } from '../TranscriptPanel'
import { useProjectStore } from '../../store/useProjectStore'
import type { Project } from '../../types'

vi.mock('../../api/client', () => ({
  apiClient: {
    updateCutDecision: vi.fn().mockResolvedValue(undefined),
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
    transcript_segments: [{ id: 's1', start: 0, end: 2, text: 'Hello world', words: [] }],
    words: [
      { word: 'Hello', start: 0, end: 1 },
      { word: 'world', start: 1, end: 2 },
    ],
    candidate_cuts: [],
    user_decisions: [],
    video_duration: 10,
    ...overrides,
  }
}

describe('TranscriptPanel toolbar', () => {
  beforeEach(() => {
    localStorage.clear()
    useProjectStore.setState({ project: makeProject(), currentTime: 0 })
    HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  it('copies transcript text', async () => {
    const user = userEvent.setup()
    render(<TranscriptPanel />)
    await user.click(screen.getByRole('button', { name: 'Copy transcript' }))
    expect(await screen.findByTitle('Copied')).toBeInTheDocument()
  })

  it('shows a search field and highlights matches', async () => {
    const user = userEvent.setup()
    render(<TranscriptPanel />)
    await user.click(screen.getByRole('button', { name: 'Search transcript' }))
    await user.type(screen.getByLabelText('Find in transcript'), 'hello')
    const hit = screen.getByText('Hello')
    expect(hit.className).toContain('bg-amber-400/30')
  })

  it('restores a persisted transcript search query', () => {
    localStorage.setItem('voicecut_transcriptSearchQuery', 'hello')
    render(<TranscriptPanel />)
    expect(screen.getByLabelText('Find in transcript')).toHaveValue('hello')
  })
})
