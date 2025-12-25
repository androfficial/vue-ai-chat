---
description: Pinia Store Patterns
globs:
  - '**/stores/**/*.ts'
alwaysApply: false
---

# Pinia Store Guidelines

## Store Structure

Use Composition API style with `setup()`:

```typescript
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Chat } from '@/types'

export const useChatStore = defineStore('chat', () => {
  // State
  const chats = ref<Chat[]>([])
  const activeChatId = ref<string | null>(null)

  // Getters (computed)
  const activeChat = computed(() => chats.value.find(c => c.id === activeChatId.value))

  const chatCount = computed(() => chats.value.length)

  // Actions
  async function createChat(title: string) {
    const newChat: Chat = {
      id: generateId(),
      title,
      messages: [],
      createdAt: Date.now(),
    }
    chats.value.push(newChat)
    activeChatId.value = newChat.id
  }

  async function deleteChat(chatId: string) {
    chats.value = chats.value.filter(c => c.id !== chatId)
  }

  // Return public API
  return {
    // State
    chats,
    activeChatId,
    // Getters
    activeChat,
    chatCount,
    // Actions
    createChat,
    deleteChat,
  }
})
```

## Persistence

Use localStorage for state persistence:

```typescript
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const preferences = ref(loadPreferences())

  function loadPreferences() {
    return getStorageItem<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES) ?? defaultPreferences
  }

  watch(
    preferences,
    newVal => {
      setStorageItem(STORAGE_KEYS.USER_PREFERENCES, newVal)
    },
    { deep: true },
  )

  return { preferences }
})
```

## Async Actions

Handle errors in async actions:

```typescript
async function sendMessage(text: string) {
  try {
    loading.value = true
    const response = await api.sendMessage(text)
    messages.value.push(response)
  } catch (error) {
    console.error('Failed to send message:', error)
    throw error
  } finally {
    loading.value = false
  }
}
```
