import { describe, expect, it } from 'vitest'
import { computeKeptDuration, formatKeptDurationSummary } from '../keptDuration'
import { computeKeptDuration, formatDurationPill } from '../keptDuration'

describe('computeKeptDuration', () => {
  it('returns zeros without a project or duration', () => {
    expect(computeKeptDuration(null)).toEqual({ totalDur: 0, keptDur: 0, removedDur: 0 })
  })

  it('subtracts cuts, honoring user decisions', () => {
    expect(
      computeKeptDuration({
        video_duration: 10,
        candidate_cuts: [
          { id: 'c1', start: 2, end: 5, status: 'cut' },
          { id: 'c2', start: 8, end: 9, status: 'cut' },
        ],
        user_decisions: [{ cut_id: 'c2', action: 'kept' }],
      }),
    ).toEqual({ totalDur: 10, keptDur: 7, removedDur: 3 })
  })
})

describe('formatKeptDurationSummary', () => {
  it('includes kept, total, and removed when cuts exist', () => {
    expect(
      formatKeptDurationSummary({ totalDur: 10, keptDur: 7, removedDur: 3 }),
    ).toBe('Kept 0:07 / 0:10\nRemoved 0:03')
describe('formatDurationPill', () => {
  it('formats kept, total, and removed time', () => {
    expect(
      formatDurationPill({
        video_duration: 10,
        candidate_cuts: [{ id: 'c1', start: 0, end: 3, status: 'cut' }],
      }),
    ).toBe('0:07 / 0:10 -0:03')
  })
})
