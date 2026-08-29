import type { StoredExportFormat } from './exportFormatStorage'

export function formatExportFormats(formats: StoredExportFormat[] | null | undefined): string {
  const cleaned = (formats ?? []).filter((item) => typeof item === 'string' && item.trim())
  if (cleaned.length === 0) {
    return 'Export formats: none'
  }
  return `Export formats: ${cleaned.join(', ')}`
}
