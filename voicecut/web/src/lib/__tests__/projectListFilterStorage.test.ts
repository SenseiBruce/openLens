import { describe, expect, it } from 'vitest'
import {
  PROJECT_LIST_FILTERS_KEY,
  loadProjectListFilters,
  saveProjectListFilters,
} from '../projectListFilterStorage'

describe('projectListFilterStorage', () => {
  it('defaults then round-trips query and status', () => {
    const mem: Record<string, string> = {}
    const storage = {
      getItem: (key: string) => mem[key] ?? null,
      setItem: (key: string, value: string) => {
        mem[key] = value
      },
    }
    expect(loadProjectListFilters(storage)).toEqual({ query: '', status: 'all' })
    saveProjectListFilters({ query: 'demo', status: 'ready' }, storage)
    expect(JSON.parse(mem[PROJECT_LIST_FILTERS_KEY])).toEqual({
      query: 'demo',
      status: 'ready',
    })
    expect(loadProjectListFilters(storage)).toEqual({ query: 'demo', status: 'ready' })
  })

  it('ignores invalid JSON and unknown status', () => {
    const storage = {
      getItem: () => '{not-json',
      setItem: () => undefined,
    }
    expect(loadProjectListFilters(storage)).toEqual({ query: '', status: 'all' })
  })
})
