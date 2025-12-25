# API Reference

Complete reference for the API service layer.

## Service: `cerebras.ts`

**Location**: `src/services/api/cerebras.ts`

Cerebras AI API integration with streaming support.

### Functions

#### `sendChatCompletion`

Send a non-streaming chat completion request.

```typescript
function sendChatCompletion(messages: ApiMessage[]): Promise<ApiResponse<ChatCompletionResponse>>
```

**Parameters:**

- `messages` - Array of API messages

**Returns:** Promise with API response

**Example:**

```typescript
const result = await sendChatCompletion([{ role: 'user', content: 'Hello' }])

if (result.success) {
  console.log(result.data)
}
```

#### `sendStreamingChatCompletion`

Send a streaming chat completion request.

```typescript
function sendStreamingChatCompletion(
  messages: ApiMessage[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: string) => void,
  signal?: AbortSignal,
): Promise<void>
```

**Parameters:**

- `messages` - Array of API messages
- `onChunk` - Callback for each content chunk
- `onComplete` - Callback when stream completes
- `onError` - Callback for errors
- `signal` - Optional AbortSignal for cancellation

**Example:**

```typescript
await sendStreamingChatCompletion(
  messages,
  chunk => console.log(chunk),
  () => console.log('Complete'),
  error => console.error(error),
  abortController.signal,
)
```

#### `testApiConnection`

Test API connection with a simple request.

```typescript
function testApiConnection(): Promise<ApiResponse<boolean>>
```

**Returns:** Promise with connection test result

### Error Codes

```typescript
type ApiErrorCode = 'networkError' | 'rateLimited' | 'serverError' | 'unauthorized' | 'unknown'
```

### Helper Functions

#### `getErrorCodeFromStatus`

Map HTTP status to error code.

```typescript
function getErrorCodeFromStatus(status: number): ApiErrorCode
```

#### `getErrorCode`

Determine error code from error object.

```typescript
function getErrorCode(error: unknown, status?: number): ApiErrorCode
```

## Types

### `ApiConfig`

```typescript
interface ApiConfig {
  apiKey: string
  baseUrl: string
  maxTokens: number
  model: string
  temperature: number
  topP: number
}
```

### `ApiMessage`

```typescript
interface ApiMessage {
  content: string
  role: MessageRole
}
```

### `ChatCompletionRequest`

```typescript
interface ChatCompletionRequest {
  max_tokens: number
  messages: ApiMessage[]
  model: string
  stream: boolean
  temperature: number
  top_p: number
}
```

### `ChatCompletionResponse`

```typescript
interface ChatCompletionResponse {
  choices: ChatCompletionChoice[]
  created: number
  id: string
  model: string
  object: string
  usage: ApiTokenUsage
}
```

### `StreamingChunk`

```typescript
interface StreamingChunk {
  choices: StreamingChoice[]
  created: number
  id: string
  model: string
  object: string
}
```

### `ApiResponse<T>`

Generic API response wrapper.

```typescript
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }
```

## Constants

### `DEFAULT_API_CONFIG`

Default API configuration (without API key).

```typescript
const DEFAULT_API_CONFIG: Omit<ApiConfig, 'apiKey'> = {
  baseUrl: 'https://api.cerebras.ai/v1',
  maxTokens: 4096,
  model: 'llama-3.3-70b',
  temperature: 0.7,
  topP: 1,
}
```

### `CEREBRAS_MODELS`

Available Cerebras models.

```typescript
const CEREBRAS_MODELS = [
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', description: 'Best for complex tasks' },
  { id: 'llama3.1-8b', name: 'Llama 3.1 8B', description: 'Fast and efficient' },
  { id: 'qwen-3-32b', name: 'Qwen 3 32B', description: 'Great multilingual support' },
  { id: 'gpt-oss-120b', name: 'GPT OSS 120B', description: 'Reasoning model' },
] as const
```

## Usage Examples

### Basic Streaming Request

```typescript
import { sendStreamingChatCompletion } from '@/services/api/cerebras'

const messages = [{ role: 'user', content: 'Hello, how are you?' }]

await sendStreamingChatCompletion(
  messages,
  chunk => {
    // Handle each chunk
    console.log('Chunk:', chunk)
  },
  () => {
    // Stream complete
    console.log('Done')
  },
  error => {
    // Handle error
    console.error('Error:', error)
  },
)
```

### With AbortController

```typescript
const abortController = new AbortController()

sendStreamingChatCompletion(messages, onChunk, onComplete, onError, abortController.signal)

// Cancel request
abortController.abort()
```

### Error Handling

```typescript
const result = await sendChatCompletion(messages)

if (!result.success) {
  switch (result.error) {
    case 'unauthorized':
      // Handle invalid API key
      break
    case 'rateLimited':
      // Handle rate limit
      break
    case 'networkError':
      // Handle network error
      break
    default:
    // Handle unknown error
  }
}
```

## Next Steps

- Review [Streaming Explanation](../explanation/streaming.md)
- Check [API Configuration Guide](../how-to/configure-api.md)
- Study [Architecture](./architecture.md)

---

**API Reference complete!** Use this reference when working with the API service layer.
