import { describe, expect, it } from 'vitest'
import { formatAnalyzeLanguage } from '../analyzeLanguage'

describe('formatAnalyzeLanguage', () => {
  it('labels known languages', () => {
    expect(formatAnalyzeLanguage('hinglish')).toBe('Spoken language: Hinglish')
    expect(formatAnalyzeLanguage('en')).toBe('Spoken language: English')
    expect(formatAnalyzeLanguage('hi')).toBe('Spoken language: Hindi')
  })

  it('labels empty as auto-detect', () => {
    expect(formatAnalyzeLanguage('')).toBe('Spoken language: Auto-detect')
    expect(formatAnalyzeLanguage(undefined)).toBe('Spoken language: Auto-detect')
  })
})
