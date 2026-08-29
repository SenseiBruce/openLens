import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AnalyzeModal } from '../AnalyzeModal'
import { ANALYZE_LANGUAGE_KEY } from '../../lib/analyzeLanguageStorage'
import { WHISPER_MODEL_KEY } from '../../lib/whisperModelStorage'
import { MIN_GAP_KEY } from '../../lib/minGapStorage'
import { INITIAL_PROMPT_KEY } from '../../lib/initialPromptStorage'
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
    localStorage.clear()
    useProjectStore.setState({ project: makeProject() })
  })

  it('copies the Whisper model', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<AnalyzeModal onClose={vi.fn()} onStart={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /copy whisper model/i }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Whisper model: small')
    })
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

  it('copies the custom prompt', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<AnalyzeModal onClose={vi.fn()} onStart={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /copy custom prompt/i }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Custom prompt: names: Kinshuk')
    })
  })

  it('persists spoken language separately', async () => {
    const user = userEvent.setup()
    render(<AnalyzeModal onClose={vi.fn()} onStart={vi.fn()} />)
    await user.selectOptions(screen.getByRole('combobox', { name: /spoken language/i }), 'en')
    expect(localStorage.getItem(ANALYZE_LANGUAGE_KEY)).toBe('en')
  })

  it('persists Whisper model separately', async () => {
    const user = userEvent.setup()
    render(<AnalyzeModal onClose={vi.fn()} onStart={vi.fn()} />)
    await user.selectOptions(
      screen.getByRole('combobox', { name: /transcription accuracy/i }),
      'medium',
    )
    expect(localStorage.getItem(WHISPER_MODEL_KEY)).toBe('medium')
  })

  it('persists minimum silence gap separately', () => {
    render(<AnalyzeModal onClose={vi.fn()} onStart={vi.fn()} />)
    fireEvent.change(screen.getByRole('slider', { name: /minimum silence gap/i }), {
      target: { value: '1.7' },
    })
    expect(localStorage.getItem(MIN_GAP_KEY)).toBe('1.7')
  })

  it('persists custom prompt separately', async () => {
    const user = userEvent.setup()
    render(<AnalyzeModal onClose={vi.fn()} onStart={vi.fn()} />)
    await user.clear(screen.getByPlaceholderText(/this is a vlog/i))
    await user.type(screen.getByPlaceholderText(/this is a vlog/i), 'acronyms: NLP')
    expect(localStorage.getItem(INITIAL_PROMPT_KEY)).toBe('acronyms: NLP')
  })
})
