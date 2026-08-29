export const MIN_GAP_KEY = 'voicecut_minGapDuration'

export function parseMinGap(value: string | null | undefined): number | null {
  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0.1 || n > 3) {
    return null
  }
  return Math.round(n * 10) / 10
}

export function loadMinGap(storage: Pick<Storage, 'getItem'> = localStorage): number | null {
  try {
    return parseMinGap(storage.getItem(MIN_GAP_KEY))
  } catch {
    return null
  }
}

export function saveMinGap(
  seconds: number,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  const parsed = parseMinGap(String(seconds))
  if (parsed === null) {
    return
  }
  try {
    storage.setItem(MIN_GAP_KEY, String(parsed))
  } catch {
    /* storage unavailable */
  }
}
