import { describe, expect, it } from 'vitest'
import { computeKeptDuration } from '../keptDuration'

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
