/**
 * Array of all valid API error codes (single source of truth)
 */
export const API_ERROR_CODES = [
  'networkError',
  'rateLimited',
  'serverError',
  'unauthorized',
  'unknown',
] as const

/**
 * API error codes for handling different error scenarios
 */
export type ApiErrorCode = (typeof API_ERROR_CODES)[number]

/**
 * Type guard to check if a string is a valid ApiErrorCode
 */
export function isApiErrorCode(value: string): value is ApiErrorCode {
  return API_ERROR_CODES.includes(value as ApiErrorCode)
}

/**
 * Map HTTP status code to API error code
 */
export function getErrorCodeFromStatus(status: number): ApiErrorCode {
  if (status === 401 || status === 403) return 'unauthorized'
  if (status === 429) return 'rateLimited'
  if (status >= 500) return 'serverError'
  return 'unknown'
}

/**
 * Determine error code from error object or status
 */
export function getErrorCode(error: unknown, status?: number): ApiErrorCode {
  if (status) {
    return getErrorCodeFromStatus(status)
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection')) {
      return 'networkError'
    }
    if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('invalid api key')) {
      return 'unauthorized'
    }
    if (msg.includes('429') || msg.includes('rate limit') || msg.includes('too many')) {
      return 'rateLimited'
    }
    if (
      msg.includes('500') ||
      msg.includes('502') ||
      msg.includes('503') ||
      msg.includes('server')
    ) {
      return 'serverError'
    }
  }

  return 'unknown'
}
