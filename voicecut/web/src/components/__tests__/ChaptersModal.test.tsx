import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ChaptersModal } from '../ChaptersModal'
import { useProjectStore } from '../../store/useProjectStore'
import type { Project } from '../../types'

vi.mock('../../api/client', () => ({
  apiClient: {
    generateChapters: vi.fn(),
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

describe('ChaptersModal', () => {
  beforeEach(() => {
    useProjectStore.setState({ project: makeProject() })
  })

  it('copies the chapter model to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<ChaptersModal onClose={vi.fn()} />)
    fireEvent.click(screen.getByTitle('LLM Settings'))
    fireEvent.click(screen.getByRole('button', { name: /copy chapter model/i }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Chapter model: gemini/gemini-2.5-flash')
    })
  })
})
