export function formatSourceDuration(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds) || seconds <= 0) {
    return 'Source duration: unknown';
  }
  const m = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `Source duration: ${m}:${sec.toString().padStart(2, '0')}`;
}
