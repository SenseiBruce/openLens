import { describe, expect, it } from 'vitest'
import { countCutDecisions, formatCutDecisionCounts } from '../cutDecisionCounts'

describe('countCutDecisions', () => {
  it('returns zeros without a project', () => {
    expect(countCutDecisions(null)).toEqual({
      total: 0,
      pending: 0,
      cut: 0,
      kept: 0,
      ignored: 0,
    })
  })

  it('honors user_decisions over candidate status', () => {
    const counts = countCutDecisions({
      name: 'Demo',
      candidate_cuts: [
        { id: 'c1', status: 'pending' },
        { id: 'c2', status: 'cut' },
        { id: 'c3', status: 'kept' },
      ],
      user_decisions: [{ cut_id: 'c2', action: 'kept' }],
    })
    expect(counts).toEqual({ total: 3, pending: 1, cut: 0, kept: 2, ignored: 0 })
  })
})

describe('formatCutDecisionCounts', () => {
  it('includes project name and counts', () => {
    const text = formatCutDecisionCounts({
      name: 'Demo',
      candidate_cuts: [{ id: 'c1', status: 'cut' }],
    })
    expect(text).toContain('VoiceCut — Demo')
    expect(text).toContain('1 total')
    expect(text).toContain('1 cut')
  })
})
