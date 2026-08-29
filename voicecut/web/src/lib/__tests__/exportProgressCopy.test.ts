import { describe, expect, it } from 'vitest'
import { formatExportProgress } from '../exportProgressCopy'

describe('formatExportProgress', () => {
  it('prefixes a live export status message', () => {
    expect(formatExportProgress('  Encoding mp4  ')).toBe('Export progress: Encoding mp4')
  })

  it('labels a missing message', () => {
    expect(formatExportProgress('')).toBe('Export progress: none')
    expect(formatExportProgress(null)).toBe('Export progress: none')
  })
})
