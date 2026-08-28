export const CHAPTER_MODEL_KEY = 'voicecut_chapterModel'

const DEFAULT_CHAPTER_MODEL = 'gemini/gemini-2.5-flash'

export function loadChapterModel(
  storage: Pick<Storage, 'getItem'> = localStorage,
): string {
  try {
    const raw = storage.getItem(CHAPTER_MODEL_KEY)
    const cleaned = typeof raw === 'string' ? raw.trim() : ''
    if (cleaned) return cleaned
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_CHAPTER_MODEL
}

export function saveChapterModel(
  name: string,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  const cleaned = name.trim()
  if (!cleaned) return
  try {
    storage.setItem(CHAPTER_MODEL_KEY, cleaned)
  } catch {
    /* storage unavailable */
  }
}
