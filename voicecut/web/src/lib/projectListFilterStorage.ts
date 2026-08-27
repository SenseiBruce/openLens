import type { ProjectStatus } from '../types'
import type { ProjectListFilterState } from './projectListFilters'

export const PROJECT_LIST_FILTERS_KEY = 'voicecut_projectListFilters'

const STATUSES = new Set<ProjectListFilterState['status']>([
  'all',
  'idle',
  'analyzing',
  'ready',
  'exporting',
  'error',
])

export const DEFAULT_PROJECT_LIST_FILTERS: ProjectListFilterState = {
  query: '',
  status: 'all',
}

function parseStatus(value: unknown): ProjectListFilterState['status'] {
  if (typeof value === 'string' && STATUSES.has(value as ProjectStatus | 'all')) {
    return value as ProjectListFilterState['status']
  }
  return 'all'
}

export function loadProjectListFilters(
  storage: Pick<Storage, 'getItem'> = localStorage,
): ProjectListFilterState {
  try {
    const raw = storage.getItem(PROJECT_LIST_FILTERS_KEY)
    if (!raw) return { ...DEFAULT_PROJECT_LIST_FILTERS }
    const parsed = JSON.parse(raw) as Partial<ProjectListFilterState>
    return {
      query: typeof parsed.query === 'string' ? parsed.query : '',
      status: parseStatus(parsed.status),
    }
  } catch {
    return { ...DEFAULT_PROJECT_LIST_FILTERS }
  }
}

export function saveProjectListFilters(
  filters: ProjectListFilterState,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  try {
    storage.setItem(
      PROJECT_LIST_FILTERS_KEY,
      JSON.stringify({
        query: filters.query,
        status: parseStatus(filters.status),
      }),
    )
  } catch {
    /* storage unavailable */
  }
}
