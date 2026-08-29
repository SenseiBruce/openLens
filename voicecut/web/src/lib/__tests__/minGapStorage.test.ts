import { describe, expect, it } from 'vitest'
import { MIN_GAP_KEY, loadMinGap, parseMinGap, saveMinGap } from '../minGapStorage'

describe('minGapStorage', () => {
  it('parses gaps in the 0.1–3.0s analyze range', () => {
    expect(parseMinGap('1')).toBe(1)
    expect(parseMinGap('0.15')).toBe(0.2)
    expect(parseMinGap('0.05')).toBeNull()
    expect(parseMinGap('3.1')).toBeNull()
    expect(parseMinGap('nope')).toBeNull()
  })

  it('round-trips a stored gap', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    expect(loadMinGap(storage)).toBeNull()
    saveMinGap(1.4, storage)
    expect(mem[MIN_GAP_KEY]).toBe('1.4')
    expect(loadMinGap(storage)).toBe(1.4)
  })
})
