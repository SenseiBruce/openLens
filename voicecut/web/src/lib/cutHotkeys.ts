export type CutLike = {
  id: string
  start: number
  end: number
  status: string
}

export function cutAtPlayhead(cuts: CutLike[], currentTime: number): CutLike | undefined {
  const containing = cuts.find((c) => currentTime >= c.start && currentTime < c.end)
  if (containing) return containing
  return [...cuts]
    .filter((c) => c.start >= currentTime)
    .sort((a, b) => a.start - b.start)[0]
}

export function previousCut(cuts: CutLike[], currentTime: number): CutLike | undefined {
  return [...cuts]
    .filter((c) => c.end <= currentTime + 0.02)
    .sort((a, b) => b.start - a.start)[0]
}

export function nextCut(cuts: CutLike[], currentTime: number): CutLike | undefined {
  return [...cuts]
    .filter((c) => c.start > currentTime + 0.05)
    .sort((a, b) => a.start - b.start)[0]
}

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}
