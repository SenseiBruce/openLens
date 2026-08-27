import { describe, expect, it } from 'vitest'
import { formatViralClipLength } from '../viralClipLength'

describe('formatViralClipLength', () => {
  it('formats a clip length in seconds', () => {
    expect(formatViralClipLength(30)).toBe('Viral clip length: 30s')
  })

  it('labels invalid lengths as unknown', () => {
    expect(formatViralClipLength(undefined)).toBe('Viral clip length: unknown')
    expect(formatViralClipLength(0)).toBe('Viral clip length: unknown')
  })
})
