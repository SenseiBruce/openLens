import { describe, expect, it } from 'vitest'
import { formatOriginalResolution } from '../originalResolution'

describe('formatOriginalResolution', () => {
  it('labels a positive height', () => {
    expect(formatOriginalResolution(1080)).toBe('Original resolution: 1080p')
  })

  it('labels missing height', () => {
    expect(formatOriginalResolution(undefined)).toBe('Original resolution: unknown')
  })
})
