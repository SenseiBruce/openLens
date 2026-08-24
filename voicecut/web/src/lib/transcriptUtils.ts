export type TranscriptCue = {
  start: number
  end: number
  text: string
}

export type TimedWord = {
  word: string
  start: number
  end: number
}

export function formatSrtTimestamp(seconds: number): string {
  const totalMs = Math.max(0, Math.round(seconds * 1000))
  const hours = Math.floor(totalMs / 3_600_000)
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000)
  const secs = Math.floor((totalMs % 60_000) / 1000)
  const ms = totalMs % 1000
  const pad = (n: number, width = 2) => String(n).padStart(width, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(ms, 3)}`
}

export function cuesFromTranscript(
  segments: TranscriptCue[],
  words: TimedWord[],
): TranscriptCue[] {
  if (segments.length > 0) {
    return segments.map((seg) => ({
      start: seg.start,
      end: seg.end,
      text: seg.text.trim(),
    }))
  }

  const cues: TranscriptCue[] = []
  const chunkSize = 8
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize)
    cues.push({
      start: chunk[0].start,
      end: chunk[chunk.length - 1].end,
      text: chunk.map((w) => w.word).join(' ').trim(),
    })
  }
  return cues.filter((cue) => cue.text.length > 0)
}

export function buildSrt(cues: TranscriptCue[]): string {
  return cues
    .map(
      (cue, index) =>
        `${index + 1}\n${formatSrtTimestamp(cue.start)} --> ${formatSrtTimestamp(cue.end)}\n${cue.text}\n`,
    )
    .join('\n')
}

export function buildPlainText(segments: TranscriptCue[], words: TimedWord[]): string {
  if (segments.length > 0) {
    return segments
      .map((seg) => seg.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return words
    .map((w) => w.word)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function wordMatchesQuery(word: string, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return false
  return word.toLowerCase().includes(q)
}

export function downloadTextFile(filename: string, content: string, mime = 'text/plain'): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
