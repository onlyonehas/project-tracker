/**
 * Single integration test: app loads, shows tasks, and can create one.
 * API is mocked by MSW (see src/test/mocks/).
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads and shows tasks from API', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })
  })

  it('can create a new task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await waitFor(() => expect(screen.getByText('New Task')).toBeInTheDocument())

    await user.type(screen.getByLabelText(/title/i), 'My New Task')
    await user.click(screen.getByText('Add Task'))

    await waitFor(() => {
      expect(screen.getByText('My New Task')).toBeInTheDocument()
    })
  })
})
