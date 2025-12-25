# Creating a New Store

This guide explains how to create a new Pinia store following the project's patterns.

## What is a Store?

A Pinia store is a centralized state management solution. In this project, stores are located in `src/stores/` and use the Composition API style.

## Store Structure

All stores follow this structure:

```typescript
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useYourStore = defineStore('yourStore', () => {
  // State
  const items = ref<Item[]>([])

  // Getters (computed)
  const itemCount = computed(() => items.value.length)

  // Actions
  function addItem(item: Item) {
    items.value.push(item)
  }

  // Return public API
  return {
    // State
    items,
    // Getters
    itemCount,
    // Actions
    addItem,
  }
})
```

## Step-by-Step Guide

### Step 1: Create Store File

Create a new file in `src/stores/`:

```bash
touch src/stores/yourStore.ts
```

**Naming convention**: Use camelCase (e.g., `chat.ts`, `api.ts`, `user.ts`)

### Step 2: Write Store Code

```typescript
import type { Item } from '@/types'

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage'

export interface ItemState {
  items: Item[]
  selectedId: string | null
}

export const useItemStore = defineStore('item', () => {
  // State
  const items = ref<Item[]>(loadItems())
  const selectedId = ref<string | null>(null)

  function loadItems(): Item[] {
    return getStorageItem<Item[]>(STORAGE_KEYS.ITEMS) ?? []
  }

  // Persistence
  watch(
    items,
    newItems => {
      setStorageItem(STORAGE_KEYS.ITEMS, newItems)
    },
    { deep: true },
  )

  // Getters (computed)
  const selectedItem = computed(() => {
    if (!selectedId.value) return null
    return items.value.find(item => item.id === selectedId.value) ?? null
  })

  const itemCount = computed(() => items.value.length)

  // Actions
  function addItem(item: Item) {
    items.value.push(item)
  }

  function removeItem(id: string) {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  function selectItem(id: string | null) {
    selectedId.value = id
  }

  // Return public API
  return {
    // State
    items,
    selectedId,
    // Getters
    selectedItem,
    itemCount,
    // Actions
    addItem,
    removeItem,
    selectItem,
  }
})
```

### Step 3: Export from Index

Add to `src/stores/index.ts`:

```typescript
export { useItemStore } from './yourStore'
```

### Step 4: Use in Components

```vue
<script setup lang="ts">
import { useItemStore } from '@/stores'

const itemStore = useItemStore()

function handleAdd() {
  itemStore.addItem({ id: '1', name: 'New Item' })
}
</script>

<template>
  <div>
    <p>Count: {{ itemStore.itemCount }}</p>
    <v-btn @click="handleAdd">Add Item</v-btn>
  </div>
</template>
```

## Best Practices

### ✅ DO

- **Composition API Style** - Use `setup()` function syntax
- **TypeScript Types** - Define types for state and return values
- **Computed Getters** - Use `computed()` for derived state
- **Persistence** - Use `watch()` with localStorage for persistence
- **Single Responsibility** - Each store should manage one domain
- **Alphabetical Sorting** - Sort return values alphabetically

### ❌ DON'T

- **Options API** - Don't use Options API style
- **Direct Mutations** - Don't mutate state outside actions
- **Global State in Composables** - Use stores for global state
- **Circular Dependencies** - Avoid stores importing each other

## Common Patterns

### Persistence with localStorage

```typescript
import { watch } from 'vue'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const preferences = ref(loadPreferences())

  function loadPreferences() {
    return getStorageItem<UserPreferences>(STORAGE_KEYS.PREFERENCES) ?? defaultPreferences
  }

  watch(
    preferences,
    newPrefs => {
      setStorageItem(STORAGE_KEYS.PREFERENCES, newPrefs)
    },
    { deep: true },
  )

  return { preferences }
})
```

### Async Actions

```typescript
export const useApiStore = defineStore('api', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchData() {
    loading.value = true
    error.value = null

    try {
      const data = await api.fetchData()
      // Handle data
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
import { useApiStore } from './api'
import { useChatStore } from './chat'

export const useMessageStore = defineStore('message', () => {
  const apiStore = useApiStore()
  const chatStore = useChatStore()

  async function sendMessage(text: string) {
    if (!apiStore.hasApiKey) {
      throw new Error('API key not configured')
    }

    const chatId = chatStore.activeChatId
    if (!chatId) {
      throw new Error('No active chat')
    }

    // Send message logic
  }

  return { sendMessage }
})
```

## Example: Complete Store

Here's a complete example based on the chat store pattern:

```typescript
import type { Notification } from '@/types'

import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { now } from '@/utils/date'
import { generateId } from '@/utils/id'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>(loadNotifications())

  function loadNotifications(): Notification[] {
    return getStorageItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) ?? []
  }

  // Persistence
  watch(
    notifications,
    newNotifications => {
      setStorageItem(STORAGE_KEYS.NOTIFICATIONS, newNotifications)
    },
    { deep: true },
  )

  // Getters
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })

  const recentNotifications = computed(() => {
    return [...notifications.value].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10)
  })

  // Actions
  function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: now(),
    }
    notifications.value.unshift(newNotification)
  }

  function markAsRead(id: string) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  // Return public API
  return {
    // State
    notifications,
    // Getters
    unreadCount,
    recentNotifications,
    // Actions
    addNotification,
    markAsRead,
    removeNotification,
    clearAll,
  }
})
```

## Testing Stores

Create a test file:

```typescript
// src/stores/__tests__/item.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it, beforeEach } from 'vitest'

import { useItemStore } from '../item'

describe('useItemStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should add item', () => {
    const store = useItemStore()
    store.addItem({ id: '1', name: 'Test' })
    expect(store.items).toHaveLength(1)
  })

  it('should compute item count', () => {
    const store = useItemStore()
    store.addItem({ id: '1', name: 'Test' })
    expect(store.itemCount).toBe(1)
  })
})
```

## Project Stores Reference

Existing stores in the project:

- `chat.ts` - Chat state management (chats, messages, active chat)
- `api.ts` - API configuration (API key, model, settings)
- `user.ts` - User preferences (theme, language, behavior)

## Next Steps

- Learn about [Configuring API](./configure-api.md)
- Review [Stores Reference](../reference/stores.md)
- Study [State Management](../explanation/state-management.md)

---

**Store created!** Your store is ready to manage application state.
