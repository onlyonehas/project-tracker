import { describe, it, expect } from 'vitest'
import {
  validateTitle,
  validateStatus,
  validateDueDate,
  sanitiseString
} from '../src/validation'

describe('validateTitle', () => {
  it('rejects undefined', () => {
    expect(validateTitle(undefined)).toEqual({
      valid: false,
      error: 'Title is required',
      statusCode: 400
    })
  })

  it('rejects null', () => {
    expect(validateTitle(null)).toEqual({
      valid: false,
      error: 'Title is required',
      statusCode: 400
    })
  })

  it('rejects non-string', () => {
    expect(validateTitle(123)).toEqual({
      valid: false,
      error: 'Title must be a string',
      statusCode: 400
    })
  })

  it('rejects empty string', () => {
    expect(validateTitle('')).toEqual({
      valid: false,
      error: 'Title cannot be empty',
      statusCode: 400
    })
  })

  it('rejects whitespace-only', () => {
    expect(validateTitle('   ')).toEqual({
      valid: false,
      error: 'Title cannot be empty',
      statusCode: 400
    })
  })

  it('accepts valid title', () => {
    expect(validateTitle('My Task')).toEqual({ valid: true })
  })

  it('accepts trimmed title', () => {
    expect(validateTitle('  My Task  ')).toEqual({ valid: true })
  })
})

describe('validateStatus', () => {
  it('accepts undefined', () => {
    expect(validateStatus(undefined)).toEqual({ valid: true })
  })

  it('accepts valid statuses', () => {
    expect(validateStatus('pending')).toEqual({ valid: true })
    expect(validateStatus('in-progress')).toEqual({ valid: true })
    expect(validateStatus('completed')).toEqual({ valid: true })
  })

  it('rejects invalid status', () => {
    expect(validateStatus('invalid')).toMatchObject({
      valid: false,
      statusCode: 400,
      error: expect.stringContaining('Status must be one of')
    })
  })
})

describe('validateDueDate', () => {
  it('accepts undefined and null', () => {
    expect(validateDueDate(undefined)).toEqual({ valid: true })
    expect(validateDueDate(null)).toEqual({ valid: true })
  })

  it('accepts valid ISO date', () => {
    expect(validateDueDate('2026-02-20')).toEqual({ valid: true })
  })

  it('rejects invalid date', () => {
    expect(validateDueDate('not-a-date')).toMatchObject({
      valid: false,
      statusCode: 400
    })
  })
})

describe('sanitiseString', () => {
  it('returns default for undefined/null', () => {
    expect(sanitiseString(undefined)).toBe('')
    expect(sanitiseString(null, 'x')).toBe('x')
  })

  it('trims strings', () => {
    expect(sanitiseString('  hi  ')).toBe('hi')
  })
})
