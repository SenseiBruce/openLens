import { describe, expect, it } from 'vitest'
import { cutAtPlayhead, nextCut, previousCut } from '../cutHotkeys'

const cuts = [
  { id: 'c1', start: 1, end: 2, status: 'pending' },
  { id: 'c2', start: 5, end: 7, status: 'cut' },
  { id: 'c3', start: 10, end: 11, status: 'kept' },
]

describe('cut hotkey helpers', () => {
  it('prefers the cut containing the playhead', () => {
    expect(cutAtPlayhead(cuts, 5.5)?.id).toBe('c2')
  })

  it('falls forward to the next cut when sitting in speech', () => {
    expect(cutAtPlayhead(cuts, 3)?.id).toBe('c2')
  })

  it('jumps to previous and next cuts', () => {
    expect(previousCut(cuts, 8)?.id).toBe('c2')
    expect(nextCut(cuts, 6)?.id).toBe('c3')
    expect(previousCut(cuts, 0.5)).toBeUndefined()
    expect(nextCut(cuts, 12)).toBeUndefined()
  })
})
