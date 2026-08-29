import { describe, expect, it } from 'vitest'
import {
  INITIAL_PROMPT_KEY,
  loadInitialPrompt,
  parseInitialPrompt,
  saveInitialPrompt,
} from '../initialPromptStorage'

describe('initialPromptStorage', () => {
  it('keeps empty prompts so Analyze can restore a blank field', () => {
    expect(parseInitialPrompt('')).toBe('')
    expect(parseInitialPrompt('names: Kinshuk')).toBe('names: Kinshuk')
    expect(parseInitialPrompt(undefined)).toBeNull()
  })

  it('round-trips a stored prompt', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    expect(loadInitialPrompt(storage)).toBeNull()
    saveInitialPrompt('acronyms: NLP', storage)
    expect(mem[INITIAL_PROMPT_KEY]).toBe('acronyms: NLP')
    expect(loadInitialPrompt(storage)).toBe('acronyms: NLP')
  })
})
