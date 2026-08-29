import { describe, expect, it } from 'vitest'
import { formatExportResolution } from '../exportResolutionCopy'

describe('formatExportResolution', () => {
  it('labels a downscale selection', () => {
    expect(formatExportResolution('720p')).toBe('Export resolution: 720p')
  })

  it('labels lossless original', () => {
    expect(formatExportResolution(null)).toBe('Export resolution: original')
    expect(formatExportResolution('original')).toBe('Export resolution: original')
  })
})
