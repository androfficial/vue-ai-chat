import { ref } from 'vue'

export interface UseClipboardOptions {
  copiedDuration?: number
}

export interface UseClipboardReturn {
  copied: ReturnType<typeof ref<boolean>>
  copy: (text: string) => Promise<boolean>
  error: ReturnType<typeof ref<string | null>>
  isSupported: boolean
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { copiedDuration = 2000 } = options

  const copied = ref(false)
  const error = ref<string | null>(null)
  const isSupported = Boolean(navigator?.clipboard?.writeText)

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  async function copy(text: string): Promise<boolean> {
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
