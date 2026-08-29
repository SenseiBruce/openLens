import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProjectList } from '../ProjectList'
import { apiClient } from '../../api/client'
import type { ProjectSummary } from '../../types'

vi.mock('../../api/client', () => ({
  apiClient: {
    getProjects: vi.fn(),
    deleteProject: vi.fn(),
  },
}))

const projects: ProjectSummary[] = [
  { id: 'p1', name: 'One', status: 'ready', video_duration: 12, created_at: '2026-01-01T00:00:00Z' },
  { id: 'p2', name: 'Two', status: 'idle', video_duration: 5, created_at: '2026-01-02T00:00:00Z' },
]

describe('ProjectList', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(apiClient.getProjects).mockReset()
    vi.mocked(apiClient.deleteProject).mockReset()
    vi.mocked(apiClient.getProjects).mockResolvedValue(projects)
    vi.mocked(apiClient.deleteProject).mockResolvedValue(undefined)
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('fetchProjects loads the project list', async () => {
    render(<ProjectList onSelect={vi.fn()} onUpload={vi.fn()} isUploading={false} />)
    expect(await screen.findByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
    expect(apiClient.getProjects).toHaveBeenCalled()
  })

  it('handleDelete removes a project after confirm', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.getProjects)
      .mockResolvedValueOnce(projects)
      .mockResolvedValueOnce(projects.filter((p) => p.id !== 'p1'))

    render(<ProjectList onSelect={vi.fn()} onUpload={vi.fn()} isUploading={false} />)
    await screen.findByText('One')

    const deleteButtons = screen.getAllByTitle('Delete project')
    await user.click(deleteButtons[0])

    expect(window.confirm).toHaveBeenCalled()
    expect(apiClient.deleteProject).toHaveBeenCalledWith('p1')
    await waitFor(() => {
      expect(apiClient.getProjects).toHaveBeenCalledTimes(2)
    })
  })

  it('filters projects by name search', async () => {
    const user = userEvent.setup()
    render(<ProjectList onSelect={vi.fn()} onUpload={vi.fn()} isUploading={false} />)
    await screen.findByText('One')

    await user.type(screen.getByLabelText('Search projects'), 'One')
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.queryByText('Two')).not.toBeInTheDocument()
  })

  it('filters projects by status and can clear filters', async () => {
    const user = userEvent.setup()
    render(<ProjectList onSelect={vi.fn()} onUpload={vi.fn()} isUploading={false} />)
    await screen.findByText('One')

    await user.selectOptions(screen.getByLabelText('Filter by status'), 'idle')
    expect(screen.queryByText('One')).not.toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Filter by status'), 'exporting')
    expect(screen.getByText('No projects match your filters')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
  })

  it('handleMassDelete deletes selected projects', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.getProjects)
      .mockResolvedValueOnce(projects)
      .mockResolvedValueOnce([])

    render(<ProjectList onSelect={vi.fn()} onUpload={vi.fn()} isUploading={false} />)
    await screen.findByText('One')

    await user.click(screen.getByRole('button', { name: 'Select' }))
    await user.click(screen.getByText('One'))
    await user.click(screen.getByRole('button', { name: /Delete \(1\)/ }))

    expect(window.confirm).toHaveBeenCalled()
    expect(apiClient.deleteProject).toHaveBeenCalledWith('p1')
    expect(apiClient.deleteProject).not.toHaveBeenCalledWith('p2')
  })

  it('restores search and status filters from localStorage', async () => {
    localStorage.setItem(
      'voicecut_projectListFilters',
      JSON.stringify({ query: 'Two', status: 'idle' }),
    )
    render(<ProjectList onSelect={vi.fn()} onUpload={vi.fn()} isUploading={false} />)
    await screen.findByText('Two')
    expect(screen.queryByText('One')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Search projects')).toHaveValue('Two')
    expect(screen.getByLabelText('Filter by status')).toHaveValue('idle')
  })

  it('copies source duration without selecting the card', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(<ProjectList onSelect={onSelect} onUpload={vi.fn()} isUploading={false} />)
    await screen.findByText('One')

    await user.click(screen.getByRole('button', { name: 'Copy source duration for One' }))
    expect(writeText).toHaveBeenCalledWith('Source duration: 0:12')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('copies project status without selecting the card', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(<ProjectList onSelect={onSelect} onUpload={vi.fn()} isUploading={false} />)
    await screen.findByText('One')

    await user.click(screen.getByRole('button', { name: 'Copy project status for One' }))
    expect(writeText).toHaveBeenCalledWith('Project status: ready')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('copies the visible project status filter', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(<ProjectList onSelect={vi.fn()} onUpload={vi.fn()} isUploading={false} />)
    await screen.findByText('One')
    await user.selectOptions(screen.getByLabelText('Filter by status'), 'idle')
    await user.click(screen.getByRole('button', { name: 'Copy project status filter' }))
    expect(writeText).toHaveBeenCalledWith('Project status filter: idle')
  })
})
