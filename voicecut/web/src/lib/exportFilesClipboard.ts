export function formatExportFiles(files: Record<string, string>): string {
  const entries = Object.entries(files)
  if (entries.length === 0) return 'Export files: none'
  return ['Export files', ...entries.map(([format, path]) => `${format}: ${path}`)].join('\n')
}
