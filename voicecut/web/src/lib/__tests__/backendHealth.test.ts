import { describe, expect, it } from 'vitest'
import { formatBackendHealth } from '../backendHealth'

describe('formatBackendHealth', () => {
  it('labels the current health token', () => {
    expect(formatBackendHealth('live')).toBe('Backend status: live')
    expect(formatBackendHealth('offline')).toBe('Backend status: offline')
  })
})
