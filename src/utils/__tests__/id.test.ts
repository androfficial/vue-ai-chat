import { beforeEach, describe, expect, it, vi } from 'vitest';

import { generateId, generatePrefixedId, generateShortId } from '../id';

describe('id', () => {
  describe('generateId', () => {
    beforeEach(() => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-uuid-1234-5678-9abc-def012345678');
    });

    it('should use crypto.randomUUID when available', () => {
      const id = generateId();
      expect(id).toBe('test-uuid-1234-5678-9abc-def012345678');
      expect(crypto.randomUUID).toHaveBeenCalled();
    });

    it('should generate fallback ID when crypto is not available', () => {
      vi.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        throw new Error('Not available');
      });

      // Test fallback by temporarily removing randomUUID
      const originalRandomUUID = crypto.randomUUID;
      Object.defineProperty(crypto, 'randomUUID', { value: undefined, writable: true });

      const id = generateId();
      expect(id).toMatch(/^\d+-[a-z0-9]+$/);

      // Restore
      Object.defineProperty(crypto, 'randomUUID', { value: originalRandomUUID, writable: true });
    });
  });

  describe('generateShortId', () => {
    it('should generate a short alphanumeric ID', () => {
      const id = generateShortId();
      expect(id).toMatch(/^[a-z0-9]+$/);
      expect(id.length).toBe(7);
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateShortId());
      }
      // Most should be unique (allowing for rare collisions)
      expect(ids.size).toBeGreaterThan(90);
    });
  });

  describe('generatePrefixedId', () => {
    beforeEach(() => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-uuid-1234-5678-9abc-def012345678');
    });

    it('should generate ID with prefix', () => {
      const id = generatePrefixedId('chat');
      expect(id).toBe('chat_test-uuid-1234-5678-9abc-def012345678');
    });

    it('should work with different prefixes', () => {
      expect(generatePrefixedId('msg')).toBe('msg_test-uuid-1234-5678-9abc-def012345678');
      expect(generatePrefixedId('user')).toBe('user_test-uuid-1234-5678-9abc-def012345678');
    });
  });
});
