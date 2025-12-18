export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0
}

export function isValidApiKey(apiKey: string): boolean {
  return apiKey.length >= 32 && /^[a-zA-Z0-9_-]+$/.test(apiKey)
}

export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

export function isValidTemperature(temperature: number): boolean {
  return isInRange(temperature, 0, 2)
}

export function isValidMaxTokens(maxTokens: number): boolean {
  return Number.isInteger(maxTokens) && maxTokens > 0 && maxTokens <= 32768
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export function truncateString(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) {
    return str
  }
  return str.substring(0, maxLength - suffix.length) + suffix
}

export function extractMessagePreview(content: string, maxLength: number = 50): string {
  const lines = content.split('\n')
  const firstLine = lines[0]?.trim() ?? ''
  return truncateString(firstLine, maxLength)
}

export function generateChatTitle(message: string, maxLength: number = 30): string {
  const cleaned = message
    .replace(/[#*`~_[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .trim()

  return truncateString(cleaned, maxLength)
}
