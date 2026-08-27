import type { ProjectStatus, ProjectSummary } from '../types'

export type ProjectListFilterState = {
  query: string
  status: ProjectStatus | 'all'
}

export function filterProjects(
  projects: ProjectSummary[],
  filters: ProjectListFilterState,
): ProjectSummary[] {
  const query = filters.query.trim().toLowerCase()
  return projects.filter((project) => {
    if (query && !project.name.toLowerCase().includes(query)) {
      return false
    }
    if (filters.status !== 'all' && project.status !== filters.status) {
      return false
    }
    return true
  })
}
