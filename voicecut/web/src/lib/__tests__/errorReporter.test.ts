import { describe, expect, it, vi } from 'vitest'
import { reportError, subscribeErrors } from '../errorReporter'

describe('reportError', () => {
  it('formats a structured payload from an Error', () => {
    const payload = reportError('upload', new Error('Upload failed'))
    expect(payload).toEqual({
      context: 'upload',
      message: 'Upload failed',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    })
  })

  it('stringifies non-Error values and notifies subscribers', () => {
    const received: string[] = []
    const unsubscribe = subscribeErrors((p) => received.push(`${p.context}:${p.message}`))
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})

    const payload = reportError('project_delete', 'boom')
    expect(payload.message).toBe('boom')
    expect(received).toEqual(['project_delete:boom'])
    expect(info).toHaveBeenCalledWith(expect.stringContaining('"level":"error"'))
    expect(JSON.parse(String(info.mock.calls[0][0]))).toMatchObject({
      level: 'error',
      context: 'project_delete',
      message: 'boom',
    })

    unsubscribe()
    reportError('project_delete', 'again')
    expect(received).toHaveLength(1)
    info.mockRestore()
  })
})
