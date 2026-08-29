export function formatExportProgress(message: string | null | undefined): string {
  const cleaned = typeof message === 'string' ? message.trim() : ''
  if (!cleaned) {
    return 'Export progress: none'
  }
  return `Export progress: ${cleaned}`
}
