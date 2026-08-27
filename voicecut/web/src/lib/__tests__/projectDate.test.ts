import { describe, expect, it } from 'vitest'
import { formatProjectDate } from '../projectDate'

describe('formatProjectDate', () => {
  it('formats an ISO timestamp as YYYY-MM-DD', () => {
    expect(formatProjectDate('2026-01-01T00:00:00Z')).toBe('Created: 2026-01-01')
  })

  it('labels missing dates as unknown', () => {
    expect(formatProjectDate(undefined)).toBe('Created: unknown')
    expect(formatProjectDate('not-a-date')).toBe('Created: unknown')
  })
})
