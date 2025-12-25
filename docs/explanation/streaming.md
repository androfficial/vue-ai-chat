# Streaming Responses

This document explains how AI response streaming works in the application.

## Overview

The application uses **Server-Sent Events (SSE)** to stream AI responses character by character, creating a smooth typing animation effect.

## Streaming Flow

### High-Level Flow

```
User sends message
    ↓
API request with stream: true
    ↓
SSE stream starts
    ↓
Chunks received incrementally
    ↓
useStreamBuffer buffers chunks
    ↓
Smooth animation (word-by-word)
    ↓
Message updated in real-time
    ↓
Stream completes
```

## Implementation Details

### API Service Layer

**Location**: `src/services/api/cerebras.ts`

The `sendStreamingChatCompletion` function handles SSE streaming:

```typescript
export async function sendStreamingChatCompletion(
  messages: ApiMessage[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: string) => void,
  signal?: AbortSignal,
): Promise<void>
```

### Stream Processing

The `processStream` function processes SSE events:

```typescript
async function processStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (content: string) => void,
  onComplete: () => void,
): Promise<void> {
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    buffer += chunk

    // Process complete SSE events
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') {
          onComplete()
          return
        }

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices[0]?.delta?.content
          if (content) {
            onChunk(content)
          }
        } catch (error) {
          console.warn('Failed to parse chunk:', error)
        }
      }
    }
  }

  onComplete()
}
```

## Streaming Buffer

### useStreamBuffer Composable

**Location**: `src/composables/useStreamBuffer.ts`

The `useStreamBuffer` composable creates smooth word-by-word animation:

```typescript
export function useStreamBuffer(options: UseStreamBufferOptions): UseStreamBufferReturn {
  const buffer = ref('')
  const isFlushing = ref(false)

  function push(text: string) {
    buffer.value += text
  }

  function flushImmediate() {
    if (buffer.value) {
      options.onFlush(buffer.value)
      buffer.value = ''
    }
  }

  function start() {
    // Start interval to flush words
    const interval = setInterval(() => {
      if (buffer.value && !isFlushing.value) {
        // Extract next word
        const match = buffer.value.match(/^(\S+\s*)/)
        if (match) {
          const word = match[1]
          buffer.value = buffer.value.slice(word.length)
          options.onFlush(word)
        }
      }
    }, options.wordDelay || 50)
  }

  return { push, flushImmediate, start, stop }
}
```

### Buffer Behavior

1. **Chunks arrive** - API sends content chunks
2. **Buffer accumulates** - Chunks added to buffer
3. **Word extraction** - Buffer extracts words one at a time
4. **Animation** - Words flushed with delay (50ms default)
5. **UI update** - Message content updated incrementally

## Integration with Chat

### useChatMessages Composable

**Location**: `src/composables/useChatMessages.ts`

The `useChatMessages` composable integrates streaming:

```typescript
async function executeStreamingRequest(
  chatId: string,
  messageId: string,
  apiMessages: ApiMessage[],
): Promise<void> {
  // Create buffer for smooth animation
  const streamBuffer = createMessageBuffer(chatId, messageId)
  streamBuffer.start()

  // Start streaming
  await sendStreamingChatCompletion(
    apiMessages,
    chunk => streamBuffer.push(chunk), // Buffer chunks
    () => {
      streamBuffer.flushImmediate() // Flush remaining
      handleStreamComplete(chatId, messageId)
    },
    errorCode => {
      streamBuffer.flushImmediate()
      handleStreamError(chatId, messageId, errorCode)
    },
    abortController.value.signal,
  )
}
```

## Message Status

Messages have a `status` field that tracks streaming state:

```typescript
type MessageStatus = 'pending' | 'streaming' | 'completed' | 'error'
```

### Status Flow

```
pending → streaming → completed
              ↓
            error
```

### Status Updates

```typescript
// Start streaming
chatStore.updateMessageStatus(chatId, messageId, 'streaming')

// Complete
chatStore.updateMessageStatus(chatId, messageId, 'completed')

// Error
chatStore.updateMessageStatus(chatId, messageId, 'error')
```

## Abort Support

### Cancellation

Streaming can be cancelled using `AbortController`:

```typescript
const abortController = ref<AbortController | null>(null)

// Start request
abortController.value = new AbortController()
await sendStreamingChatCompletion(..., abortController.value.signal)

// Cancel
function stopGeneration() {
  if (abortController.value) {
    abortController.value.abort()
    abortController.value = null
  }
}
```

### Abort Handling

```typescript
try {
  await sendStreamingChatCompletion(...)
} catch (error) {
  if (error.name === 'AbortError') {
    // Request was cancelled
    return
  }
  // Handle other errors
}
```

## Error Handling

### Error Types

```typescript
type ApiErrorCode = 'networkError' | 'rateLimited' | 'serverError' | 'unauthorized' | 'unknown'
```

### Error Handling Flow

```typescript
function handleStreamError(chatId: string, messageId: string, errorCode: string) {
  chatStore.updateMessageStatus(chatId, messageId, 'error')
  const message = chatStore.getChatById(chatId)?.messages.find(m => m.id === messageId)
  if (message) {
    message.error = getLocalizedErrorMessage(errorCode)
  }
}
```

## Performance Considerations

### Buffer Size

- Small buffer prevents memory issues
- Word-by-word flushing creates smooth animation
- Immediate flush on completion

### Network Efficiency

- SSE is efficient for streaming
- Chunks are processed incrementally
- No need to wait for full response

### UI Updates

- Updates are batched by word
- Smooth animation without jank
- Immediate update on completion

## Best Practices

### ✅ DO

- Use streaming for better UX
- Buffer chunks for smooth animation
- Handle errors gracefully
- Support cancellation
- Update status appropriately

### ❌ DON'T

- Block UI during streaming
- Ignore errors
- Forget to flush buffer on completion
- Store all chunks in memory

## Troubleshooting

### Streaming Stops Mid-Response

- Check network connection
- Verify API key is valid
- Check browser console for errors
- Try regenerating response

### Animation is Choppy

- Adjust `wordDelay` in `useStreamBuffer`
- Check browser performance
- Reduce buffer size

### Messages Not Updating

- Verify store updates
- Check component reactivity
- Ensure buffer is flushing

## Next Steps

- Review [API Reference](../reference/api-reference.md)
- Study [Composables Reference](../reference/composables.md)
- Check [State Management](./state-management.md)

---

**Streaming explained!** This implementation provides smooth, real-time AI responses.
