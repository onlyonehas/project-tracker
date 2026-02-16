const TITLE_MAX_LENGTH = 500
const VALID_STATUSES = ['pending', 'in-progress', 'completed'] as const

export type ValidationResult = { valid: true } | { valid: false; error: string; statusCode: number }

export function validateTitle(title: unknown): ValidationResult {
  if (title === undefined || title === null) {
    return { valid: false, error: 'Title is required', statusCode: 400 }
  }
  if (typeof title !== 'string') {
    return { valid: false, error: 'Title must be a string', statusCode: 400 }
  }
  const trimmed = title.trim()
  if (trimmed.length === 0) {
    return { valid: false, error: 'Title cannot be empty', statusCode: 400 }
  }
  if (trimmed.length > TITLE_MAX_LENGTH) {
    return { valid: false, error: `Title must be at most ${TITLE_MAX_LENGTH} characters`, statusCode: 400 }
  }
  return { valid: true }
}

export function validateStatus(status: unknown): ValidationResult {
  if (status === undefined || status === null) return { valid: true }
  if (typeof status !== 'string' || !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return {
      valid: false,
      error: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      statusCode: 400
    }
  }
  return { valid: true }
}

export function validateDueDate(dueDate: unknown): ValidationResult {
  if (dueDate === undefined || dueDate === null || dueDate === '') return { valid: true }
  if (typeof dueDate !== 'string') {
    return { valid: false, error: 'Due date must be a string (ISO date or datetime)', statusCode: 400 }
  }
  const trimmed = dueDate.trim()
  if (trimmed.length === 0) return { valid: true }
  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) {
    return { valid: false, error: 'Due date must be a valid date', statusCode: 400 }
  }
  return { valid: true }
}

export function sanitiseString(value: unknown, defaultVal = ''): string {
  if (value === undefined || value === null) return defaultVal
  if (typeof value !== 'string') return defaultVal
  return value.trim()
}
