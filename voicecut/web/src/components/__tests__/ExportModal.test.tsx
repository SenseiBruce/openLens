import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ExportModal } from '../ExportModal'
import { apiClient } from '../../api/client'
import { useProjectStore } from '../../store/useProjectStore'
import { resolutionsAtOrBelow } from '../../lib/exportResolutions'
import type { Project } from '../../types'

vi.mock('../../api/client', () => ({
  apiClient: {
    getVideoInfo: vi.fn(),
    exportProjectStream: vi.fn(),
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

describe('resolutionsAtOrBelow', () => {
  it('hides options taller than the source', () => {
    const values = resolutionsAtOrBelow(1080).map((o) => o.value)
    expect(values).toEqual(['1080p', '720p', '480p', '360p'])
    expect(values).not.toContain('2160p')
  })
})

describe('ExportModal', () => {
  beforeEach(() => {
    localStorage.clear()
    useProjectStore.setState({ project: makeProject() })
    vi.mocked(apiClient.getVideoInfo).mockResolvedValue({ width: 1920, height: 1080 })
    vi.mocked(apiClient.exportProjectStream).mockImplementation((_id, _res, onEvent) => {
      onEvent({ step: 'files', files: { mp4: '/tmp/out.mp4' } })
      return { close: vi.fn() } as unknown as EventSource
    })
  })

  it('lists only resolutions at or below the original height', async () => {
    render(<ExportModal onClose={vi.fn()} />)
    expect(await screen.findByText(/Original resolution/)).toBeInTheDocument()
    expect(screen.getByText('1080p Full HD')).toBeInTheDocument()
    expect(screen.queryByText('4K (2160p)')).not.toBeInTheDocument()
  })

  it('exports the selected downscale mapping', async () => {
    const user = userEvent.setup()
    render(<ExportModal onClose={vi.fn()} />)
    await screen.findByText('720p HD')
    await user.click(screen.getByText('720p HD'))
    await user.click(screen.getByRole('button', { name: 'Export' }))
    await waitFor(() => {
      expect(apiClient.exportProjectStream).toHaveBeenCalledWith(
        'p1',
        '720p',
        expect.any(Function),
      )
    })
    expect(await screen.findByText('Export Complete')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy paths/i })).toBeInTheDocument()
  })

  it('persists output format checkboxes', async () => {
    const user = userEvent.setup()
    render(<ExportModal onClose={vi.fn()} />)
    await screen.findByText('1080p Full HD')
    await user.click(screen.getByRole('checkbox', { name: 'SRT' }))
    expect(JSON.parse(localStorage.getItem('voicecut_exportFormat') || '[]')).toEqual(['mp4', 'srt'])
  })

  it('copies original resolution to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<ExportModal onClose={vi.fn()} />)
    await screen.findByText('1080p Full HD')
    fireEvent.click(screen.getByRole('button', { name: /copy original resolution/i }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Original resolution: 1080p')
    })
  })

  it('copies selected export formats to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<ExportModal onClose={vi.fn()} />)
    await screen.findByText('1080p Full HD')
    fireEvent.click(screen.getByRole('button', { name: /copy export formats/i }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Export formats: mp4')
    })
  })

  it('copies selected export resolution to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<ExportModal onClose={vi.fn()} />)
    await screen.findByText('1080p Full HD')
    fireEvent.click(screen.getByRole('button', { name: /copy export resolution/i }))
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Export resolution: original')
    })
  })
})
