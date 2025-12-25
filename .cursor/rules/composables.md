---
description: Vue Composables Patterns
globs:
  - '**/composables/**/*.ts'
alwaysApply: false
---

# Composables Guidelines

## Naming Convention

- File: `use[Feature].ts` (e.g., `useToast.ts`)
- Function: `use[Feature]()` (e.g., `useToast()`)

## Structure

Return reactive state and methods:

```typescript
import { ref } from 'vue'

export function useToast() {
  const message = ref('')
  const isVisible = ref(false)
  const type = ref<'success' | 'error' | 'info' | 'warning'>('info')

  function show(msg: string, toastType = 'info') {
    message.value = msg
    type.value = toastType
    isVisible.value = true
  }

  function hide() {
    isVisible.value = false
  }

  return {
    // State
    message,
    isVisible,
    type,
    // Methods
    show,
    hide,
  }
}
```

## Single Responsibility

Each composable should have one clear purpose:

- ✅ `useToast()` - toast notifications
- ✅ `useChatMessages()` - chat message management
- ✅ `useAutoScroll()` - auto-scroll behavior
- ❌ `useEverything()` - too broad

## Composable Composition

Composables can use other composables:

```typescript
import { useToast } from './useToast'
import { useChatStore } from '@/stores'

export function useChatMessages() {
  const toast = useToast()
  const chatStore = useChatStore()

  async function sendMessage(text: string) {
    try {
      await chatStore.sendMessage(text)
    } catch (error) {
      toast.show('Failed to send message', 'error')
    }
  }

  return { sendMessage }
}
```

## Barrel Exports

Re-export from `composables/index.ts`:

```typescript
export { useToast } from './useToast'
export { useChatMessages } from './useChatMessages'
export { useAutoScroll } from './useAutoScroll'
```
