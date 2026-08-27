export function formatWhisperModel(model: string | null | undefined): string {
  const trimmed = model?.trim();
  if (!trimmed) {
    return 'Whisper model: unknown';
  }
  return `Whisper model: ${trimmed}`;
}
