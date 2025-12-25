# Development Patterns

This document explains the development patterns and practices used in the project.

## Vue 3 Composition API

### Script Setup Syntax

All components use `<script setup lang="ts">`:

```vue
<script setup lang="ts">
// Component code here
</script>
```

**Benefits:**

- Less boilerplate
- Better TypeScript support
- Automatic exports
- Better performance

### Composition API Patterns

#### Reactive State

```typescript
// Use ref() for primitives
const count = ref(0)

// Use reactive() sparingly for objects
const state = reactive({ name: 'John' })
```

#### Computed Properties

```typescript
const doubleCount = computed(() => count.value * 2)
```

#### Watchers

```typescript
watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`)
})
```

## TypeScript Patterns

### Strict Mode

The project uses TypeScript strict mode with:

- No `any` types
- Strict null checks
- No implicit any

### Type Imports

Always use `import type` for type-only imports:

```typescript
// ✅ Correct
import type { Chat, Message } from '@/types'

// ❌ Wrong
import { Chat, Message } from '@/types'
```

### Interface vs Type

- **Interface** - For object shapes, can be extended
- **Type** - For unions, intersections, primitives

```typescript
// Interface for objects
interface User {
  id: string
  name: string
}

// Type for unions
type Theme = 'light' | 'dark' | 'system'
```

### Barrel Exports

Use `index.ts` files for re-exports:

```typescript
// types/index.ts
export type { Chat } from './chat'
export type { Message } from './message'
```

## Component Patterns

### Props Definition

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
})
</script>
```

### Emits Definition

```vue
<script setup lang="ts">
const emit = defineEmits<{
  update: [value: string]
  click: []
}>()
</script>
```

### Component Structure

1. Imports (Vue, types, composables, stores)
2. Props and emits
3. Composables and stores
4. State
5. Computed
6. Methods
7. Lifecycle hooks

## State Management Patterns

### Pinia Store Pattern

```typescript
export const useStore = defineStore('store', () => {
  // 1. State
  const items = ref<Item[]>([])

  // 2. Load from storage
  function loadItems() { ... }

  // 3. Persistence
  watch(items, newItems => { ... }, { deep: true })

  // 4. Getters (computed)
  const itemCount = computed(() => items.value.length)

  // 5. Actions
  function addItem(item: Item) { ... }

  // 6. Return public API
  return { items, itemCount, addItem }
})
```

### Composable Pattern

```typescript
export function useFeature(): UseFeatureReturn {
  // State
  const value = ref('')

  // Computed
  const display = computed(() => ...)

  // Methods
  function doSomething() { ... }

  // Return API
  return { value, display, doSomething }
}
```

## Styling Patterns

### Vuetify Utilities

Prefer Vuetify utility classes:

```vue
<!-- ✅ Good -->
<div class="d-flex flex-column ga-4 pa-4">
  <v-card rounded="lg">
    <v-card-title class="text-h5">Title</v-card-title>
  </v-card>
</div>

<!-- ❌ Bad -->
<div style="display: flex; flex-direction: column; gap: 16px; padding: 16px;">
  <div style="border-radius: 8px;">
    <h2 style="font-size: 24px;">Title</h2>
  </div>
</div>
```

### Scoped Styles

Use `<style scoped>` for component-specific styles:

```vue
<style scoped>
.component-class {
  /* Component styles */
}
</style>
```

### CSS Custom Properties

Use CSS variables for theming:

```css
:root {
  --color-primary: #1976d2;
}

.v-theme--dark {
  --color-primary: #90caf9;
}
```

## Error Handling Patterns

### Try-Catch Pattern

```typescript
async function handleAction() {
  try {
    loading.value = true
    await someAsyncOperation()
    toast.show('Success!', 'success')
  } catch (error) {
    console.error('Action failed:', error)
    toast.show('Failed to complete action', 'error')
  } finally {
    loading.value = false
  }
}
```

### Error Types

```typescript
try {
  await apiCall()
} catch (error) {
  if (error instanceof TypeError) {
    // Network error
  } else if (error.response?.status === 401) {
    // Unauthorized
  } else {
    // Generic error
  }
}
```

## Import Organization

### ESLint Perfectionist

Imports are sorted alphabetically in groups:

1. Vue core (`vue`, `vue-router`, `pinia`)
2. Internal (`@/components`, `@/composables`, `@/stores`)
3. Assets (`@/assets/styles`)

### Import Order Example

```typescript
// 1. Vue core
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 2. Internal
import type { Chat } from '@/types'
import { useToast } from '@/composables'
import { useChatStore } from '@/stores'

// 3. Assets
import '@/assets/styles/global.css'
```

## Testing Patterns

### Component Testing

```typescript
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('should render props', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test' },
    })
    expect(wrapper.text()).toContain('Test')
  })
})
```

### Composable Testing

```typescript
import { describe, expect, it } from 'vitest'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('should increment', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })
})
```

## Code Organization

### File Naming

- Components: `PascalCase.vue` (e.g., `ChatInput.vue`)
- Composables: `useFeature.ts` (e.g., `useToast.ts`)
- Stores: `camelCase.ts` (e.g., `chat.ts`)
- Utils: `camelCase.ts` (e.g., `date.ts`)

### Directory Structure

```
src/
├── components/
│   ├── chat/        # Feature-based grouping
│   ├── layout/
│   └── settings/
├── composables/     # Reusable logic
├── stores/          # State management
└── utils/           # Utilities
```

## Best Practices

### ✅ DO

- Use Composition API
- Use TypeScript strict mode
- Use `import type` for types
- Use Vuetify utilities
- Handle errors gracefully
- Write tests
- Add JSDoc comments
- Use barrel exports

### ❌ DON'T

- Use Options API
- Use `any` types
- Use inline styles
- Mutate props directly
- Ignore errors
- Skip type definitions
- Create overly complex components

## Next Steps

- Review [State Management](./state-management.md)
- Study [Streaming](./streaming.md)
- Check [Architecture](../reference/architecture.md)

---

**Patterns documented!** Follow these patterns for consistent, maintainable code.
