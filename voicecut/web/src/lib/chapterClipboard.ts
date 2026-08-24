export type ChapterStamp = {
  start: number
  title: string
}

export function formatYouTubeTimestamp(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`
  }
  return `${minutes}:${pad(secs)}`
}

export function formatChapterTimestamps(chapters: ChapterStamp[]): string {
  return chapters
    .map((chapter) => `${formatYouTubeTimestamp(chapter.start)} ${chapter.title}`.trim())
    .join('\n')
}
