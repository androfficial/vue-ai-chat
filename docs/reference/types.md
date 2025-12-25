# Types Reference

Complete reference for all TypeScript types and interfaces in the project.

## Chat Types

### `Chat`

```typescript
interface Chat {
  createdAt: number
  id: string
  isPinned: boolean
  isTemporary: boolean
  messages: Message[]
  title: string
  updatedAt: number
}
```

### `ChatListItem`

```typescript
interface ChatListItem {
  id: string
  isPinned: boolean
  isTemporary: boolean
  lastMessage?: string
  title: string
  updatedAt: number
}
```

### `CreateChatPayload`

```typescript
interface CreateChatPayload {
  initialMessage?: string
  isTemporary?: boolean
  title?: string
}
```

### `UpdateChatPayload`

```typescript
interface UpdateChatPayload {
  isPinned?: boolean
  title?: string
}
```

## Message Types

### `Message`

```typescript
interface Message {
  chatId: string
  content: string
  createdAt: number
  error?: string
  id: string
  isEdited: boolean
  originalContent?: string
  role: MessageRole
  status: MessageStatus
  tokenUsage?: TokenUsage
}
```

### `MessageRole`

```typescript
type MessageRole = 'user' | 'assistant' | 'system'
```

### `MessageStatus`

```typescript
type MessageStatus = 'pending' | 'streaming' | 'completed' | 'error'
```

### `CreateMessagePayload`

```typescript
interface CreateMessagePayload {
  chatId: string
  content: string
  role: MessageRole
}
```

### `UpdateMessagePayload`

```typescript
interface UpdateMessagePayload {
  content: string
}
```

### `StreamingMessage`

```typescript
interface StreamingMessage {
  content: string
  isComplete: boolean
  messageId: string
}
```

### `TokenUsage`

```typescript
interface TokenUsage {
  completionTokens: number
  promptTokens: number
  totalTokens: number
}
```

## API Types

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

### `ChatCompletionChoice`

```typescript
interface ChatCompletionChoice {
  finish_reason: 'stop' | 'length' | 'content_filter' | null
  index: number
  message: ApiMessage
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

### `StreamingChoice`

```typescript
interface StreamingChoice {
  delta: StreamingDelta
  finish_reason: 'stop' | 'length' | 'content_filter' | null
  index: number
}
```

### `StreamingDelta`

```typescript
interface StreamingDelta {
  content?: string
  role?: MessageRole
}
```

### `ApiTokenUsage`

```typescript
interface ApiTokenUsage {
  completion_tokens: number
  prompt_tokens: number
  total_tokens: number
}
```

### `ApiError`

```typescript
interface ApiError {
  error: {
    message: string
    type: string
    code: string
  }
}
```

### `ApiResponse<T>`

Generic API response wrapper.

```typescript
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }
```

### `ApiErrorCode`

```typescript
type ApiErrorCode = 'networkError' | 'rateLimited' | 'serverError' | 'unauthorized' | 'unknown'
```

## User Types

### `UserPreferences`

```typescript
interface UserPreferences {
  language: Language
  sidebarCollapsed: boolean
  temporaryChatMode: boolean
  theme: Theme
}
```

### `Theme`

```typescript
type Theme = 'light' | 'dark' | 'system'
```

### `Language`

```typescript
type Language = 'en' | 'uk'
```

## Type Utilities

### Barrel Exports

Types are exported from `src/types/index.ts`:

```typescript
export type { Chat, ChatListItem, CreateChatPayload, UpdateChatPayload } from './chat'
export type { Message, MessageRole, MessageStatus, CreateMessagePayload } from './message'
export type { ApiConfig, ApiMessage, ApiResponse } from './api'
export type { UserPreferences, Theme, Language } from './user'
```

### Type Imports

Always use `import type` for type-only imports:

```typescript
import type { Chat, Message } from '@/types'
```

### Generic Types

```typescript
interface ApiResponse<T> {
  data: T
  success: boolean
}

type ChatResponse = ApiResponse<Chat[]>
```

## Type Guards

### Example Type Guard

```typescript
function isMessage(obj: unknown): obj is Message {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'content' in obj && 'role' in obj
}
```

## Constants

### `CEREBRAS_MODELS`

```typescript
const CEREBRAS_MODELS = [
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', description: 'Best for complex tasks' },
  { id: 'llama3.1-8b', name: 'Llama 3.1 8B', description: 'Fast and efficient' },
  { id: 'qwen-3-32b', name: 'Qwen 3 32B', description: 'Great multilingual support' },
  { id: 'gpt-oss-120b', name: 'GPT OSS 120B', description: 'Reasoning model' },
] as const
```

### `DEFAULT_API_CONFIG`

```typescript
const DEFAULT_API_CONFIG: Omit<ApiConfig, 'apiKey'> = {
  baseUrl: 'https://api.cerebras.ai/v1',
  maxTokens: 4096,
  model: 'llama-3.3-70b',
  temperature: 0.7,
  topP: 1,
}
```

## Next Steps

- Review [TypeScript Guidelines](../explanation/patterns.md#typescript)
- Study [Development Patterns](../explanation/patterns.md)
- Check [Architecture](./architecture.md)

---

**Types Reference complete!** Use this reference when working with TypeScript types.
