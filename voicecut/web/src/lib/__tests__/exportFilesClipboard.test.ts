import { describe, expect, it } from 'vitest'
import { formatExportFiles } from '../exportFilesClipboard'

describe('formatExportFiles', () => {
  it('lists format and path pairs', () => {
    expect(formatExportFiles({ mp4: '/tmp/out.mp4', srt: '/tmp/out.srt' })).toBe(
      'Export files\nmp4: /tmp/out.mp4\nsrt: /tmp/out.srt',
    )
  })

  it('handles an empty map', () => {
    expect(formatExportFiles({})).toBe('Export files: none')
  })
})
