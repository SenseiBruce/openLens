import { describe, expect, it } from 'vitest'
import {
  EXPORT_FORMAT_KEY,
  loadExportFormats,
  parseExportFormats,
  saveExportFormats,
} from '../exportFormatStorage'

describe('exportFormatStorage', () => {
  it('parses known formats only', () => {
    expect(parseExportFormats(JSON.stringify(['mp4', 'srt']))).toEqual(['mp4', 'srt'])
    expect(parseExportFormats(JSON.stringify(['avi']))).toBeNull()
    expect(parseExportFormats('not-json')).toBeNull()
  })

  it('round-trips selected formats', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    saveExportFormats(['srt', 'vtt'], storage)
    expect(mem[EXPORT_FORMAT_KEY]).toBe(JSON.stringify(['srt', 'vtt']))
    expect(loadExportFormats(storage)).toEqual(['srt', 'vtt'])
  })

  it('defaults to mp4', () => {
    expect(loadExportFormats({ getItem: () => null })).toEqual(['mp4'])
  })
})
