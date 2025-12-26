import { describe, expect, it } from 'vitest';

import {
  extractMessagePreview,
  generateChatTitle,
  isInRange,
  isNotEmpty,
  isValidApiKey,
  isValidMaxTokens,
  isValidTemperature,
  isValidUrl,
  sanitizeString,
  truncateString,
} from '../validation';

describe('validation', () => {
  describe('isNotEmpty', () => {
    it('should return true for non-empty strings', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty('  hello  ')).toBe(true);
      expect(isNotEmpty('a')).toBe(true);
    });

    it('should return false for empty strings', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
      expect(isNotEmpty('\n\t')).toBe(false);
    });
  });

  describe('isValidApiKey', () => {
    it('should return true for valid API keys', () => {
      expect(isValidApiKey('x'.repeat(32))).toBe(true);
      expect(isValidApiKey('abc123_XYZ-456'.repeat(3))).toBe(true);
      expect(isValidApiKey('test_key_' + 'x'.repeat(23))).toBe(true);
    });

    it('should return false for short API keys', () => {
      expect(isValidApiKey('short')).toBe(false);
      expect(isValidApiKey('a'.repeat(31))).toBe(false);
    });

    it('should return false for invalid characters', () => {
      expect(isValidApiKey('a'.repeat(31) + '@')).toBe(false);
      expect(isValidApiKey('a'.repeat(31) + ' ')).toBe(false);
      expect(isValidApiKey('a'.repeat(31) + '!')).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('should return true for values within range', () => {
      expect(isInRange(5, 0, 10)).toBe(true);
      expect(isInRange(0, 0, 10)).toBe(true);
      expect(isInRange(10, 0, 10)).toBe(true);
    });

    it('should return false for values outside range', () => {
      expect(isInRange(-1, 0, 10)).toBe(false);
      expect(isInRange(11, 0, 10)).toBe(false);
    });
  });

  describe('isValidTemperature', () => {
    it('should return true for valid temperatures', () => {
      expect(isValidTemperature(0)).toBe(true);
      expect(isValidTemperature(1)).toBe(true);
      expect(isValidTemperature(2)).toBe(true);
      expect(isValidTemperature(0.5)).toBe(true);
    });

    it('should return false for invalid temperatures', () => {
      expect(isValidTemperature(-0.1)).toBe(false);
      expect(isValidTemperature(2.1)).toBe(false);
      expect(isValidTemperature(-1)).toBe(false);
    });
  });

  describe('isValidMaxTokens', () => {
    it('should return true for valid max tokens', () => {
      expect(isValidMaxTokens(1)).toBe(true);
      expect(isValidMaxTokens(1000)).toBe(true);
      expect(isValidMaxTokens(32768)).toBe(true);
    });

    it('should return false for invalid max tokens', () => {
      expect(isValidMaxTokens(0)).toBe(false);
      expect(isValidMaxTokens(-1)).toBe(false);
      expect(isValidMaxTokens(32769)).toBe(false);
      expect(isValidMaxTokens(1.5)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://api.example.com/v1/chat')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should escape HTML special characters', () => {
      expect(sanitizeString('<script>')).toBe('&lt;script&gt;');
      expect(sanitizeString('"test"')).toBe('&quot;test&quot;');
      expect(sanitizeString("it's")).toBe('it&#x27;s');
    });

    it('should return unchanged string without special characters', () => {
      expect(sanitizeString('Hello World')).toBe('Hello World');
      expect(sanitizeString('abc123')).toBe('abc123');
    });
  });

  describe('truncateString', () => {
    it('should truncate long strings', () => {
      expect(truncateString('Hello World', 8)).toBe('Hello...');
      expect(truncateString('This is a long string', 10)).toBe('This is...');
    });

    it('should not truncate short strings', () => {
      expect(truncateString('Hello', 10)).toBe('Hello');
      expect(truncateString('Hi', 5)).toBe('Hi');
    });

    it('should use custom suffix', () => {
      expect(truncateString('Hello World', 8, '…')).toBe('Hello W…');
    });
  });

  describe('extractMessagePreview', () => {
    it('should extract first line and truncate', () => {
      expect(extractMessagePreview('Hello\nWorld', 10)).toBe('Hello');
      expect(extractMessagePreview('This is a very long first line', 10)).toBe('This is...');
    });

    it('should handle empty content', () => {
      expect(extractMessagePreview('')).toBe('');
      expect(extractMessagePreview('   ')).toBe('');
    });
  });

  describe('generateChatTitle', () => {
    it('should generate clean title from message', () => {
      expect(generateChatTitle('# Hello World')).toBe('Hello World');
      expect(generateChatTitle('**Bold** and *italic*')).toBe('Bold and italic');
    });

    it('should truncate long titles', () => {
      expect(generateChatTitle('This is a very long message that should be truncated', 20)).toBe(
        'This is a very lo...',
      );
    });

    it('should handle newlines', () => {
      expect(generateChatTitle('Line 1\nLine 2\nLine 3')).toBe('Line 1 Line 2 Line 3');
    });
  });
});
