/**
 * Time constants in milliseconds
 */
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MS_PER_WEEK = 7 * MS_PER_DAY;

/**
 * Day thresholds for date grouping
 */
const DAYS_IN_WEEK = 7;
const DAYS_IN_TWO_WEEKS = 14;
const DAYS_IN_THREE_WEEKS = 21;
const DAYS_IN_FOUR_WEEKS = 28;

/**
 * Returns the current timestamp in milliseconds
 */
export function now(): number {
  return Date.now();
}

/**
 * Discriminated union type for time difference results
 */
export type TimeDiffResult =
  | { type: 'justNow' }
  | { type: 'minutes'; value: number }
  | { type: 'hours'; value: number }
  | { type: 'days'; value: number }
  | { type: 'date'; value: string };

/**
 * Calculates the time difference between a timestamp and now
 * Returns a discriminated union with the appropriate time unit
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @param locale - Locale for date formatting ('en' or 'uk')
 * @returns TimeDiffResult with type and optional value
 */
export function getTimeDiff(timestamp: number, locale: string = 'en'): TimeDiffResult {
  const date = new Date(timestamp);
  const currentDate = new Date();
  const diff = currentDate.getTime() - date.getTime();

  // Less than 1 minute
  if (diff < MS_PER_MINUTE) {
    return { type: 'justNow' };
  }

  // Less than 1 hour
  if (diff < MS_PER_HOUR) {
    return { type: 'minutes', value: Math.floor(diff / MS_PER_MINUTE) };
  }

  // Less than 24 hours
  if (diff < MS_PER_DAY) {
    return { type: 'hours', value: Math.floor(diff / MS_PER_HOUR) };
  }

  // Less than 7 days
  if (diff < MS_PER_WEEK) {
    return { type: 'days', value: Math.floor(diff / MS_PER_DAY) };
  }

  // Default: full date
  return {
    type: 'date',
    value: date.toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== currentDate.getFullYear() ? 'numeric' : undefined,
    }),
  };
}

/**
 * Formats a timestamp to HH:MM time string
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted time string (24-hour format)
 */
export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
  });
}

/**
 * Formats a timestamp to a full date-time string
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @param locale - Locale for formatting ('en' or 'uk')
 * @returns Formatted date-time string
 */
export function formatFullDateTime(timestamp: number, locale: string = 'en'): string {
  const date = new Date(timestamp);
  return date.toLocaleString(locale === 'uk' ? 'uk-UA' : 'en-US', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export type DateGroupResult =
  | { type: 'today' }
  | { type: 'yesterday' }
  | { type: 'thisWeek' }
  | { type: 'lastWeek' }
  | { type: 'twoWeeksAgo' }
  | { type: 'threeWeeksAgo' }
  | { type: 'thisMonth' }
  | { type: 'lastMonth' }
  | { type: 'older'; value: string };

/**
 * Determines the date group category for a timestamp
 * Used for grouping chats in the sidebar by recency
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @param locale - Locale for date formatting ('en' or 'uk')
 * @returns DateGroupResult with the appropriate category
 */
export function getDateGroup(timestamp: number, locale: string = 'en'): DateGroupResult {
  const date = new Date(timestamp);
  const currentDate = new Date();
  const diff = currentDate.getTime() - date.getTime();
  const daysDiff = Math.floor(diff / MS_PER_DAY);

  // Today
  if (daysDiff === 0) {
    return { type: 'today' };
  }

  // Yesterday
  if (daysDiff === 1) {
    return { type: 'yesterday' };
  }

  // This week (2-6 days ago)
  if (daysDiff < DAYS_IN_WEEK) {
    return { type: 'thisWeek' };
  }

  // Last week (7-13 days ago)
  if (daysDiff < DAYS_IN_TWO_WEEKS) {
    return { type: 'lastWeek' };
  }

  // Two weeks ago (14-20 days ago)
  if (daysDiff < DAYS_IN_THREE_WEEKS) {
    return { type: 'twoWeeksAgo' };
  }

  // Three weeks ago (21-27 days ago)
  if (daysDiff < DAYS_IN_FOUR_WEEKS) {
    return { type: 'threeWeeksAgo' };
  }

  // This month (28-30 days ago, same month)
  const isThisMonth =
    date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  if (isThisMonth) {
    return { type: 'thisMonth' };
  }

  // Last month
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const isLastMonth =
    date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
  if (isLastMonth) {
    return { type: 'lastMonth' };
  }

  // Return month and year for older
  return {
    type: 'older',
    value: date.toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
      month: 'long',
      year: date.getFullYear() !== currentDate.getFullYear() ? 'numeric' : undefined,
    }),
  };
}
