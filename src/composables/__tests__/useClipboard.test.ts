import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useClipboard } from '../useClipboard';

describe('useClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should detect clipboard support', () => {
    const { isSupported } = useClipboard();
    expect(isSupported).toBe(true);
  });

  it('should copy text to clipboard', async () => {
    const { copied, copy } = useClipboard();

    expect(copied.value).toBe(false);

    const result = await copy('test text');

    expect(result).toBe(true);
    expect(copied.value).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
  });

  it('should reset copied state after duration', async () => {
    const { copied, copy } = useClipboard({ copiedDuration: 1000 });

    await copy('test');
    expect(copied.value).toBe(true);

    vi.advanceTimersByTime(1000);
    expect(copied.value).toBe(false);
  });

  it('should use custom copied duration', async () => {
    const { copied, copy } = useClipboard({ copiedDuration: 500 });

    await copy('test');
    expect(copied.value).toBe(true);

    vi.advanceTimersByTime(400);
    expect(copied.value).toBe(true);

    vi.advanceTimersByTime(100);
    expect(copied.value).toBe(false);
  });

  it('should handle clipboard errors', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('Copy failed'));

    const { copied, copy, error } = useClipboard();

    const result = await copy('test');

    expect(result).toBe(false);
    expect(copied.value).toBe(false);
    expect(error.value).toBe('Copy failed');
  });

  it('should clear previous timeout when copying again', async () => {
    const { copied, copy } = useClipboard({ copiedDuration: 1000 });

    await copy('first');
    expect(copied.value).toBe(true);

    vi.advanceTimersByTime(500);

    await copy('second');
    expect(copied.value).toBe(true);

    vi.advanceTimersByTime(500);
    expect(copied.value).toBe(true);

    vi.advanceTimersByTime(500);
    expect(copied.value).toBe(false);
  });

  it('should return error when clipboard is not supported', async () => {
    // Temporarily remove clipboard support
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: undefined },
      writable: true,
    });

    const { copy, error, isSupported } = useClipboard();
    expect(isSupported).toBe(false);

    const result = await copy('test');
    expect(result).toBe(false);
    expect(error.value).toBe('Clipboard API is not supported');

    // Restore
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
    });
  });
});
