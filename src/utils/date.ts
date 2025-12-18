/**
 * Returns current timestamp in milliseconds
 */
export function now(): number {
  return Date.now()
}

/**
 * Time difference result type
 */
export type TimeDiffResult =
  | { type: 'justNow' }
  | { type: 'minutes'; value: number }
  | { type: 'hours'; value: number }
  | { type: 'days'; value: number }
  | { type: 'date'; value: string }

/**
 * Gets time difference for display (returns structured data for i18n)
 * @param timestamp - Timestamp in milliseconds
 * @param locale - Locale for date formatting
 */
export function getTimeDiff(timestamp: number, locale: string = 'en'): TimeDiffResult {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // Less than 1 minute
  if (diff < 60 * 1000) {
    return { type: 'justNow' }
  }

  // Less than 1 hour
  if (diff < 60 * 60 * 1000) {
    return { type: 'minutes', value: Math.floor(diff / (60 * 1000)) }
  }

  // Less than 24 hours
  if (diff < 24 * 60 * 60 * 1000) {
    return { type: 'hours', value: Math.floor(diff / (60 * 60 * 1000)) }
  }

  // Less than 7 days
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return { type: 'days', value: Math.floor(diff / (24 * 60 * 60 * 1000)) }
  }

  // Default: full date
  return {
    type: 'date',
    value: date.toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    }),
  }
}

/**
 * Formats time for message display (HH:MM)
 * @param timestamp - Timestamp in milliseconds
 */
export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  })
}

/**
 * Formats full date and time
 * @param timestamp - Timestamp in milliseconds
 * @param locale - Locale for formatting
 */
export function formatFullDateTime(timestamp: number, locale: string = 'en'): string {
  const date = new Date(timestamp)
  return date.toLocaleString(locale === 'uk' ? 'uk-UA' : 'en-US', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Date group result type
 */
export type DateGroupResult =
  | { type: 'today' }
  | { type: 'yesterday' }
  | { type: 'thisWeek' }
  | { type: 'lastWeek' }
  | { type: 'twoWeeksAgo' }
  | { type: 'threeWeeksAgo' }
  | { type: 'thisMonth' }
  | { type: 'lastMonth' }
  | { type: 'older'; value: string }

/**
 * Groups dates by period for chat list (returns structured data for i18n)
 * @param timestamp - Timestamp in milliseconds
 * @param locale - Locale for date formatting
 */
export function getDateGroup(timestamp: number, locale: string = 'en'): DateGroupResult {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const daysDiff = Math.floor(diff / (24 * 60 * 60 * 1000))

  // Today
  if (daysDiff === 0) {
    return { type: 'today' }
  }

  // Yesterday
  if (daysDiff === 1) {
    return { type: 'yesterday' }
  }

  // This week (2-6 days ago)
  if (daysDiff < 7) {
    return { type: 'thisWeek' }
  }

  // Last week (7-13 days ago)
  if (daysDiff < 14) {
    return { type: 'lastWeek' }
  }

  // Two weeks ago (14-20 days ago)
  if (daysDiff < 21) {
    return { type: 'twoWeeksAgo' }
  }

  // Three weeks ago (21-27 days ago)
  if (daysDiff < 28) {
    return { type: 'threeWeeksAgo' }
  }

  // This month (28-30 days ago, same month)
  const isThisMonth = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  if (isThisMonth) {
    return { type: 'thisMonth' }
  }

  // Last month
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const isLastMonth =
    date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
  if (isLastMonth) {
    return { type: 'lastMonth' }
  }

  // Return month and year for older
  return {
    type: 'older',
    value: date.toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
      month: 'long',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    }),
  }
}
