export type CutProject = {
  name?: string
  candidate_cuts: { id: string; status: string }[]
  user_decisions?: { cut_id: string; action: string }[]
} | null

export type CutCounts = {
  total: number
  pending: number
  cut: number
  kept: number
  ignored: number
}

export function countCutDecisions(project: CutProject): CutCounts {
  const empty: CutCounts = { total: 0, pending: 0, cut: 0, kept: 0, ignored: 0 }
  if (!project) return empty
  const decisions = new Map((project.user_decisions || []).map((d) => [d.cut_id, d.action]))
  const counts = { ...empty, total: project.candidate_cuts.length }
  for (const cut of project.candidate_cuts) {
    const status = decisions.get(cut.id) ?? cut.status
    if (status === 'cut') counts.cut += 1
    else if (status === 'kept') counts.kept += 1
    else if (status === 'ignored') counts.ignored += 1
    else counts.pending += 1
  }
  return counts
}

export function formatCutDecisionCounts(project: CutProject): string {
  const name = project?.name || 'untitled'
  const c = countCutDecisions(project)
  return [
    `VoiceCut — ${name}`,
    `Cuts: ${c.total} total | ${c.pending} pending | ${c.cut} cut | ${c.kept} kept | ${c.ignored} ignored`,
  ].join('\n')
}
