/**
 * Validates if a string is not empty after trimming
 * @param value - String to validate
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Validates if a string is a valid API key format
 * @param apiKey - API key to validate
 */
export function isValidApiKey(apiKey: string): boolean {
  // Cerebras API keys typically start with specific prefixes
  // Minimum length check and basic format validation
  return apiKey.length >= 32 && /^[a-zA-Z0-9_-]+$/.test(apiKey)
}

/**
 * Validates if a value is within a numeric range
 * @param value - Value to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Validates temperature value (0-2)
 * @param temperature - Temperature to validate
 */
export function isValidTemperature(temperature: number): boolean {
  return isInRange(temperature, 0, 2)
}

/**
 * Validates max tokens value
 * @param maxTokens - Max tokens to validate
 */
export function isValidMaxTokens(maxTokens: number): boolean {
  return Number.isInteger(maxTokens) && maxTokens > 0 && maxTokens <= 32768
}

/**
 * Validates URL format
 * @param url - URL to validate
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitizes a string for safe display
 * @param input - String to sanitize
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Truncates a string to a maximum length
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 */
export function truncateString(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) {
    return str
  }
  return str.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Extracts the first line or sentence from a message for preview
 * @param content - Message content
 * @param maxLength - Maximum length (default: 50)
 */
export function extractMessagePreview(content: string, maxLength: number = 50): string {
  // Get first line
  const lines = content.split('\n')
  const firstLine = lines[0]?.trim() ?? ''

  // Truncate if needed
  return truncateString(firstLine, maxLength)
}

/**
 * Generates a chat title from the first message
 * @param message - First user message
 * @param maxLength - Maximum title length (default: 30)
 */
export function generateChatTitle(message: string, maxLength: number = 30): string {
  // Remove markdown formatting
  const cleaned = message
    .replace(/[#*`~_[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .trim()

  return truncateString(cleaned, maxLength)
}
