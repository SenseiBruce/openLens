import { describe, expect, it } from 'vitest'
import { formatProjectListStatusFilter } from '../projectListStatusFilter'

describe('formatProjectListStatusFilter', () => {
  it('labels the visible status filter', () => {
    expect(formatProjectListStatusFilter('idle')).toBe('Project status filter: idle')
    expect(formatProjectListStatusFilter('all')).toBe('Project status filter: all')
  })

  it('labels missing values as unknown', () => {
    expect(formatProjectListStatusFilter(undefined)).toBe('Project status filter: unknown')
  })
})
