export function formatProjectName(name: string | null | undefined): string {
  const trimmed = name?.trim() ?? '';
  if (!trimmed) {
    return 'Project name: untitled';
  }
  return `Project name: ${trimmed}`;
}
