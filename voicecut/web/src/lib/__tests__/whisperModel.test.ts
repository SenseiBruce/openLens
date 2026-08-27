import { describe, expect, it } from 'vitest'
import { formatWhisperModel } from '../whisperModel'

describe('formatWhisperModel', () => {
  it('labels a configured model', () => {
    expect(formatWhisperModel(' small ')).toBe('Whisper model: small')
  })

  it('labels missing models as unknown', () => {
    expect(formatWhisperModel(undefined)).toBe('Whisper model: unknown')
    expect(formatWhisperModel('')).toBe('Whisper model: unknown')
  })
})
