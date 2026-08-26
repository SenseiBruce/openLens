export function formatMinGap(seconds: number | null | undefined): string {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds <= 0) {
    return 'Minimum silence gap: unknown';
  }
  return `Minimum silence gap: ${seconds.toFixed(1)}s`;
}
