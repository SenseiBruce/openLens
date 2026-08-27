export const SKIP_CUTS_KEY = 'voicecut_skipCuts';

export function loadSkipCuts(storage: Pick<Storage, 'getItem'> = localStorage): boolean {
  try {
    const raw = storage.getItem(SKIP_CUTS_KEY);
    if (raw === 'false') return false;
    if (raw === 'true') return true;
  } catch {
    /* storage unavailable */
  }
  return true;
}

export function saveSkipCuts(
  skip: boolean,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  try {
    storage.setItem(SKIP_CUTS_KEY, skip ? 'true' : 'false');
  } catch {
    /* storage unavailable */
  }
}
