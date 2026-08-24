import { describe, expect, it } from 'vitest'
import { filterProjects } from '../projectListFilters'
import type { ProjectSummary } from '../../types'

const projects: ProjectSummary[] = [
  { id: '1', name: 'Podcast Cut', status: 'ready' },
  { id: '2', name: 'Interview Two', status: 'idle' },
  { id: '3', name: 'podcast recap', status: 'error' },
]

describe('filterProjects', () => {
  it('matches names case-insensitively', () => {
    const result = filterProjects(projects, { query: 'PODCAST', status: 'all' })
    expect(result.map((p) => p.id)).toEqual(['1', '3'])
  })

  it('filters by status', () => {
    const result = filterProjects(projects, { query: '', status: 'idle' })
    expect(result).toEqual([projects[1]])
  })

  it('combines query and status', () => {
    const result = filterProjects(projects, { query: 'podcast', status: 'error' })
    expect(result.map((p) => p.id)).toEqual(['3'])
  })
})
