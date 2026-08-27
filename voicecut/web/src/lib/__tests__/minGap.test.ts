import { describe, expect, it } from 'vitest'
import { formatMinGap } from '../minGap'

describe('formatMinGap', () => {
  it('formats a gap in seconds', () => {
    expect(formatMinGap(1)).toBe('Minimum silence gap: 1.0s')
  })

  it('labels invalid gaps as unknown', () => {
    expect(formatMinGap(undefined)).toBe('Minimum silence gap: unknown')
    expect(formatMinGap(0)).toBe('Minimum silence gap: unknown')
  })
})
