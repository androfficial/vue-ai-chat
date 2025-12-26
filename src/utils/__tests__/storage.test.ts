import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearAllStorage,
  formatStorageSize,
  getStorageItem,
  getStorageSize,
  removeStorageItem,
  setStorageItem,
  STORAGE_KEYS,
} from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('STORAGE_KEYS', () => {
    it('should have correct key values', () => {
      expect(STORAGE_KEYS.API_CONFIG).toBe('ai-chat:api-config');
      expect(STORAGE_KEYS.CHATS).toBe('ai-chat:chats');
      expect(STORAGE_KEYS.USER_PREFERENCES).toBe('ai-chat:preferences');
    });
  });

  describe('getStorageItem', () => {
    it('should return parsed JSON from localStorage', () => {
      const testData = { name: 'test', value: 123 };
      localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify(testData));

      const result = getStorageItem(STORAGE_KEYS.API_CONFIG);
      expect(result).toEqual(testData);
    });

    it('should return null for non-existent key', () => {
      const result = getStorageItem(STORAGE_KEYS.CHATS);
      expect(result).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      // Directly set invalid JSON to test error handling
      localStorage.setItem(STORAGE_KEYS.API_CONFIG, 'invalid json {');
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getStorageItem(STORAGE_KEYS.API_CONFIG);
      expect(result).toBeNull();
    });
  });

  describe('setStorageItem', () => {
    it('should save JSON to localStorage', () => {
      const testData = { name: 'test', value: 456 };
      const result = setStorageItem(STORAGE_KEYS.API_CONFIG, testData);

      expect(result).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.API_CONFIG)).toBe(JSON.stringify(testData));
    });

    it('should return true for valid data', () => {
      const result = setStorageItem(STORAGE_KEYS.CHATS, [{ id: '1' }]);
      expect(result).toBe(true);
    });
  });

  describe('removeStorageItem', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.API_CONFIG, 'test');
      expect(localStorage.getItem(STORAGE_KEYS.API_CONFIG)).toBe('test');

      removeStorageItem(STORAGE_KEYS.API_CONFIG);
      expect(localStorage.getItem(STORAGE_KEYS.API_CONFIG)).toBeNull();
    });

    it('should not throw when item does not exist', () => {
      expect(() => removeStorageItem(STORAGE_KEYS.CHATS)).not.toThrow();
    });
  });

  describe('clearAllStorage', () => {
    it('should remove all storage keys', () => {
      setStorageItem(STORAGE_KEYS.API_CONFIG, { key: 'value' });
      setStorageItem(STORAGE_KEYS.CHATS, []);
      setStorageItem(STORAGE_KEYS.USER_PREFERENCES, { theme: 'dark' });

      expect(localStorage.getItem(STORAGE_KEYS.API_CONFIG)).not.toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.CHATS)).not.toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)).not.toBeNull();

      clearAllStorage();

      expect(localStorage.getItem(STORAGE_KEYS.API_CONFIG)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.CHATS)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)).toBeNull();
    });
  });

  describe('getStorageSize', () => {
    it('should calculate total storage size', () => {
      const data = 'a'.repeat(50);
      localStorage.setItem(STORAGE_KEYS.API_CONFIG, data);

      const size = getStorageSize();
      // Size is calculated as string length * 2 (for UTF-16)
      expect(size).toBe(100);
    });

    it('should return 0 for empty storage', () => {
      expect(getStorageSize()).toBe(0);
    });

    it('should sum sizes of all keys', () => {
      localStorage.setItem(STORAGE_KEYS.API_CONFIG, 'a'.repeat(10));
      localStorage.setItem(STORAGE_KEYS.CHATS, 'b'.repeat(20));

      const size = getStorageSize();
      expect(size).toBe(60); // (10 + 20) * 2
    });
  });

  describe('formatStorageSize', () => {
    it('should format bytes', () => {
      expect(formatStorageSize(500)).toBe('500 B');
      expect(formatStorageSize(0)).toBe('0 B');
    });

    it('should format kilobytes', () => {
      expect(formatStorageSize(1024)).toBe('1.0 KB');
      expect(formatStorageSize(2560)).toBe('2.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatStorageSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatStorageSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
    });
  });
});
