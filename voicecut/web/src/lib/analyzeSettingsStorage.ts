export const ANALYZE_SETTINGS_KEY = 'analyzeSettings'

export type AnalyzeSettings = {
  whisper_model: string
  min_gap_duration: number
  language?: string
  initial_prompt?: string
}

export function loadAnalyzeSettings(
  storage: Pick<Storage, 'getItem'> = localStorage,
): AnalyzeSettings | null {
  const raw = storage.getItem(ANALYZE_SETTINGS_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<AnalyzeSettings>
    if (!parsed || typeof parsed.whisper_model !== 'string') return null
    const minGap = Number(parsed.min_gap_duration)
    if (!Number.isFinite(minGap)) return null
    return {
      whisper_model: parsed.whisper_model,
      min_gap_duration: minGap,
      ...(parsed.language ? { language: String(parsed.language) } : {}),
      ...(parsed.initial_prompt ? { initial_prompt: String(parsed.initial_prompt) } : {}),
    }
  } catch {
    return null
  }
}

export function saveAnalyzeSettings(
  settings: AnalyzeSettings,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  storage.setItem(ANALYZE_SETTINGS_KEY, JSON.stringify(settings))
}
