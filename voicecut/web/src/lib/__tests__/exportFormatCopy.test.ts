import { describe, expect, it } from 'vitest'
import { formatExportFormats } from '../exportFormatCopy'

describe('formatExportFormats', () => {
  it('joins selected output formats', () => {
    expect(formatExportFormats(['mp4', 'srt'])).toBe('Export formats: mp4, srt')
  })

  it('labels an empty selection', () => {
    expect(formatExportFormats([])).toBe('Export formats: none')
    expect(formatExportFormats(null)).toBe('Export formats: none')
  })
})
