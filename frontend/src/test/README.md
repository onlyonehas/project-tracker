# Testing Guide

This project uses **Vitest** for unit and integration tests, along with **React Testing Library** for component testing.

## Test Structure

- **Unit Tests**: Test individual hooks, utilities, and services
  - `hooks/__tests__/` - Hook tests
  - `services/__tests__/` - API service tests
  - `components/__tests__/` - Component tests

- **Integration Tests**: Test full user flows and API interactions
  - `__tests__/` - App-level integration tests
  - Uses MSW (Mock Service Worker) for API mocking

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Run with UI
npm run test:ui

# Run with coverage report
npm run test:coverage

# Run only integration tests
npm run test:integration

# Run all tests (unit + integration)
npm run test:all
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTheme } from '../useTheme'

describe('useTheme', () => {
  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme())
    // ... test implementation
  })
})
```

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '../Header'

describe('Header', () => {
  it('should render title', () => {
    render(<Header theme="light" onToggleTheme={vi.fn()} />)
    expect(screen.getByText('Project Tracker')).toBeInTheDocument()
  })
})
```

### Integration Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App Integration', () => {
  it('should create a new task', async () => {
    const user = userEvent.setup()
    render(<App />)
    // ... test full user flow
  })
})
```

## Mocking

API calls are mocked using **MSW (Mock Service Worker)**. Mock handlers are defined in `test/mocks/handlers.ts`.

## Best Practices

1. **Test behavior, not implementation** - Focus on what users see and do
2. **Use data-testid sparingly** - Prefer accessible queries (getByRole, getByLabelText)
3. **Wait for async operations** - Use `waitFor` for async updates
4. **Clean up** - Tests automatically clean up after each run
5. **Mock external dependencies** - Use MSW for API calls
