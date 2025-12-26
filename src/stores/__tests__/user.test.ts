import { flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_USER_PREFERENCES } from '@/types/user';

import { useUserStore } from '../user';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    clear: () => {
      store = {};
    },
    getItem: (key: string) => store[key] || null,
    removeItem: (key: string) => {
      delete store[key];
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock setGlobalLocale
vi.mock('@/plugins/i18n', () => ({
  setGlobalLocale: vi.fn(),
}));

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('state initialization', () => {
    it('should initialize with default preferences', () => {
      const store = useUserStore();

      expect(store.preferences.theme).toBe(DEFAULT_USER_PREFERENCES.theme);
      expect(store.preferences.locale).toBe(DEFAULT_USER_PREFERENCES.locale);
      expect(store.preferences.fontSize).toBe(DEFAULT_USER_PREFERENCES.fontSize);
      expect(store.preferences.sendOnEnter).toBe(DEFAULT_USER_PREFERENCES.sendOnEnter);
      expect(store.preferences.showTimestamps).toBe(DEFAULT_USER_PREFERENCES.showTimestamps);
      expect(store.preferences.markdownEnabled).toBe(DEFAULT_USER_PREFERENCES.markdownEnabled);
    });

    it('should have correct computed properties', () => {
      const store = useUserStore();

      expect(store.theme).toBe('dark');
      expect(store.locale).toBe('en');
      expect(store.isDarkMode).toBe(true);
    });
  });

  describe('setTheme', () => {
    it('should set theme to light', () => {
      const store = useUserStore();
      store.setTheme('light');

      expect(store.preferences.theme).toBe('light');
      expect(store.theme).toBe('light');
      expect(store.isDarkMode).toBe(false);
    });

    it('should set theme to system', () => {
      const store = useUserStore();
      store.setTheme('system');

      expect(store.preferences.theme).toBe('system');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from dark to light', () => {
      const store = useUserStore();
      // Ensure we start with dark theme
      store.setTheme('dark');
      expect(store.preferences.theme).toBe('dark');

      store.toggleTheme();
      expect(store.preferences.theme).toBe('light');
    });

    it('should toggle from light to dark', () => {
      const store = useUserStore();
      store.setTheme('light');

      store.toggleTheme();
      expect(store.preferences.theme).toBe('dark');
    });
  });

  describe('setLocale', () => {
    it('should set locale to uk', async () => {
      const { setGlobalLocale } = await import('@/plugins/i18n');
      const store = useUserStore();
      store.setLocale('uk');

      expect(store.preferences.locale).toBe('uk');
      expect(store.locale).toBe('uk');
      expect(setGlobalLocale).toHaveBeenCalledWith('uk');
    });

    it('should set locale to en', async () => {
      const { setGlobalLocale } = await import('@/plugins/i18n');
      const store = useUserStore();
      store.setLocale('uk');
      store.setLocale('en');

      expect(store.preferences.locale).toBe('en');
      expect(setGlobalLocale).toHaveBeenCalledWith('en');
    });
  });

  describe('updatePreferences', () => {
    it('should update single preference', () => {
      const store = useUserStore();
      store.updatePreferences({ sendOnEnter: false });

      expect(store.preferences.sendOnEnter).toBe(false);
    });

    it('should update multiple preferences', () => {
      const store = useUserStore();
      store.updatePreferences({
        fontSize: 'large',
        showTimestamps: true,
        soundEnabled: true,
      });

      expect(store.preferences.fontSize).toBe('large');
      expect(store.preferences.showTimestamps).toBe(true);
      expect(store.preferences.soundEnabled).toBe(true);
    });

    it('should preserve other preferences', () => {
      const store = useUserStore();
      store.setTheme('light');
      store.updatePreferences({ fontSize: 'small' });

      expect(store.preferences.theme).toBe('light');
      expect(store.preferences.fontSize).toBe('small');
    });
  });

  describe('resetPreferences', () => {
    it('should reset all preferences to defaults', () => {
      const store = useUserStore();
      store.setTheme('light');
      store.updatePreferences({
        fontSize: 'large',
        sendOnEnter: false,
        showTimestamps: true,
      });

      store.resetPreferences();

      expect(store.preferences.theme).toBe(DEFAULT_USER_PREFERENCES.theme);
      expect(store.preferences.fontSize).toBe(DEFAULT_USER_PREFERENCES.fontSize);
      expect(store.preferences.sendOnEnter).toBe(DEFAULT_USER_PREFERENCES.sendOnEnter);
      expect(store.preferences.showTimestamps).toBe(DEFAULT_USER_PREFERENCES.showTimestamps);
    });
  });

  describe('persistence', () => {
    it('should persist preferences to localStorage on change', async () => {
      const store = useUserStore();

      // Use updatePreferences which triggers the watch
      store.updatePreferences({ theme: 'light' });

      // Wait for Vue's deep watch to trigger
      await flushPromises();

      const stored = JSON.parse(localStorageMock.getItem('ai-chat:preferences') || '{}');
      expect(stored.theme).toBe('light');
    });

    it('should load preferences from localStorage on init', () => {
      localStorageMock.setItem(
        'ai-chat:preferences',
        JSON.stringify({
          fontSize: 'large',
          locale: 'uk',
          showTimestamps: true,
          theme: 'light',
        }),
      );

      // Create new store instance
      setActivePinia(createPinia());
      const store = useUserStore();

      expect(store.preferences.theme).toBe('light');
      expect(store.preferences.locale).toBe('uk');
      expect(store.preferences.fontSize).toBe('large');
      expect(store.preferences.showTimestamps).toBe(true);
    });

    it('should merge with defaults when loading partial preferences', () => {
      localStorageMock.setItem(
        'ai-chat:preferences',
        JSON.stringify({
          theme: 'light',
        }),
      );

      setActivePinia(createPinia());
      const store = useUserStore();

      expect(store.preferences.theme).toBe('light');
      // Should have defaults for other properties
      expect(store.preferences.fontSize).toBe(DEFAULT_USER_PREFERENCES.fontSize);
      expect(store.preferences.sendOnEnter).toBe(DEFAULT_USER_PREFERENCES.sendOnEnter);
    });
  });

  describe('sidebarCollapsed preference', () => {
    it('should update sidebarCollapsed', () => {
      const store = useUserStore();
      expect(store.preferences.sidebarCollapsed).toBe(false);

      store.updatePreferences({ sidebarCollapsed: true });
      expect(store.preferences.sidebarCollapsed).toBe(true);
    });
  });
});
