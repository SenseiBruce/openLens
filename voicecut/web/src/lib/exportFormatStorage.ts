export const EXPORT_FORMAT_KEY = 'voicecut_exportFormat'

export const EXPORT_FORMAT_OPTIONS = ['mp4', 'srt', 'vtt', 'json_edl'] as const

export type StoredExportFormat = (typeof EXPORT_FORMAT_OPTIONS)[number]

const ALLOWED = new Set<string>(EXPORT_FORMAT_OPTIONS)
const DEFAULT_FORMATS: StoredExportFormat[] = ['mp4']

export function parseExportFormats(raw: string | null | undefined): StoredExportFormat[] | null {
  if (raw == null || raw.trim() === '') return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    const formats = parsed.filter(
      (item): item is StoredExportFormat => typeof item === 'string' && ALLOWED.has(item),
    )
    return formats.length > 0 ? formats : null
  } catch {
    return null
  }
}

export function loadExportFormats(
  storage: Pick<Storage, 'getItem'> = localStorage,
): StoredExportFormat[] {
  try {
    return parseExportFormats(storage.getItem(EXPORT_FORMAT_KEY)) ?? [...DEFAULT_FORMATS]
  } catch {
    return [...DEFAULT_FORMATS]
  }
}

export function saveExportFormats(
  formats: StoredExportFormat[],
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  const cleaned = formats.filter((item) => ALLOWED.has(item))
  const next = cleaned.length > 0 ? cleaned : [...DEFAULT_FORMATS]
  try {
    storage.setItem(EXPORT_FORMAT_KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable */
  }
}
