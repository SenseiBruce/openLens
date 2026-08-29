export const INITIAL_PROMPT_KEY = 'voicecut_initialPrompt'

export function parseInitialPrompt(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null
  }
  return value
}

export function loadInitialPrompt(
  storage: Pick<Storage, 'getItem'> = localStorage,
): string | null {
  try {
    return parseInitialPrompt(storage.getItem(INITIAL_PROMPT_KEY))
  } catch {
    return null
  }
}

export function saveInitialPrompt(
  prompt: string,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  try {
    storage.setItem(INITIAL_PROMPT_KEY, prompt)
  } catch {
    /* storage unavailable */
  }
}
