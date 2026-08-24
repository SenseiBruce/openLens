import { describe, expect, it } from 'vitest'
import {
  EXPORT_RESOLUTION_KEY,
  loadExportResolution,
  saveExportResolution,
} from '../exportResolutionStorage'

describe('exportResolutionStorage', () => {
  it('round-trips a named resolution', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    saveExportResolution('1080p', storage)
    expect(mem[EXPORT_RESOLUTION_KEY]).toBe('1080p')
    expect(loadExportResolution(storage)).toBe('1080p')
  })

  it('stores lossless original as original', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    saveExportResolution(null, storage)
    expect(mem[EXPORT_RESOLUTION_KEY]).toBe('original')
    expect(loadExportResolution(storage)).toBeNull()
  })

  it('returns null for unknown values', () => {
    const storage = { getItem: () => '8k', setItem: () => undefined }
    expect(loadExportResolution(storage)).toBeNull()
  })
})
