import { describe, expect, it } from 'vitest'
import {
  ANALYZE_LANGUAGE_KEY,
  loadAnalyzeLanguage,
  parseAnalyzeLanguage,
  saveAnalyzeLanguage,
} from '../analyzeLanguageStorage'

describe('analyzeLanguageStorage', () => {
  it('parses auto-detect and known languages', () => {
    expect(parseAnalyzeLanguage('')).toBe('')
    expect(parseAnalyzeLanguage('en')).toBe('en')
    expect(parseAnalyzeLanguage('hi')).toBe('hi')
    expect(parseAnalyzeLanguage('hinglish')).toBe('hinglish')
    expect(parseAnalyzeLanguage('fr')).toBeNull()
  })

  it('round-trips a stored language', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    expect(loadAnalyzeLanguage(storage)).toBeNull()
    saveAnalyzeLanguage('en', storage)
    expect(mem[ANALYZE_LANGUAGE_KEY]).toBe('en')
    expect(loadAnalyzeLanguage(storage)).toBe('en')
  })
})
