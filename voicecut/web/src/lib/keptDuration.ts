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
