export const VIRAL_CLIP_LENGTH_KEY = 'viralClipLength'

export const VIRAL_CLIP_LENGTHS = [15, 30, 60] as const

export type ViralClipLength = (typeof VIRAL_CLIP_LENGTHS)[number]

const ALLOWED = new Set<number>(VIRAL_CLIP_LENGTHS)

export function loadViralClipLength(
  storage: Pick<Storage, 'getItem'> = localStorage,
  fallback: ViralClipLength = 30,
): ViralClipLength {
  const raw = storage.getItem(VIRAL_CLIP_LENGTH_KEY)
  const parsed = raw === null ? NaN : Number(raw)
  if (ALLOWED.has(parsed)) {
    return parsed as ViralClipLength
  }
  return fallback
}

export function saveViralClipLength(
  value: ViralClipLength,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  storage.setItem(VIRAL_CLIP_LENGTH_KEY, String(value))
}
