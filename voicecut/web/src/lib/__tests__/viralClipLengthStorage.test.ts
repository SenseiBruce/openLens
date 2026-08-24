import { describe, expect, it } from 'vitest'
import {
  VIRAL_CLIP_LENGTH_KEY,
  loadViralClipLength,
  saveViralClipLength,
} from '../viralClipLengthStorage'

describe('viralClipLengthStorage', () => {
  it('round-trips an allowed length', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    saveViralClipLength(15, storage)
    expect(mem[VIRAL_CLIP_LENGTH_KEY]).toBe('15')
    expect(loadViralClipLength(storage)).toBe(15)
  })

  it('falls back for unknown values', () => {
    const storage = { getItem: () => '90', setItem: () => undefined }
    expect(loadViralClipLength(storage, 30)).toBe(30)
  })
})
