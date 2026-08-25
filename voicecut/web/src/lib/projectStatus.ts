import type { ProjectStatus } from '../types'

export function formatProjectStatus(status: ProjectStatus | undefined): string {
  return `Project status: ${status ?? 'none'}`
}
