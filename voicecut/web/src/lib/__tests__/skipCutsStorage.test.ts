import { describe, expect, it } from 'vitest'
import { SKIP_CUTS_KEY, loadSkipCuts, saveSkipCuts } from '../skipCutsStorage'

describe('skipCutsStorage', () => {
  it('defaults to true and round-trips false', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    expect(loadSkipCuts(storage)).toBe(true)
    saveSkipCuts(false, storage)
    expect(mem[SKIP_CUTS_KEY]).toBe('false')
    expect(loadSkipCuts(storage)).toBe(false)
  })
})
