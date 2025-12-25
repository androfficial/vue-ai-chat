---
description: API Services and Cerebras Integration
globs:
  - '**/services/**/*.ts'
alwaysApply: false
---

# API Services Guidelines

## Cerebras API Integration

### Streaming Responses

Handle SSE (Server-Sent Events) streaming with callbacks:

```typescript
export async function sendStreamingChatCompletion(
  messages: ApiMessage[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  try {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        stream: true,
      }),
      signal,
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader!.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

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
            if (content) onChunk(content)
          } catch (error) {
            console.warn('Parse error:', error)
          }
        }
      }
    }

    onComplete()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return
    }
    onError(getErrorCode(error))
  }
}
```

## Error Handling

Always handle API errors gracefully:

```typescript
await sendStreamingChatCompletion(
  messages,
  chunk => {
    // Handle chunk
  },
  () => {
    // Stream complete
  },
  errorCode => {
    // Handle error
    switch (errorCode) {
      case 'networkError':
        toast.show('Network error. Check your connection.', 'error')
        break
      case 'unauthorized':
        toast.show('Invalid API key.', 'error')
        break
      case 'rateLimited':
        toast.show('Rate limit exceeded.', 'warning')
        break
      default:
        toast.show('Failed to get response from AI.', 'error')
    }
  },
  abortController.signal,
)
```

## API Configuration

Store API config in Pinia store with persistence:

```typescript
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage'

export const useApiStore = defineStore('api', () => {
  const config = ref<ApiConfig>(loadConfig())

  function loadConfig(): ApiConfig {
    const stored = getStorageItem<Partial<ApiConfig>>(STORAGE_KEYS.API_CONFIG)
    return {
      ...DEFAULT_API_CONFIG,
      apiKey: stored?.apiKey ?? '',
      ...stored,
    }
  }

  watch(
    config,
    newConfig => {
      setStorageItem(STORAGE_KEYS.API_CONFIG, newConfig)
    },
    { deep: true },
  )

  function updateConfig(updates: Partial<ApiConfig>) {
    config.value = { ...config.value, ...updates }
  }

  return { config, updateConfig }
})
```

## Service Structure

- Keep API logic in `services/api/` directory
- Export typed functions
- Use async generators for streaming
- Handle errors at service level
