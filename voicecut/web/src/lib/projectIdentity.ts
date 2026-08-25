export type ProjectIdentity = {
  id: string
  name: string
}

export function formatProjectIdentity(project: ProjectIdentity): string {
  const name = project.name.trim() || 'Untitled project'
  return `${name}\nid: ${project.id}`
}
