import type { ProjectStatus } from '../types'

export function formatProjectListStatusFilter(
  status: ProjectStatus | 'all' | null | undefined,
): string {
  const allowed = new Set(['all', 'idle', 'analyzing', 'ready', 'exporting', 'error'])
  if (status && allowed.has(status)) {
    return `Project status filter: ${status}`
  }
  return 'Project status filter: unknown'
}
