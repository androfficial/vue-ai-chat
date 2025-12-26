import type { SupportedLocale } from '@/types';
import type { DateGroupResult, TimeDiffResult } from '@/utils/date';
import type { ComputedRef } from 'vue';

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserStore } from '@/stores/user';
import { getDateGroup as utilGetDateGroup, getTimeDiff as utilGetTimeDiff } from '@/utils/date';

export interface UseDateFormatterReturn {
  formatDateGroup: (result: DateGroupResult) => string;
  formatTimeDiff: (result: TimeDiffResult) => string;
  getDateGroupFormatted: (timestamp: number) => string;
  getTimeDiffFormatted: (timestamp: number) => string;
  locale: ComputedRef<SupportedLocale>;
}

export function useDateFormatter(): UseDateFormatterReturn {
  const { t } = useI18n();
  const userStore = useUserStore();

  const locale = computed(() => userStore.locale);

  function formatDateGroup(result: DateGroupResult): string {
    switch (result.type) {
      case 'today':
        return t('sidebar.today');
      case 'yesterday':
        return t('sidebar.yesterday');
      case 'thisWeek':
        return t('sidebar.thisWeek');
      case 'lastWeek':
        return t('sidebar.lastWeek');
      case 'twoWeeksAgo':
        return t('sidebar.twoWeeksAgo');
      case 'threeWeeksAgo':
        return t('sidebar.threeWeeksAgo');
      case 'thisMonth':
        return t('sidebar.thisMonth');
      case 'lastMonth':
        return t('sidebar.lastMonth');
      case 'older':
        return result.value;
    }
  }

  function formatTimeDiff(result: TimeDiffResult): string {
    switch (result.type) {
      case 'justNow':
        return t('time.justNow');
      case 'minutes':
        return t('time.minutesAgo', { n: result.value }, result.value);
      case 'hours':
        return t('time.hoursAgo', { n: result.value }, result.value);
      case 'days':
        return t('time.daysAgo', { n: result.value }, result.value);
      case 'date':
        return result.value;
    }
  }

  function getDateGroupFormatted(timestamp: number): string {
    const group = utilGetDateGroup(timestamp, locale.value);
    return formatDateGroup(group);
  }

  function getTimeDiffFormatted(timestamp: number): string {
    const diff = utilGetTimeDiff(timestamp, locale.value);
    return formatTimeDiff(diff);
  }

  return {
    formatDateGroup,
    formatTimeDiff,
    getDateGroupFormatted,
    getTimeDiffFormatted,
    locale,
  };
}
