/**
 * Theme management composable
 * Handles theme switching, system preference detection, and persistence
 */

import type { ThemeMode } from '@/types';

import { onMounted, onUnmounted, watch } from 'vue';
import { useTheme } from 'vuetify';

import { useUserStore } from '@/stores/user';

export interface UseThemeManagerReturn {
  /** Apply theme based on mode */
  applyTheme: (themeMode: ThemeMode) => void;
}

/**
 * Composable for managing application theme
 * Supports light, dark, and system (auto) modes
 */
export function useThemeManager(): UseThemeManagerReturn {
  const theme = useTheme();
  const userStore = useUserStore();

  let mediaQuery: MediaQueryList | null = null;
  let mediaQueryHandler: (() => void) | null = null;

  /**
   * Apply theme based on user preference
   * Uses Vuetify 3.9+ theme.change() API for proper theme switching
   */
  function applyTheme(themeMode: ThemeMode) {
    if (themeMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.change(prefersDark ? 'dark' : 'light');
    } else {
      theme.change(themeMode);
    }
  }

  /**
   * Handle system theme changes when in 'system' mode
   */
  function handleSystemThemeChange() {
    if (userStore.preferences.theme === 'system') {
      applyTheme('system');
    }
  }

  // Apply initial theme immediately (before mount to prevent flash)
  applyTheme(userStore.preferences.theme);

  // Setup system theme listener on mount
  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryHandler = handleSystemThemeChange;
    mediaQuery.addEventListener('change', mediaQueryHandler);
  });

  // Cleanup listener on unmount
  onUnmounted(() => {
    if (mediaQuery && mediaQueryHandler) {
      mediaQuery.removeEventListener('change', mediaQueryHandler);
    }
  });

  // Watch for theme preference changes
  watch(
    () => userStore.preferences.theme,
    newTheme => applyTheme(newTheme),
  );

  return { applyTheme };
}
