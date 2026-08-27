export function formatViralClipLength(seconds: number | null | undefined): string {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds <= 0) {
    return 'Viral clip length: unknown';
  }
  return `Viral clip length: ${seconds}s`;
}
