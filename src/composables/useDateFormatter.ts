/**
 * Date formatter composable
 * Provides localized date formatting with i18n support
 *
 * @example
 * const { formatDateGroup, formatTimeDiff } = useDateFormatter()
 */

import type { SupportedLocale } from '@/types'
import type { DateGroupResult, TimeDiffResult } from '@/utils/date'
import type { ComputedRef } from 'vue'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUserStore } from '@/stores/user'
import { getDateGroup as utilGetDateGroup, getTimeDiff as utilGetTimeDiff } from '@/utils/date'

export interface UseDateFormatterReturn {
  /** Formats a date group result to translated string */
  formatDateGroup: (result: DateGroupResult) => string
  /** Formats a time diff result to translated string */
  formatTimeDiff: (result: TimeDiffResult) => string
  /** Gets formatted date group for a timestamp */
  getDateGroupFormatted: (timestamp: number) => string
  /** Gets formatted time diff for a timestamp */
  getTimeDiffFormatted: (timestamp: number) => string
  /** Current locale */
  locale: ComputedRef<SupportedLocale>
}

/**
 * Creates date formatting functionality with i18n support
 */
export function useDateFormatter(): UseDateFormatterReturn {
  const { t } = useI18n()
  const userStore = useUserStore()

  const locale = computed(() => userStore.locale)

  /**
   * Formats date group result to translated string
   */
  function formatDateGroup(result: DateGroupResult): string {
    switch (result.type) {
      case 'today':
        return t('sidebar.today')
      case 'yesterday':
        return t('sidebar.yesterday')
      case 'thisWeek':
        return t('sidebar.thisWeek')
      case 'lastWeek':
        return t('sidebar.lastWeek')
      case 'twoWeeksAgo':
        return t('sidebar.twoWeeksAgo')
      case 'threeWeeksAgo':
        return t('sidebar.threeWeeksAgo')
      case 'thisMonth':
        return t('sidebar.thisMonth')
      case 'lastMonth':
        return t('sidebar.lastMonth')
      case 'older':
        return result.value
    }
  }

  /**
   * Formats time difference result to translated string
   */
  function formatTimeDiff(result: TimeDiffResult): string {
    switch (result.type) {
      case 'justNow':
        return t('time.justNow')
      case 'minutes':
        return t('time.minutesAgo', { n: result.value }, result.value)
      case 'hours':
        return t('time.hoursAgo', { n: result.value }, result.value)
      case 'days':
        return t('time.daysAgo', { n: result.value }, result.value)
      case 'date':
        return result.value
    }
  }

  /**
   * Gets formatted date group string for a timestamp
   */
  function getDateGroupFormatted(timestamp: number): string {
    const group = utilGetDateGroup(timestamp, locale.value)
    return formatDateGroup(group)
  }

  /**
   * Gets formatted time diff string for a timestamp
   */
  function getTimeDiffFormatted(timestamp: number): string {
    const diff = utilGetTimeDiff(timestamp, locale.value)
    return formatTimeDiff(diff)
  }

  return {
    formatDateGroup,
    formatTimeDiff,
    getDateGroupFormatted,
    getTimeDiffFormatted,
    locale,
  }
}
