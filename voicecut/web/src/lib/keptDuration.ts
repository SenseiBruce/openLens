export type DurationProject = {
  video_duration?: number
  candidate_cuts: { id: string; start: number; end: number; status: string }[]
  user_decisions?: { cut_id: string; action: string }[]
} | null

export function computeKeptDuration(project: DurationProject): {
  totalDur: number
  keptDur: number
  removedDur: number
} {
  const total = project?.video_duration ?? 0
  if (!project || !total) return { totalDur: 0, keptDur: 0, removedDur: 0 }

  const decisionsMap = new Map((project.user_decisions || []).map((d) => [d.cut_id, d.action]))
  const cutDur = project.candidate_cuts.reduce((acc, cut) => {
    const status = decisionsMap.get(cut.id) ?? cut.status
    return status === 'cut' ? acc + (cut.end - cut.start) : acc
  }, 0)

  return {
    totalDur: total,
    keptDur: Math.max(0, total - cutDur),
    removedDur: cutDur,
  }
}

export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function formatKeptDurationSummary(dur: {
  totalDur: number
  keptDur: number
  removedDur: number
}): string {
  const lines = [`Kept ${formatClock(dur.keptDur)} / ${formatClock(dur.totalDur)}`]
  if (dur.removedDur > 0.5) {
    lines.push(`Removed ${formatClock(dur.removedDur)}`)
  }
  return lines.join('\n')
}
