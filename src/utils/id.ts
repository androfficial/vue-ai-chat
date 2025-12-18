export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function generatePrefixedId(prefix: string): string {
  return `${prefix}_${generateId()}`
}
