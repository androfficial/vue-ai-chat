/**
 * Stream buffer composable
 * Provides smooth text streaming with word-by-word animation
 * similar to ChatGPT/Claude typing effect
 */

import { ref, type Ref } from 'vue'

export interface UseStreamBufferOptions {
  /** Callback when text chunk is flushed */
  onFlush?: (text: string) => void
  /** Delay between words in ms (default: 50) */
  wordDelay?: number
}

export interface UseStreamBufferReturn {
  /** Clear the buffer and stop streaming */
  clear: () => void
  /** Flush all remaining content immediately */
  flushImmediate: () => void
  /** Whether the buffer is currently streaming */
  isStreaming: Ref<boolean>
  /** Add content to the buffer */
  push: (content: string) => void
  /** Start streaming from buffer (call after setting onFlush) */
  start: () => void
  /** Stop streaming but keep buffer */
  stop: () => void
}

/**
 * Creates a stream buffer that outputs text smoothly
 * word by word with natural typing animation
 */
export function useStreamBuffer(options: UseStreamBufferOptions = {}): UseStreamBufferReturn {
  const { onFlush, wordDelay = 50 } = options

  const buffer = ref('')
  const isStreaming = ref(false)
  const flushedLength = ref(0)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  /**
   * Process next word/chunk from buffer
   */
  function processNext(): void {
    if (!isStreaming.value) return

    const remaining = buffer.value.slice(flushedLength.value)

    if (!remaining) {
      // Buffer is empty, check again soon
      timeoutId = setTimeout(processNext, 20)
      return
    }

    // Find next word boundary (space, newline, or punctuation followed by space)
    let chunkEnd = 0
    let foundBoundary = false

    for (let i = 0; i < remaining.length; i++) {
      const char = remaining[i]
      // Include the space/newline in the chunk
      if (char === ' ' || char === '\n') {
        chunkEnd = i + 1
        foundBoundary = true
        break
      }
    }

    // If no boundary found, wait for more content or flush what we have after a delay
    if (!foundBoundary) {
      // If buffer hasn't changed in a while, flush remaining
      timeoutId = setTimeout(() => {
        const stillRemaining = buffer.value.slice(flushedLength.value)
        if (stillRemaining && stillRemaining === remaining) {
          // Buffer hasn't changed, flush it
          onFlush?.(stillRemaining)
          flushedLength.value = buffer.value.length
        }
        processNext()
      }, 100)
      return
    }

    // Flush the chunk
    const chunk = remaining.slice(0, chunkEnd)
    onFlush?.(chunk)
    flushedLength.value += chunkEnd

    // Calculate delay - shorter for small words, longer for punctuation
    let delay = wordDelay
    if (chunk.includes('.') || chunk.includes('!') || chunk.includes('?')) {
      delay = wordDelay * 1.5
    } else if (chunk.includes(',') || chunk.includes(':') || chunk.includes(';')) {
      delay = wordDelay * 1.2
    } else if (chunk.length <= 3) {
      delay = wordDelay * 0.7
    }

    // Speed up if buffer is getting too full
    const bufferSize = buffer.value.length - flushedLength.value
    if (bufferSize > 500) {
      delay = Math.max(delay * 0.3, 10)
    } else if (bufferSize > 200) {
      delay = Math.max(delay * 0.5, 20)
    } else if (bufferSize > 100) {
      delay = Math.max(delay * 0.7, 30)
    }

    timeoutId = setTimeout(processNext, delay)
  }

  /**
   * Add content to the buffer
   */
  function push(content: string): void {
    buffer.value += content
  }

  /**
   * Start streaming from buffer
   */
  function start(): void {
    if (isStreaming.value) return
    isStreaming.value = true
    processNext()
  }

  /**
   * Stop streaming but keep buffer
   */
  function stop(): void {
    isStreaming.value = false
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  /**
   * Flush all remaining content immediately
   */
  function flushImmediate(): void {
    stop()
    const remaining = buffer.value.slice(flushedLength.value)
    if (remaining) {
      onFlush?.(remaining)
      flushedLength.value = buffer.value.length
    }
  }

  /**
   * Clear the buffer and stop streaming
   */
  function clear(): void {
    stop()
    buffer.value = ''
    flushedLength.value = 0
  }

  return {
    clear,
    flushImmediate,
    isStreaming,
    push,
    start,
    stop,
  }
}
