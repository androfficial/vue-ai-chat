/**
 * Validation utilities for form inputs and data
 */

/**
 * Validation constraints
 */
const MIN_API_KEY_LENGTH = 32
const API_KEY_PATTERN = /^[a-zA-Z0-9_-]+$/
const MAX_TEMPERATURE = 2
const MIN_TEMPERATURE = 0
const MAX_TOKENS_LIMIT = 32768

/**
 * Checks if a string is not empty (after trimming whitespace)
 *
 * @param value - String to validate
 * @returns true if string contains non-whitespace characters
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Validates an API key format
 * Must be at least 32 characters and contain only alphanumeric characters, underscores, and hyphens
 *
 * @param apiKey - API key to validate
 * @returns true if API key is valid
 */
export function isValidApiKey(apiKey: string): boolean {
  return apiKey.length >= MIN_API_KEY_LENGTH && API_KEY_PATTERN.test(apiKey)
}

/**
 * Checks if a number is within a specified range (inclusive)
 *
 * @param value - Number to validate
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns true if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Validates a temperature value for AI model parameters
 * Valid range: 0 to 2
 *
 * @param temperature - Temperature value to validate
 * @returns true if temperature is valid
 */
export function isValidTemperature(temperature: number): boolean {
  return isInRange(temperature, MIN_TEMPERATURE, MAX_TEMPERATURE)
}

/**
 * Validates a max tokens value for AI model parameters
 * Must be a positive integer up to 32768
 *
 * @param maxTokens - Max tokens value to validate
 * @returns true if max tokens is valid
 */
export function isValidMaxTokens(maxTokens: number): boolean {
  return Number.isInteger(maxTokens) && maxTokens > 0 && maxTokens <= MAX_TOKENS_LIMIT
}

/**
 * Validates a URL string
 *
 * @param url - URL string to validate
 * @returns true if URL is valid
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
 * Sanitizes a string by escaping HTML special characters
 * Prevents XSS attacks when rendering user input
 *
 * @param input - String to sanitize
 * @returns Sanitized string with escaped HTML entities
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Truncates a string to a maximum length with a suffix
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length including suffix
 * @param suffix - Suffix to append when truncating (default: '...')
 * @returns Truncated string or original if within limit
 */
export function truncateString(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) {
    return str
  }
  return str.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Extracts a preview from message content
 * Takes the first line and truncates if necessary
 *
 * @param content - Message content
 * @param maxLength - Maximum preview length (default: 50)
 * @returns Truncated first line of content
 */
export function extractMessagePreview(content: string, maxLength: number = 50): string {
  const lines = content.split('\n')
  const firstLine = lines[0]?.trim() ?? ''
  return truncateString(firstLine, maxLength)
}

/**
 * Generates a chat title from the first message
 * Removes markdown formatting and cleans up the text
 *
 * @param message - First message content
 * @param maxLength - Maximum title length (default: 30)
 * @returns Generated title suitable for display
 */
export function generateChatTitle(message: string, maxLength: number = 30): string {
  const cleaned = message
    .replace(/[#*`~_[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .trim()

  return truncateString(cleaned, maxLength)
}
