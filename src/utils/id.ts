/**
 * Generates a unique identifier using crypto API
 * Falls back to timestamp-based ID if crypto is unavailable
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback for older browsers
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Generates a short unique identifier
 * Useful for temporary IDs or display purposes
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Generates a prefixed ID
 * @param prefix - Prefix to add to the ID (e.g., 'chat', 'msg')
 */
export function generatePrefixedId(prefix: string): string {
  return `${prefix}_${generateId()}`
}
