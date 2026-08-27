import { describe, expect, it } from 'vitest'
import { extractVideoFilename, formatVideoFilename } from '../videoFilename'

describe('formatVideoFilename', () => {
  it('uses the basename from a posix path', () => {
    expect(extractVideoFilename('/uploads/foo/bar.mp4')).toBe('bar.mp4')
    expect(formatVideoFilename('/uploads/foo/bar.mp4')).toBe('Filename: bar.mp4')
  })

  it('labels missing paths as unknown', () => {
    expect(formatVideoFilename(undefined)).toBe('Filename: unknown')
    expect(formatVideoFilename('')).toBe('Filename: unknown')
  })
})
