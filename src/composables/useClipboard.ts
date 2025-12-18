/**
 * Clipboard composable
 * Provides clipboard copy functionality with status tracking
 *
 * @example
 * const { copy, copied, error } = useClipboard()
 * await copy('text to copy')
 */

import { ref } from 'vue'

export interface UseClipboardOptions {
  /** Duration in ms to show copied state (default: 2000) */
  copiedDuration?: number
}

export interface UseClipboardReturn {
  /** Whether content was recently copied successfully */
  copied: ReturnType<typeof ref<boolean>>
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>
  /** Error message if copy failed */
  error: ReturnType<typeof ref<string | null>>
  /** Whether copy is supported in current environment */
  isSupported: boolean
}

/**
 * Creates clipboard copy functionality
 * @param options - Configuration options
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { copiedDuration = 2000 } = options

  const copied = ref(false)
  const error = ref<string | null>(null)
  const isSupported = Boolean(navigator?.clipboard?.writeText)

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  async function copy(text: string): Promise<boolean> {
    // Clear previous state
    error.value = null
    copied.value = false

    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    if (!isSupported) {
      error.value = 'Clipboard API is not supported'
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      copied.value = true

      // Reset copied state after duration
      timeoutId = setTimeout(() => {
        copied.value = false
        timeoutId = null
      }, copiedDuration)

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to copy'
      return false
    }
  }

  return {
    copied,
    copy,
    error,
    isSupported,
  }
}
