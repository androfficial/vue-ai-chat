# Composables Reference

Complete reference for all Vue composables in the project.

## Chat Composables

### `useChatMessages`

Manage chat messages with AI streaming responses.

**Location**: `src/composables/useChatMessages.ts`

**Returns:**

```typescript
interface UseChatMessagesReturn {
  abortController: Ref<AbortController | null>
  isLoading: Ref<boolean>
  regenerateMessage: (chatId: string, assistantMessageId: string) => Promise<void>
  sendMessage: (chatId: string, content: string, skipAddUserMessage?: boolean) => Promise<void>
  stopGeneration: () => void
}
```

**Example:**

```typescript
const { sendMessage, isLoading, stopGeneration } = useChatMessages()

await sendMessage(chatId, 'Hello!')
```

**Features:**

- Streaming message handling
- Error handling with localized messages
- Message regeneration
- Abort support

### `useStreamBuffer`

Smooth character-by-character animation buffer for streaming.

**Location**: `src/composables/useStreamBuffer.ts`

**Options:**

```typescript
interface UseStreamBufferOptions {
  onFlush: (text: string) => void
  wordDelay?: number
}
```

**Returns:**

```typescript
interface UseStreamBufferReturn {
  push: (text: string) => void
  flushImmediate: () => void
  start: () => void
  stop: () => void
}
```

**Example:**

```typescript
const buffer = useStreamBuffer({
  onFlush: text => {
    // Append text to message
    appendToMessage(text)
  },
  wordDelay: 50,
})

buffer.start()
buffer.push('Hello ')
buffer.push('world!')
```

## UI Composables

### `useToast`

Toast notification system.

**Location**: `src/composables/useToast.ts`

**Returns:**

```typescript
interface UseToastReturn {
  isVisible: Ref<boolean>
  message: Ref<string>
  type: Ref<'success' | 'error' | 'info' | 'warning'>
  timeout: Ref<number>
  show: (message: string, type?: ToastType, timeout?: number) => void
  hide: () => void
}
```

**Example:**

```typescript
const toast = useToast()

toast.show('Message sent!', 'success')
toast.show('Error occurred', 'error')
```

### `useAutoScroll`

Auto-scroll container to bottom.

**Location**: `src/composables/useAutoScroll.ts`

**Options:**

```typescript
interface UseAutoScrollOptions {
  smooth?: boolean
  threshold?: number
}
```

**Returns:**

```typescript
interface UseAutoScrollReturn {
  containerRef: Ref<HTMLElement | null>
  handleScroll: () => void
  isAtBottom: Ref<boolean>
  scrollToBottom: (smooth?: boolean) => void
}
```

**Example:**

```vue
<script setup lang="ts">
import { useAutoScroll } from '@/composables'

const { containerRef, scrollToBottom } = useAutoScroll({
  smooth: true,
  threshold: 150,
})
</script>

<template>
  <div
    ref="containerRef"
    @scroll="handleScroll"
  >
    <!-- Content -->
  </div>
</template>
```

### `useAutoResizeTextarea`

Auto-resize textarea based on content.

**Location**: `src/composables/useAutoResizeTextarea.ts`

**Options:**

```typescript
interface UseAutoResizeTextareaOptions {
  minRows?: number
  maxRows?: number
}
```

**Returns:**

```typescript
interface UseAutoResizeTextareaReturn {
  textareaRef: Ref<HTMLTextAreaElement | null>
  reset: () => void
}
```

**Example:**

```vue
<script setup lang="ts">
import { useAutoResizeTextarea } from '@/composables'

const { textareaRef } = useAutoResizeTextarea({
  minRows: 1,
  maxRows: 10,
})
</script>

<template>
  <textarea ref="textareaRef" />
</template>
```

## Utility Composables

### `useClipboard`

Copy text to clipboard.

**Location**: `src/composables/useClipboard.ts`

**Returns:**

```typescript
interface UseClipboardReturn {
  isSupported: boolean
  copied: Ref<boolean>
  copy: (text: string) => Promise<void>
}
```

**Example:**

```typescript
const { copy, copied, isSupported } = useClipboard()

await copy('Text to copy')
if (copied.value) {
  console.log('Copied!')
}
```

### `useDateFormatter`

Date formatting utilities.

**Location**: `src/composables/useDateFormatter.ts`

**Returns:**

```typescript
interface UseDateFormatterReturn {
  formatDateGroup: (timestamp: number) => string
  getTimeDiffFormatted: (timestamp: number) => string
  locale: Ref<string>
}
```

**Example:**

```typescript
const { formatDateGroup, getTimeDiffFormatted } = useDateFormatter()

const group = formatDateGroup(Date.now()) // "Today"
const diff = getTimeDiffFormatted(timestamp) // "2 hours ago"
```

### `useHead`

Manage document head (title, description, lang).

**Location**: `src/composables/useHead.ts`

**Example:**

```typescript
useHead() // Automatically updates head based on route
```

### `useMarkdownRenderer`

Markdown rendering with syntax highlighting.

**Location**: `src/composables/useMarkdownRenderer.ts`

**Returns:**

```typescript
interface MarkdownRendererReturn {
  render: (markdown: string) => ParsedBlock[]
  renderInline: (markdown: string) => string
}
```

**Types:**

```typescript
type ParsedBlock = HtmlBlockData | CodeBlockData

interface HtmlBlockData {
  type: 'html'
  content: string
}

interface CodeBlockData {
  type: 'code'
  code: string
  language?: string
}
```

**Example:**

````typescript
const { render } = useMarkdownRenderer()

const blocks = render('# Hello\n\n```js\nconsole.log("hi")\n```')
// Returns array of parsed blocks
````

## Composable Patterns

### Basic Composable Structure

```typescript
export interface UseFeatureReturn {
  value: Ref<string>
  setValue: (val: string) => void
}

export function useFeature(): UseFeatureReturn {
  const value = ref('')

  function setValue(val: string) {
    value.value = val
  }

  return { value, setValue }
}
```

### Using Other Composables

```typescript
export function useFeature() {
  const toast = useToast()
  const chatStore = useChatStore()

  function doSomething() {
    try {
      chatStore.action()
      toast.show('Success', 'success')
    } catch (error) {
      toast.show('Error', 'error')
    }
  }

  return { doSomething }
}
```

### Lifecycle Hooks

```typescript
export function useFeature() {
  const value = ref('')

  onMounted(() => {
    // Setup
  })

  onUnmounted(() => {
    // Cleanup
  })

  return { value }
}
```

### Watchers

```typescript
export function useFeature() {
  const value = ref('')
  const debounced = ref('')

  watch(
    value,
    newValue => {
      // Handle change
    },
    { debounce: 300 },
  )

  return { value, debounced }
}
```

## Testing Composables

```typescript
import { describe, expect, it } from 'vitest'
import { useFeature } from '../useFeature'

describe('useFeature', () => {
  it('should work correctly', () => {
    const { value, setValue } = useFeature()
    setValue('test')
    expect(value.value).toBe('test')
  })
})
```

## Next Steps

- Review [Creating Composables Guide](../how-to/add-new-composable.md)
- Study [Development Patterns](../explanation/patterns.md)
- Check [Architecture](./architecture.md)

---

**Composables Reference complete!** Use this reference when working with composables.
