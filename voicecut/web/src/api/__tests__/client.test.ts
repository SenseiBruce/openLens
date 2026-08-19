import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '../client'

describe('apiClient.saveDecisions', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('PATCHes the decisions payload for the project', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await apiClient.saveDecisions('proj-1', [{ cut_id: 'c1', status: 'cut' }])

    expect(fetchMock).toHaveBeenCalledWith('/api/projects/proj-1/decisions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ cut_id: 'c1', status: 'cut' }]),
    })
  })

  it('throws when the server rejects the patch', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await expect(apiClient.saveDecisions('proj-1', [])).rejects.toThrow(
      'Failed to save decisions (500)',
    )
  })
})
