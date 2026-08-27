export function formatOriginalResolution(height: number | null | undefined): string {
  if (typeof height !== 'number' || !Number.isFinite(height) || height <= 0) {
    return 'Original resolution: unknown'
  }
  return `Original resolution: ${height}p`
}
