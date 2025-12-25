---
description: API Services and Cerebras Integration
globs:
  - '**/services/**/*.ts'
alwaysApply: false
---

# API Services Guidelines

## Cerebras API Integration

### Streaming Responses

Handle SSE (Server-Sent Events) streaming:

```typescript
export async function* streamChatCompletion(
  messages: Message[],
  config: ApiConfig,
): AsyncGenerator<string> {
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
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader!.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') return

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices[0]?.delta?.content
          if (content) yield content
        } catch (error) {
          console.error('Parse error:', error)
        }
      }
    }
  }
}
```

## Error Handling

Always handle API errors gracefully:

```typescript
try {
  const stream = streamChatCompletion(messages, config)
  for await (const chunk of stream) {
    // Handle chunk
  }
} catch (error) {
  if (error instanceof TypeError) {
    throw new Error('Network error. Check your connection.')
  } else if (error.status === 401) {
    throw new Error('Invalid API key.')
  } else if (error.status === 429) {
    throw new Error('Rate limit exceeded.')
  } else {
    throw new Error('Failed to get response from AI.')
  }
}
```

## API Configuration

Store API config in Pinia store with persistence:

```typescript
export const useApiStore = defineStore('api', () => {
  const config = ref<ApiConfig>(loadFromStorage('api-config', defaultConfig))

  function updateConfig(newConfig: Partial<ApiConfig>) {
    config.value = { ...config.value, ...newConfig }
    saveToStorage('api-config', config.value)
  }

  return { config, updateConfig }
})
```

## Service Structure

- Keep API logic in `services/api/` directory
- Export typed functions
- Use async generators for streaming
- Handle errors at service level
