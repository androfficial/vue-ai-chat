/**
 * Vue I18n plugin configuration
 * Provides internationalization support with English and Ukrainian locales
 */

import { createI18n } from 'vue-i18n'

import { en, uk } from '@/locales'
import { getStorageItem, STORAGE_KEYS } from '@/utils/storage'

/**
 * Determines the initial locale based on stored preference or browser settings
 */
function getInitialLocale(): 'en' | 'uk' {
  // Check localStorage for saved preference
  const stored = getStorageItem<{ locale?: string }>(STORAGE_KEYS.USER_PREFERENCES)
  if (stored?.locale === 'en' || stored?.locale === 'uk') {
    return stored.locale
  }

  // Fall back to browser language
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('uk')) {
    return 'uk'
  }

  return 'en'
}

/**
 * Create and configure i18n instance
 */
export const i18n = createI18n({
  fallbackLocale: 'en',
  globalInjection: true,
  legacy: false,
  locale: getInitialLocale(),
  messages: {
    en,
    uk,
  },
})

/**
 * Helper to change locale globally
 */
export function setGlobalLocale(locale: 'en' | 'uk') {
  i18n.global.locale.value = locale
}

export default i18n
