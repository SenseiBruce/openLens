export const WHISPER_MODEL_KEY = 'voicecut_whisperModel'

export const WHISPER_MODELS = [
  'tiny',
  'base',
  'small',
  'medium',
  'large-v2',
  'large-v3',
] as const

export type StoredWhisperModel = (typeof WHISPER_MODELS)[number]

const ALLOWED = new Set<string>(WHISPER_MODELS)

export function parseWhisperModel(
  value: string | null | undefined,
): StoredWhisperModel | null {
  if (typeof value !== 'string') {
    return null
  }
  if (ALLOWED.has(value)) {
    return value as StoredWhisperModel
  }
  return null
}

export function loadWhisperModel(
  storage: Pick<Storage, 'getItem'> = localStorage,
): StoredWhisperModel | null {
  try {
    return parseWhisperModel(storage.getItem(WHISPER_MODEL_KEY))
  } catch {
    return null
  }
}

export function saveWhisperModel(
  model: string,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  const parsed = parseWhisperModel(model)
  if (parsed === null) {
    return
  }
  try {
    storage.setItem(WHISPER_MODEL_KEY, parsed)
  } catch {
    /* storage unavailable */
  }
}
