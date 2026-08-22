export const RESOLUTION_OPTIONS = [
  { label: '4K (2160p)', value: '2160p', height: 2160 },
  { label: '2K (1440p)', value: '1440p', height: 1440 },
  { label: '1080p Full HD', value: '1080p', height: 1080 },
  { label: '720p HD', value: '720p', height: 720 },
  { label: '480p SD', value: '480p', height: 480 },
  { label: '360p', value: '360p', height: 360 },
] as const

export function resolutionsAtOrBelow(originalHeight: number) {
  return RESOLUTION_OPTIONS.filter((option) => option.height <= originalHeight)
}
