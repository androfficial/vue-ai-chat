import { onScopeDispose, ref, type Ref } from 'vue'

// Timing constants for stream buffer processing
const BUFFER_CHECK_INTERVAL_MS = 20
const FLUSH_WAIT_MS = 100
const PUNCTUATION_DELAY_MULTIPLIER = 1.5
const COMMA_DELAY_MULTIPLIER = 1.2
const SHORT_WORD_DELAY_MULTIPLIER = 0.7
const SHORT_WORD_LENGTH = 3

// Buffer size thresholds for speed adjustments
const BUFFER_THRESHOLD_HIGH = 500
const BUFFER_THRESHOLD_MEDIUM = 200
const BUFFER_THRESHOLD_LOW = 100

// Speed multipliers when buffer is filling up
const SPEED_MULTIPLIER_HIGH = 0.3
const SPEED_MULTIPLIER_MEDIUM = 0.5
const SPEED_MULTIPLIER_LOW = 0.7

// Minimum delays to prevent too-fast processing
const MIN_DELAY_HIGH = 10
const MIN_DELAY_MEDIUM = 20
const MIN_DELAY_LOW = 30

export interface UseStreamBufferOptions {
  onFlush?: (text: string) => void
  wordDelay?: number
}

export interface UseStreamBufferReturn {
  clear: () => void
  flushImmediate: () => void
  isStreaming: Ref<boolean>
  push: (content: string) => void
  start: () => void
  stop: () => void
}

export function useStreamBuffer(options: UseStreamBufferOptions = {}): UseStreamBufferReturn {
  const { onFlush, wordDelay = 50 } = options

  const buffer = ref('')
  const isStreaming = ref(false)
  const flushedLength = ref(0)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  // Cleanup timeout on scope dispose to prevent memory leaks
  onScopeDispose(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  })

  function processNext(): void {
    if (!isStreaming.value) return

    const remaining = buffer.value.slice(flushedLength.value)

    if (!remaining) {
      // Buffer is empty, check again soon
      timeoutId = setTimeout(processNext, BUFFER_CHECK_INTERVAL_MS)
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
      }, FLUSH_WAIT_MS)
      return
    }

    // Flush the chunk
    const chunk = remaining.slice(0, chunkEnd)
    onFlush?.(chunk)
    flushedLength.value += chunkEnd

    // Calculate delay - shorter for small words, longer for punctuation
    let delay = wordDelay
    if (chunk.includes('.') || chunk.includes('!') || chunk.includes('?')) {
      delay = wordDelay * PUNCTUATION_DELAY_MULTIPLIER
    } else if (chunk.includes(',') || chunk.includes(':') || chunk.includes(';')) {
      delay = wordDelay * COMMA_DELAY_MULTIPLIER
    } else if (chunk.length <= SHORT_WORD_LENGTH) {
      delay = wordDelay * SHORT_WORD_DELAY_MULTIPLIER
    }

    // Speed up if buffer is getting too full
    const bufferSize = buffer.value.length - flushedLength.value
    if (bufferSize > BUFFER_THRESHOLD_HIGH) {
      delay = Math.max(delay * SPEED_MULTIPLIER_HIGH, MIN_DELAY_HIGH)
    } else if (bufferSize > BUFFER_THRESHOLD_MEDIUM) {
      delay = Math.max(delay * SPEED_MULTIPLIER_MEDIUM, MIN_DELAY_MEDIUM)
    } else if (bufferSize > BUFFER_THRESHOLD_LOW) {
      delay = Math.max(delay * SPEED_MULTIPLIER_LOW, MIN_DELAY_LOW)
    }

    timeoutId = setTimeout(processNext, delay)
  }

  function push(content: string): void {
    buffer.value += content
  }

  function start(): void {
    if (isStreaming.value) return
    isStreaming.value = true
    processNext()
  }

  function stop(): void {
    isStreaming.value = false
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  function flushImmediate(): void {
    stop()
    const remaining = buffer.value.slice(flushedLength.value)
    if (remaining) {
      onFlush?.(remaining)
      flushedLength.value = buffer.value.length
    }
  }

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
