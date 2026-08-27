import { describe, expect, it } from 'vitest'
import { formatProjectIdentity } from '../projectIdentity'

describe('formatProjectIdentity', () => {
  it('formats name and id on separate lines', () => {
    expect(formatProjectIdentity({ id: 'p1', name: 'Demo' })).toBe('Demo\nid: p1')
  })

  it('falls back when the name is blank', () => {
    expect(formatProjectIdentity({ id: 'abc', name: '  ' })).toBe('Untitled project\nid: abc')
  })
})
