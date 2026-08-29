import { describe, expect, it } from 'vitest'
import { formatKeptPercent } from '../keptPercent'

describe('formatKeptPercent', () => {
  it('formats the duration bar kept percentage', () => {
    expect(formatKeptPercent(7, 10)).toBe('Kept percent: 70%')
  })

  it('labels missing duration as n/a', () => {
    expect(formatKeptPercent(7, 0)).toBe('Kept percent: n/a')
    expect(formatKeptPercent(undefined, 10)).toBe('Kept percent: n/a')
  })
})
