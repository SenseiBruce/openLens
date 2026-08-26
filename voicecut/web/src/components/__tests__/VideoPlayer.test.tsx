import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VideoPlayer } from '../VideoPlayer'
import { useProjectStore } from '../../store/useProjectStore'
import type { Project } from '../../types'

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'p1',
    name: 'Demo',
    status: 'ready',
    video_path: '/uploads/p1/interview-take-2.mp4',
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

describe('VideoPlayer filename copy', () => {
  beforeEach(() => {
    useProjectStore.setState({ project: makeProject(), skipCuts: true })
  })

  it('copies the source filename', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<VideoPlayer />)
    expect(screen.getByText('interview-take-2.mp4')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Copy video filename' }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Filename: interview-take-2.mp4')
    })
  })
})
