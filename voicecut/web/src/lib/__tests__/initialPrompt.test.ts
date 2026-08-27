import { describe, expect, it } from 'vitest'
import { formatInitialPrompt } from '../initialPrompt'

describe('formatInitialPrompt', () => {
  it('labels a prompt', () => {
    expect(formatInitialPrompt('  names: Kinshuk  ')).toBe('Custom prompt: names: Kinshuk')
  })

  it('labels an empty prompt', () => {
    expect(formatInitialPrompt('')).toBe('Custom prompt: none')
    expect(formatInitialPrompt(undefined)).toBe('Custom prompt: none')
  })
})
