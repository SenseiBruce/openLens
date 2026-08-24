import { describe, expect, it } from 'vitest'
import { formatChapterTimestamps, formatYouTubeTimestamp } from '../chapterClipboard'

describe('chapterClipboard', () => {
  it('formats youtube-style timestamps', () => {
    expect(formatYouTubeTimestamp(0)).toBe('0:00')
    expect(formatYouTubeTimestamp(125)).toBe('2:05')
    expect(formatYouTubeTimestamp(3661)).toBe('1:01:01')
  })

  it('joins chapter starts and titles for a description paste', () => {
    expect(
      formatChapterTimestamps([
        { start: 0, title: 'Intro' },
        { start: 150, title: 'Main topic' },
      ]),
    ).toBe('0:00 Intro\n2:30 Main topic')
  })
})
