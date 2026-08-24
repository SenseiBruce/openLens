import { describe, expect, it, vi } from 'vitest'
import {
  buildPlainText,
  buildSrt,
  cuesFromTranscript,
  downloadTextFile,
  formatSrtTimestamp,
  wordMatchesQuery,
} from '../transcriptUtils'

describe('transcriptUtils', () => {
  it('formats SRT timestamps', () => {
    expect(formatSrtTimestamp(0)).toBe('00:00:00,000')
    expect(formatSrtTimestamp(65.25)).toBe('00:01:05,250')
    expect(formatSrtTimestamp(3661.5)).toBe('01:01:01,500')
  })

  it('prefers transcript segments when building cues and plain text', () => {
    const segments = [{ start: 0, end: 2, text: 'Hello world' }]
    const words = [
      { word: 'Hello', start: 0, end: 1 },
      { word: 'world', start: 1, end: 2 },
    ]
    expect(cuesFromTranscript(segments, words)).toEqual(segments)
    expect(buildPlainText(segments, words)).toBe('Hello world')
  })

  it('chunks words into cues when segments are missing', () => {
    const words = Array.from({ length: 10 }, (_, i) => ({
      word: `w${i}`,
      start: i,
      end: i + 0.8,
    }))
    const cues = cuesFromTranscript([], words)
    expect(cues).toHaveLength(2)
    expect(cues[0].text).toBe('w0 w1 w2 w3 w4 w5 w6 w7')
    expect(cues[1].text).toBe('w8 w9')
    expect(buildSrt(cues)).toContain('00:00:00,000 --> 00:00:07,800')
    expect(buildSrt(cues)).toContain('w8 w9')
  })

  it('matches search queries case-insensitively', () => {
    expect(wordMatchesQuery('Hello', 'ell')).toBe(true)
    expect(wordMatchesQuery('Hello', '  ')).toBe(false)
    expect(wordMatchesQuery('Hello', 'xyz')).toBe(false)
  })

  it('downloads a text blob', () => {
    const click = vi.fn()
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:srt'),
      revokeObjectURL: vi.fn(),
    })
    vi.spyOn(document, 'createElement').mockReturnValue({
      click,
      href: '',
      download: '',
    } as unknown as HTMLAnchorElement)

    downloadTextFile('subtitles.srt', '1\n00:00:00,000 --> 00:00:01,000\nHi\n', 'application/x-subrip')
    expect(click).toHaveBeenCalled()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })
})
