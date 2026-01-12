import { BadRequestError } from './errors'

export function parseId(raw: string, fieldName = 'id'): number {
  const value = Number(raw)
  if (!Number.isInteger(value) || value <= 0) {
    throw new BadRequestError(`${fieldName} must be a positive integer`)
  }
  return value
}

