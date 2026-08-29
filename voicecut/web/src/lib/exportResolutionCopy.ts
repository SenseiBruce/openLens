export function formatExportResolution(value: string | null | undefined): string {
  if (value == null || value === '' || value === 'original') {
    return 'Export resolution: original'
  }
  const cleaned = value.trim()
  if (!cleaned) {
    return 'Export resolution: original'
  }
  return `Export resolution: ${cleaned}`
}
