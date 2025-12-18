import { ref, type Ref } from 'vue'

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
