import { describe, expect, it } from 'vitest'
import { CHAPTER_MODEL_KEY, loadChapterModel, saveChapterModel } from '../chapterModelStorage'

describe('chapterModelStorage', () => {
  it('defaults then round-trips a custom model name', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    expect(loadChapterModel(storage)).toBe('gemini/gemini-2.5-flash')
    saveChapterModel(' openrouter/auto ', storage)
    expect(mem[CHAPTER_MODEL_KEY]).toBe('openrouter/auto')
    expect(loadChapterModel(storage)).toBe('openrouter/auto')
  })
})
