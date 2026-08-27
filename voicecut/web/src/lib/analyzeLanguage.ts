export function formatAnalyzeLanguage(language: string | null | undefined): string {
  const raw = (language || '').trim();
  if (!raw) {
    return 'Spoken language: Auto-detect';
  }
  const labels: Record<string, string> = {
    en: 'English',
    hi: 'Hindi',
    hinglish: 'Hinglish',
  };
  return `Spoken language: ${labels[raw] || raw}`;
}
