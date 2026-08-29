export function formatKeptPercent(
  keptDur: number | null | undefined,
  totalDur: number | null | undefined,
): string {
  if (
    !Number.isFinite(keptDur) ||
    !Number.isFinite(totalDur) ||
    (totalDur as number) <= 0
  ) {
    return 'Kept percent: n/a'
  }
  const pct = ((keptDur as number) / (totalDur as number)) * 100
  return `Kept percent: ${pct.toFixed(0)}%`
}
