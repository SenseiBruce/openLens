import { describe, expect, it } from 'vitest'
import {
  WHISPER_MODEL_KEY,
  loadWhisperModel,
  parseWhisperModel,
  saveWhisperModel,
} from '../whisperModelStorage'

describe('whisperModelStorage', () => {
  it('parses known Whisper models only', () => {
    expect(parseWhisperModel('tiny')).toBe('tiny')
    expect(parseWhisperModel('small')).toBe('small')
    expect(parseWhisperModel('large-v3')).toBe('large-v3')
    expect(parseWhisperModel('huge')).toBeNull()
  })

  it('round-trips a stored model', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    expect(loadWhisperModel(storage)).toBeNull()
    saveWhisperModel('medium', storage)
    expect(mem[WHISPER_MODEL_KEY]).toBe('medium')
    expect(loadWhisperModel(storage)).toBe('medium')
  })
})
