/**
 * User Preferences Store
 * Manages user settings including theme, locale, and display preferences
 * Persists preferences to localStorage
 *
 * @module stores/user
 */

import type { SupportedLocale, ThemeMode, UserPreferences } from '@/types';

import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import { setGlobalLocale } from '@/plugins/i18n';
import { DEFAULT_USER_PREFERENCES } from '@/types/user';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';

export const useUserStore = defineStore('user', () => {
  const preferences = ref<UserPreferences>(loadPreferences());

  function loadPreferences(): UserPreferences {
    const stored = getStorageItem<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES);
    return stored ? { ...DEFAULT_USER_PREFERENCES, ...stored } : DEFAULT_USER_PREFERENCES;
  }

  watch(
    preferences,
    newPreferences => {
      setStorageItem(STORAGE_KEYS.USER_PREFERENCES, newPreferences);
    },
    { deep: true },
  );

  const theme = computed(() => preferences.value.theme);
  const locale = computed(() => preferences.value.locale);
  const isDarkMode = computed(() => preferences.value.theme === 'dark');

  function setTheme(mode: ThemeMode) {
    preferences.value.theme = mode;
  }

  function toggleTheme() {
    preferences.value.theme = preferences.value.theme === 'dark' ? 'light' : 'dark';
  }

  function setLocale(newLocale: SupportedLocale) {
    preferences.value.locale = newLocale;
    setGlobalLocale(newLocale);
  }

  function updatePreferences(updates: Partial<UserPreferences>) {
    preferences.value = { ...preferences.value, ...updates };
  }

  function resetPreferences() {
    preferences.value = { ...DEFAULT_USER_PREFERENCES };
  }

  return {
    isDarkMode,
    locale,
    preferences,
    resetPreferences,
    setLocale,
    setTheme,
    theme,
    toggleTheme,
    updatePreferences,
  };
});
