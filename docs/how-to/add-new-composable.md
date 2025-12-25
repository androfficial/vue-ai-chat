# Creating a New Composable

This guide explains how to create a new Vue composable function following the project's patterns.

## What is a Composable?

A composable is a reusable function that uses Vue's Composition API to encapsulate and reuse stateful logic. In this project, composables are located in `src/composables/`.

## Composable Structure

All composables follow this structure:

```typescript
import { ref } from 'vue'

export interface UseYourComposableReturn {
  // Return type interface
  value: Ref<string>
  setValue: (val: string) => void
}

/**
 * useYourComposable - Brief description
 * @returns Composable return object
 */
export function useYourComposable(): UseYourComposableReturn {
  // State
  const value = ref('')

  // Methods
  function setValue(val: string) {
    value.value = val
  }

  // Return public API
  return {
    value,
    setValue,
  }
}
```

## Step-by-Step Guide

### Step 1: Create Composable File

Create a new file in `src/composables/`:

```bash
touch src/composables/useYourComposable.ts
```

**Naming convention**: `use[Feature].ts` (e.g., `useToast.ts`, `useChatMessages.ts`)

### Step 2: Write Composable Code

```typescript
import type { Ref } from 'vue'

import { computed, ref } from 'vue'

export interface UseCounterReturn {
  count: Ref<number>
  doubleCount: Ref<number>
  increment: () => void
  decrement: () => void
  reset: () => void
}

/**
 * useCounter - Simple counter composable
 * @param initialValue - Initial counter value
 * @returns Counter composable API
 */
export function useCounter(initialValue = 0): UseCounterReturn {
  // State
  const count = ref(initialValue)

  // Computed
  const doubleCount = computed(() => count.value * 2)

  // Methods
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initialValue
  }

  // Return public API
  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset,
  }
}
```

### Step 3: Export from Index

Add to `src/composables/index.ts`:

```typescript
export { useCounter } from './useCounter'
export type { UseCounterReturn } from './useCounter'
```

### Step 4: Use in Components

```vue
<script setup lang="ts">
import { useCounter } from '@/composables'

const { count, doubleCount, increment, decrement } = useCounter(10)
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <v-btn @click="increment">+</v-btn>
    <v-btn @click="decrement">-</v-btn>
  </div>
</template>
```

## Best Practices

### ✅ DO

- **Single Responsibility** - Each composable should do one thing well
- **Return Interface** - Define return type interface
- **JSDoc Comments** - Document complex composables
- **Reactive State** - Use `ref()` or `reactive()` for state
- **Computed Properties** - Use `computed()` for derived state
- **Type Safety** - Use TypeScript types throughout

### ❌ DON'T

- **Too Broad** - Don't create a "do everything" composable
- **Side Effects** - Avoid side effects in composables (use lifecycle hooks)
- **Direct DOM Manipulation** - Use template refs instead
- **Global State** - Use Pinia stores for global state, not composables

## Common Patterns

### Using Other Composables

```typescript
import { useToast } from './useToast'
import { useChatStore } from '@/stores'

export function useChatActions() {
  const toast = useToast()
  const chatStore = useChatStore()

  async function sendMessage(text: string) {
    try {
      await chatStore.sendMessage(text)
      toast.show('Message sent', 'success')
    } catch (error) {
      toast.show('Failed to send', 'error')
    }
  }

  return { sendMessage }
}
```

### Using Lifecycle Hooks

```typescript
import { onMounted, onUnmounted, ref } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  function updateSize() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', updateSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
  })

  return { width, height }
}
```

### Using Watchers

```typescript
import { ref, watch } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay = 300) {
  const debouncedValue = ref(value.value) as Ref<T>

  let timeoutId: ReturnType<typeof setTimeout>

  watch(value, newValue => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return { debouncedValue }
}
```

## Example: Complete Composable

Here's a complete example of a clipboard composable:

```typescript
import type { Ref } from 'vue'

import { ref } from 'vue'

import { useToast } from './useToast'

export interface UseClipboardReturn {
  isSupported: boolean
  copied: Ref<boolean>
  copy: (text: string) => Promise<void>
}

/**
 * useClipboard - Copy text to clipboard
 * @returns Clipboard composable API
 */
export function useClipboard(): UseClipboardReturn {
  const toast = useToast()
  const copied = ref(false)

  const isSupported = typeof navigator !== 'undefined' && 'clipboard' in navigator

  async function copy(text: string) {
    if (!isSupported) {
      toast.show('Clipboard not supported', 'error')
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      toast.show('Copied to clipboard', 'success')

      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (error) {
      toast.show('Failed to copy', 'error')
      console.error('Clipboard error:', error)
    }
  }

  return {
    isSupported,
    copied,
    copy,
  }
}
```

## Testing Composables

Create a test file:

```typescript
// src/composables/__tests__/useCounter.test.ts
import { describe, expect, it } from 'vitest'

import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('should initialize with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('should increment count', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })

  it('should compute double count', () => {
    const { count, doubleCount, increment } = useCounter(5)
    increment()
    expect(doubleCount.value).toBe(12) // (5 + 1) * 2
  })
})
```

## Project Composables Reference

Existing composables in the project:

- `useChatMessages` - Chat message management with streaming
- `useToast` - Toast notifications
- `useAutoScroll` - Auto-scroll functionality
- `useStreamBuffer` - Streaming animation buffer
- `useClipboard` - Clipboard operations
- `useAutoResizeTextarea` - Auto-resize textarea
- `useDateFormatter` - Date formatting
- `useHead` - Document head management
- `useMarkdownRenderer` - Markdown rendering

## Next Steps

- Learn about [Creating a New Store](./add-new-store.md)
- Review [Composables Reference](../reference/composables.md)
- Study [Development Patterns](../explanation/patterns.md)

---

**Composable created!** Your composable is ready to use across the application.
