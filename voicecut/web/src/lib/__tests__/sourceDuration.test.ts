import { describe, expect, it } from 'vitest'
import { formatSourceDuration } from '../sourceDuration'

describe('formatSourceDuration', () => {
  it('formats seconds as m:ss', () => {
    expect(formatSourceDuration(12)).toBe('Source duration: 0:12')
    expect(formatSourceDuration(65)).toBe('Source duration: 1:05')
  })

  it('labels missing duration as unknown', () => {
    expect(formatSourceDuration(undefined)).toBe('Source duration: unknown')
    expect(formatSourceDuration(0)).toBe('Source duration: unknown')
  })
})
