export function formatChapterModel(name: string | null | undefined): string {
  const cleaned = typeof name === 'string' ? name.trim() : ''
  if (!cleaned) {
    return 'Chapter model: unset'
  }
  return `Chapter model: ${cleaned}`
}
