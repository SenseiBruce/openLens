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
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<AnalyzeModal onClose={vi.fn()} onStart={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /copy spoken language/i }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Spoken language: Hinglish')
    })
  })
})
