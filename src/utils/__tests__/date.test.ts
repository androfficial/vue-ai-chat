import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatFullDateTime, formatMessageTime, getDateGroup, getTimeDiff, now } from '../date';

describe('date', () => {
  const MOCK_DATE = new Date('2024-06-15T12:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('now', () => {
    it('should return current timestamp', () => {
      expect(now()).toBe(MOCK_DATE.getTime());
    });
  });

  describe('getTimeDiff', () => {
    it('should return justNow for less than 1 minute', () => {
      const timestamp = MOCK_DATE.getTime() - 30 * 1000; // 30 seconds ago
      expect(getTimeDiff(timestamp)).toEqual({ type: 'justNow' });
    });

    it('should return minutes for less than 1 hour', () => {
      const timestamp = MOCK_DATE.getTime() - 30 * 60 * 1000; // 30 minutes ago
      expect(getTimeDiff(timestamp)).toEqual({ type: 'minutes', value: 30 });
    });

    it('should return hours for less than 24 hours', () => {
      const timestamp = MOCK_DATE.getTime() - 5 * 60 * 60 * 1000; // 5 hours ago
      expect(getTimeDiff(timestamp)).toEqual({ type: 'hours', value: 5 });
    });

    it('should return days for less than 7 days', () => {
      const timestamp = MOCK_DATE.getTime() - 3 * 24 * 60 * 60 * 1000; // 3 days ago
      expect(getTimeDiff(timestamp)).toEqual({ type: 'days', value: 3 });
    });

    it('should return date for 7 or more days', () => {
      const timestamp = MOCK_DATE.getTime() - 10 * 24 * 60 * 60 * 1000; // 10 days ago
      const result = getTimeDiff(timestamp);
      expect(result.type).toBe('date');
      expect(result).toHaveProperty('value');
    });
  });

  describe('formatMessageTime', () => {
    it('should format time in 24-hour format', () => {
      const timestamp = new Date('2024-06-15T14:30:00').getTime();
      expect(formatMessageTime(timestamp)).toBe('14:30');
    });

    it('should handle midnight', () => {
      const timestamp = new Date('2024-06-15T00:05:00').getTime();
      expect(formatMessageTime(timestamp)).toBe('00:05');
    });
  });

  describe('formatFullDateTime', () => {
    it('should format full date and time in English', () => {
      const timestamp = new Date('2024-06-15T14:30:00').getTime();
      const result = formatFullDateTime(timestamp, 'en');
      expect(result).toMatch(/June/);
      expect(result).toMatch(/15/);
      expect(result).toMatch(/2024/);
    });

    it('should format full date and time in Ukrainian', () => {
      const timestamp = new Date('2024-06-15T14:30:00').getTime();
      const result = formatFullDateTime(timestamp, 'uk');
      expect(result).toMatch(/15/);
      expect(result).toMatch(/2024/);
    });
  });

  describe('getDateGroup', () => {
    it('should return today for current day', () => {
      expect(getDateGroup(MOCK_DATE.getTime())).toEqual({ type: 'today' });
    });

    it('should return yesterday for previous day', () => {
      const yesterday = MOCK_DATE.getTime() - 24 * 60 * 60 * 1000;
      expect(getDateGroup(yesterday)).toEqual({ type: 'yesterday' });
    });

    it('should return thisWeek for 2-6 days ago', () => {
      const threeDaysAgo = MOCK_DATE.getTime() - 3 * 24 * 60 * 60 * 1000;
      expect(getDateGroup(threeDaysAgo)).toEqual({ type: 'thisWeek' });
    });

    it('should return lastWeek for 7-13 days ago', () => {
      const tenDaysAgo = MOCK_DATE.getTime() - 10 * 24 * 60 * 60 * 1000;
      expect(getDateGroup(tenDaysAgo)).toEqual({ type: 'lastWeek' });
    });

    it('should return twoWeeksAgo for 14-20 days ago', () => {
      const fifteenDaysAgo = MOCK_DATE.getTime() - 15 * 24 * 60 * 60 * 1000;
      expect(getDateGroup(fifteenDaysAgo)).toEqual({ type: 'twoWeeksAgo' });
    });

    it('should return threeWeeksAgo for 21-27 days ago', () => {
      const twentyTwoDaysAgo = MOCK_DATE.getTime() - 22 * 24 * 60 * 60 * 1000;
      expect(getDateGroup(twentyTwoDaysAgo)).toEqual({ type: 'threeWeeksAgo' });
    });
  });
});
