import { describe, expect, it } from 'vitest'
import { formatSkipCuts } from '../skipCuts'

describe('formatSkipCuts', () => {
  it('labels the skip-cuts toggle', () => {
    expect(formatSkipCuts(true)).toBe('Skip cuts: on')
    expect(formatSkipCuts(false)).toBe('Skip cuts: off')
  })
})
