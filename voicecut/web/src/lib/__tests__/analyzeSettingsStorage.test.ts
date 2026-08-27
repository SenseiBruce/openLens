import { describe, expect, it } from 'vitest'
import {
  ANALYZE_SETTINGS_KEY,
  loadAnalyzeSettings,
  saveAnalyzeSettings,
} from '../analyzeSettingsStorage'

describe('analyzeSettingsStorage', () => {
  it('round-trips settings through a storage stub', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    const settings = {
      whisper_model: 'medium',
      min_gap_duration: 0.8,
      language: 'en',
      initial_prompt: 'vlog',
    }
    saveAnalyzeSettings(settings, storage)
    expect(mem[ANALYZE_SETTINGS_KEY]).toContain('medium')
    expect(loadAnalyzeSettings(storage)).toEqual(settings)
  })

  it('returns null for corrupt JSON', () => {
    const storage = { getItem: () => '{not-json', setItem: () => undefined }
    expect(loadAnalyzeSettings(storage)).toBeNull()
  })
})
