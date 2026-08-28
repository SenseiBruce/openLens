export const TRANSCRIPT_SEARCH_KEY = 'voicecut_transcriptSearchQuery'

export function loadTranscriptSearchQuery(
  storage: Pick<Storage, 'getItem'> = localStorage,
): string {
  try {
    return storage.getItem(TRANSCRIPT_SEARCH_KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveTranscriptSearchQuery(
  query: string,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  try {
    storage.setItem(TRANSCRIPT_SEARCH_KEY, query)
  } catch {
    /* storage unavailable */
  }
}
