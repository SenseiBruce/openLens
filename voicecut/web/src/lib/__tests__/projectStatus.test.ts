import { describe, expect, it } from 'vitest'
import { formatProjectStatus } from '../projectStatus'

describe('formatProjectStatus', () => {
  it('labels the current project status', () => {
    expect(formatProjectStatus('ready')).toBe('Project status: ready')
    expect(formatProjectStatus(undefined)).toBe('Project status: none')
  })
})
