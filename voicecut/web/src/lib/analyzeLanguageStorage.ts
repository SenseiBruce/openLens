export const ANALYZE_LANGUAGE_KEY = 'voicecut_analyzeLanguage'

export const ANALYZE_LANGUAGES = ['', 'en', 'hi', 'hinglish'] as const

export type StoredAnalyzeLanguage = (typeof ANALYZE_LANGUAGES)[number]

const ALLOWED = new Set<string>(ANALYZE_LANGUAGES)

export function parseAnalyzeLanguage(
  value: string | null | undefined,
): StoredAnalyzeLanguage | null {
  if (typeof value !== 'string') {
    return null
  }
  if (ALLOWED.has(value)) {
    return value as StoredAnalyzeLanguage
  }
  return null
}

export function loadAnalyzeLanguage(
  storage: Pick<Storage, 'getItem'> = localStorage,
): StoredAnalyzeLanguage | null {
  try {
    return parseAnalyzeLanguage(storage.getItem(ANALYZE_LANGUAGE_KEY))
  } catch {
    return null
  }
}

export function saveAnalyzeLanguage(
  language: string,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  const parsed = parseAnalyzeLanguage(language)
  if (parsed === null) {
    return
  }
  try {
    storage.setItem(ANALYZE_LANGUAGE_KEY, parsed)
  } catch {
    /* storage unavailable */
  }
}
