import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AnalyzeModal } from '../AnalyzeModal'
import { useProjectStore } from '../../store/useProjectStore'
import type { Project } from '../../types'

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
      language: 'hinglish',
      initial_prompt: 'names: Kinshuk',
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

describe('AnalyzeModal', () => {
  beforeEach(() => {
    useProjectStore.setState({ project: makeProject() })
  })

  it('copies the spoken language', async () => {
  it('copies the custom prompt', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<AnalyzeModal onClose={vi.fn()} onStart={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /copy spoken language/i }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Spoken language: Hinglish')
    fireEvent.click(screen.getByRole('button', { name: /copy custom prompt/i }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Custom prompt: names: Kinshuk')
    })
  })
})
