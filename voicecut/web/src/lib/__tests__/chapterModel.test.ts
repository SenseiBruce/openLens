import { describe, expect, it } from 'vitest'
import { formatChapterModel } from '../chapterModel'

describe('formatChapterModel', () => {
  it('labels a model id', () => {
    expect(formatChapterModel('gemini/gemini-2.5-flash')).toBe(
      'Chapter model: gemini/gemini-2.5-flash',
    )
  })

  it('labels a missing model', () => {
    expect(formatChapterModel('  ')).toBe('Chapter model: unset')
  })
})
