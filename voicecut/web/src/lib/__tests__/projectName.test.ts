import { describe, expect, it } from 'vitest'
import { formatProjectName } from '../projectName'

describe('formatProjectName', () => {
  it('labels a project name', () => {
    expect(formatProjectName('  One  ')).toBe('Project name: One')
  })

  it('labels missing names as untitled', () => {
    expect(formatProjectName('')).toBe('Project name: untitled')
    expect(formatProjectName(undefined)).toBe('Project name: untitled')
  })
})
