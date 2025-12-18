/**
 * User preferences store
 * Manages user settings with localStorage persistence
 */

import type { SupportedLocale, ThemeMode } from '@/types'
import type { UserPreferences } from '@/types/user'

import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { setGlobalLocale } from '@/plugins/i18n'
import { DEFAULT_USER_PREFERENCES } from '@/types/user'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  // State
  const preferences = ref<UserPreferences>(loadPreferences())
  const activeChatId = ref<string | null>(null)

  // Load preferences from localStorage
  function loadPreferences(): UserPreferences {
    const stored = getStorageItem<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES)
    return stored ? { ...DEFAULT_USER_PREFERENCES, ...stored } : DEFAULT_USER_PREFERENCES
  }

  // Persist preferences to localStorage
  watch(
    preferences,
    newPreferences => {
      setStorageItem(STORAGE_KEYS.USER_PREFERENCES, newPreferences)
    },
    { deep: true },
  )

  // Getters
  const theme = computed(() => preferences.value.theme)
  const locale = computed(() => preferences.value.locale)
  const isDarkMode = computed(() => preferences.value.theme === 'dark')

  // Actions
  function setTheme(mode: ThemeMode) {
    preferences.value.theme = mode
  }

  function toggleTheme() {
    preferences.value.theme = preferences.value.theme === 'dark' ? 'light' : 'dark'
  }

  function setLocale(newLocale: SupportedLocale) {
    preferences.value.locale = newLocale
    // Update i18n locale directly
    setGlobalLocale(newLocale)
  }

  function updatePreferences(updates: Partial<UserPreferences>) {
    preferences.value = { ...preferences.value, ...updates }
  }

  function resetPreferences() {
    preferences.value = { ...DEFAULT_USER_PREFERENCES }
  }

  function setActiveChat(chatId: string | null) {
    activeChatId.value = chatId
  }

  return {
    // State
    activeChatId,
    // Getters
    isDarkMode,

    locale,
    preferences,
    // Actions
    resetPreferences,

    setActiveChat,
    setLocale,
    setTheme,
    theme,
    toggleTheme,
    updatePreferences,
  }
})
