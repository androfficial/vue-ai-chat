# Stores Reference

Complete reference for all Pinia stores in the project.

## Chat Store

**Location**: `src/stores/chat.ts`

**Store ID**: `chat`

Manages chat state including chats, messages, and active chat.

### State

```typescript
chats: Ref<Chat[]>
activeChatId: Ref<string | null>
isLoading: Ref<boolean>
temporaryChatMode: Ref<boolean>
```

### Getters

```typescript
activeChat: ComputedRef<Chat | null>
chatList: ComputedRef<ChatListItem[]>
persistentChatList: ComputedRef<ChatListItem[]>
hasChats: ComputedRef<boolean>
```

### Actions

#### Chat Management

```typescript
createChat(payload?: CreateChatPayload): Chat
deleteChat(chatId: string): void
updateChat(chatId: string, payload: UpdateChatPayload): void
setActiveChat(chatId: string | null): void
clearAllChats(): void
getChatById(id: string): Chat | undefined
```

#### Message Management

```typescript
addMessage(payload: CreateMessagePayload): Message
updateMessageContent(chatId: string, messageId: string, content: string): void
updateMessageStatus(chatId: string, messageId: string, status: MessageStatus): void
appendToMessage(chatId: string, messageId: string, content: string): void
deleteMessage(chatId: string, messageId: string): void
deleteMessagesAfter(chatId: string, messageId: string): void
getLastUserMessage(chatId: string): Message | undefined
```

#### Temporary Chat

```typescript
setTemporaryChatMode(enabled: boolean): void
convertToRegularChat(chatId: string): void
```

#### Loading

```typescript
setLoading(loading: boolean): void
```

### Usage Example

```typescript
import { useChatStore } from '@/stores'

const chatStore = useChatStore()

// Create chat
const chat = chatStore.createChat({ title: 'New Chat' })

// Add message
chatStore.addMessage({
  chatId: chat.id,
  content: 'Hello!',
  role: 'user',
})

// Get active chat
const active = chatStore.activeChat
```

## API Store

**Location**: `src/stores/api.ts`

**Store ID**: `api`

Manages API configuration and settings.

### State

```typescript
config: Ref<ApiConfig>
```

### Getters

```typescript
apiKey: ComputedRef<string>
model: ComputedRef<string>
hasApiKey: ComputedRef<boolean>
isConfigured: ComputedRef<boolean>
```

### Actions

```typescript
setApiKey(key: string): void
setModel(modelName: string): void
updateConfig(updates: Partial<ApiConfig>): void
resetConfig(): void
```

### Usage Example

```typescript
import { useApiStore } from '@/stores'

const apiStore = useApiStore()

// Set API key
apiStore.setApiKey('your-api-key')

// Set model
apiStore.setModel('llama-3.3-70b')

// Check configuration
if (apiStore.isConfigured) {
  // API is ready
}
```

## User Store

**Location**: `src/stores/user.ts`

**Store ID**: `user`

Manages user preferences and settings.

### State

```typescript
preferences: Ref<UserPreferences>
```

### Getters

```typescript
theme: ComputedRef<Theme>
language: ComputedRef<Language>
```

### Actions

```typescript
updatePreferences(updates: Partial<UserPreferences>): void
resetPreferences(): void
```

### Usage Example

```typescript
import { useUserStore } from '@/stores'

const userStore = useUserStore()

// Update theme
userStore.updatePreferences({ theme: 'dark' })

// Update language
userStore.updatePreferences({ language: 'uk' })
```

## Store Patterns

### Persistence Pattern

```typescript
export const useStore = defineStore('store', () => {
  const items = ref(loadItems())

  function loadItems() {
    return getStorageItem<Item[]>(STORAGE_KEYS.ITEMS) ?? []
  }

  watch(
    items,
    newItems => {
      setStorageItem(STORAGE_KEYS.ITEMS, newItems)
    },
    { deep: true },
  )

  return { items }
})
```

### Computed Getters

```typescript
export const useStore = defineStore('store', () => {
  const items = ref<Item[]>([])

  const itemCount = computed(() => items.value.length)

  const filteredItems = computed(() => {
    return items.value.filter(item => item.active)
  })

  return { items, itemCount, filteredItems }
})
```

### Async Actions

```typescript
export const useStore = defineStore('store', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchData() {
    loading.value = true
    error.value = null

    try {
      const data = await api.fetchData()
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, error, fetchData }
})
```

### Using Other Stores

```typescript
export const useStore = defineStore('store', () => {
  const apiStore = useApiStore()
  const chatStore = useChatStore()

  function doSomething() {
    if (!apiStore.hasApiKey) {
      throw new Error('API key required')
    }

    const chatId = chatStore.activeChatId
    // Use chatId
  }

  return { doSomething }
})
```

## Storage Keys

Stores use these localStorage keys:

- `ai-chat:chats` - Chat store
- `ai-chat:api-config` - API store
- `ai-chat:preferences` - User store

## Testing Stores

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it, beforeEach } from 'vitest'

import { useChatStore } from '../chat'

describe('useChatStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should create chat', () => {
    const store = useChatStore()
    const chat = store.createChat()
    expect(store.chats).toHaveLength(1)
  })
})
```

## Next Steps

- Review [Creating Stores Guide](../how-to/add-new-store.md)
- Study [State Management Explanation](../explanation/state-management.md)
- Check [Architecture](./architecture.md)

---

**Stores Reference complete!** Use this reference when working with Pinia stores.
