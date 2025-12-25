# State Management

This document explains the state management architecture using Pinia stores.

## Overview

The application uses **Pinia** for state management with the Composition API style. All stores are located in `src/stores/` and follow consistent patterns.

## Store Architecture

### Store Structure

Each store follows this structure:

```typescript
export const useStore = defineStore('store', () => {
  // 1. State (refs)
  const items = ref<Item[]>([])

  // 2. Load from storage
  function loadItems() { ... }

  // 3. Persistence watcher
  watch(items, newItems => { ... }, { deep: true })

  // 4. Getters (computed)
  const itemCount = computed(() => items.value.length)

  // 5. Actions
  function addItem(item: Item) { ... }

  // 6. Return public API
  return { items, itemCount, addItem }
})
```

## Store Responsibilities

### Chat Store (`chat.ts`)

**Responsibility**: Manages chat-related state

**State:**

- Chats array
- Active chat ID
- Loading state
- Temporary chat mode

**Key Actions:**

- Create/delete/update chats
- Add/update/delete messages
- Manage active chat
- Handle temporary chats

**Persistence**: `ai-chat:chats` in localStorage

### API Store (`api.ts`)

**Responsibility**: Manages API configuration

**State:**

- API configuration (key, model, parameters)

**Key Actions:**

- Set API key
- Set model
- Update configuration
- Reset to defaults

**Persistence**: `ai-chat:api-config` in localStorage

### User Store (`user.ts`)

**Responsibility**: Manages user preferences

**State:**

- User preferences (theme, language, behavior)

**Key Actions:**

- Update preferences
- Reset preferences

**Persistence**: `ai-chat:preferences` in localStorage

## Persistence Pattern

### Loading from Storage

```typescript
const items = ref(loadItems())

function loadItems(): Item[] {
  return getStorageItem<Item[]>(STORAGE_KEYS.ITEMS) ?? []
}
```

### Saving to Storage

```typescript
watch(
  items,
  newItems => {
    setStorageItem(STORAGE_KEYS.ITEMS, newItems)
  },
  { deep: true },
)
```

### Storage Utilities

Located in `src/utils/storage.ts`:

```typescript
getStorageItem<T>(key: string): T | null
setStorageItem<T>(key: string, value: T): void
removeStorageItem(key: string): void
```

## State Flow

### Component → Store

```vue
<script setup lang="ts">
import { useChatStore } from '@/stores'

const chatStore = useChatStore()

function createChat() {
  chatStore.createChat({ title: 'New Chat' })
}
</script>
```

### Store → Component

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useChatStore } from '@/stores'

const chatStore = useChatStore()

const activeChat = computed(() => chatStore.activeChat)
const hasChats = computed(() => chatStore.hasChats)
</script>

<template>
  <div v-if="hasChats">
    {{ activeChat?.title }}
  </div>
</template>
```

## Getters Pattern

### Computed Getters

Getters are implemented as computed properties:

```typescript
const activeChat = computed(() => {
  if (!activeChatId.value) return null
  return chats.value.find(chat => chat.id === activeChatId.value) ?? null
})
```

### Derived State

```typescript
const chatList = computed<ChatListItem[]>(() => {
  return chats.value
    .map(chat => ({
      id: chat.id,
      title: chat.title,
      // ... transform data
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt)
})
```

## Actions Pattern

### Synchronous Actions

```typescript
function addItem(item: Item) {
  items.value.push(item)
}
```

### Async Actions

```typescript
async function fetchData() {
  loading.value = true
  try {
    const data = await api.fetchData()
    items.value = data
  } catch (error) {
    error.value = error.message
  } finally {
    loading.value = false
  }
}
```

### Actions with Validation

```typescript
function updateItem(id: string, updates: Partial<Item>) {
  const item = items.value.find(i => i.id === id)
  if (!item) {
    throw new Error(`Item ${id} not found`)
  }
  Object.assign(item, updates)
}
```

## Store Composition

### Using Other Stores

```typescript
export const useMessageStore = defineStore('message', () => {
  const apiStore = useApiStore()
  const chatStore = useChatStore()

  async function sendMessage(text: string) {
    if (!apiStore.hasApiKey) {
      throw new Error('API key required')
    }

    const chatId = chatStore.activeChatId
    if (!chatId) {
      throw new Error('No active chat')
    }

    // Send message
  }

  return { sendMessage }
})
```

## State Updates

### Direct Mutation

In Pinia Composition API style, you can directly mutate state:

```typescript
// ✅ Allowed in Pinia
items.value.push(newItem)
items.value[0].name = 'Updated'
```

### Immutable Updates

For complex updates, prefer immutable patterns:

```typescript
// ✅ Better for complex updates
items.value = items.value.map(item => (item.id === id ? { ...item, name: 'Updated' } : item))
```

## Error Handling in Stores

### Action Error Handling

```typescript
async function riskyAction() {
  try {
    await api.call()
  } catch (error) {
    // Log error
    console.error('Action failed:', error)
    // Re-throw for component handling
    throw error
  }
}
```

### Component Error Handling

```typescript
const chatStore = useChatStore()

try {
  await chatStore.riskyAction()
} catch (error) {
  toast.show('Action failed', 'error')
}
```

## Testing Stores

### Store Testing Setup

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach } from 'vitest'

beforeEach(() => {
  setActivePinia(createPinia())
})
```

### Store Test Example

```typescript
import { describe, expect, it } from 'vitest'
import { useChatStore } from '../chat'

describe('useChatStore', () => {
  it('should create chat', () => {
    const store = useChatStore()
    const chat = store.createChat()
    expect(store.chats).toHaveLength(1)
    expect(chat.id).toBeDefined()
  })
})
```

## Best Practices

### ✅ DO

- Use Composition API style
- Keep stores focused (single responsibility)
- Use computed for getters
- Persist important state
- Handle errors in actions
- Use TypeScript types

### ❌ DON'T

- Use Options API style
- Create overly large stores
- Mutate state outside actions (when possible)
- Store UI state in stores
- Ignore errors

## Next Steps

- Review [Stores Reference](../reference/stores.md)
- Study [Development Patterns](./patterns.md)
- Check [Architecture](../reference/architecture.md)

---

**State Management explained!** This architecture provides a clean, maintainable state management solution.
