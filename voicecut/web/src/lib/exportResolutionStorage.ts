import { RESOLUTION_OPTIONS } from './exportResolutions'

export const EXPORT_RESOLUTION_KEY = 'exportResolution'

export type StoredExportResolution = (typeof RESOLUTION_OPTIONS)[number]['value'] | null

const ALLOWED = new Set<string>(RESOLUTION_OPTIONS.map(option => option.value))

export function loadExportResolution(
  storage: Pick<Storage, 'getItem'> = localStorage,
): StoredExportResolution {
  const raw = storage.getItem(EXPORT_RESOLUTION_KEY)
  if (raw === null || raw === 'original' || raw === '') {
    return null
  }
  if (ALLOWED.has(raw)) {
    return raw as StoredExportResolution
  }
  return null
}

export function saveExportResolution(
  value: StoredExportResolution,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  storage.setItem(EXPORT_RESOLUTION_KEY, value === null ? 'original' : value)
}
