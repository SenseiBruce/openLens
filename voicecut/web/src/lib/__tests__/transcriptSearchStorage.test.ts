import { describe, expect, it } from 'vitest'
import {
  TRANSCRIPT_SEARCH_KEY,
  loadTranscriptSearchQuery,
  saveTranscriptSearchQuery,
} from '../transcriptSearchStorage'

describe('transcriptSearchStorage', () => {
  it('defaults then round-trips the query', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    expect(loadTranscriptSearchQuery(storage)).toBe('')
    saveTranscriptSearchQuery('hello', storage)
    expect(mem[TRANSCRIPT_SEARCH_KEY]).toBe('hello')
    expect(loadTranscriptSearchQuery(storage)).toBe('hello')
  })

  it('returns empty when storage throws', () => {
    const storage = {
      getItem: () => {
        throw new Error('blocked')
      },
    }
    expect(loadTranscriptSearchQuery(storage)).toBe('')
  })
})
