---
description: Vue 3 Component Development Guidelines
globs:
  - '**/*.vue'
alwaysApply: false
---

# Vue 3 Component Guidelines

## Component Structure

Always use this structure:

```vue
<script setup lang="ts">
/**
 * Component description here
 */
import { ref } from 'vue'

interface Props {
  title: string
  count?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  update: [value: string]
}>()
</script>

<template>
  <!-- Template here -->
</template>

<style scoped>
/* Scoped styles here */
</style>
```

## Props & Emits

- **Props**: Use TypeScript interface with `defineProps<Props>()`
- **Emits**: Use tuple syntax with `defineEmits<{ eventName: [type] }>()`
- **No runtime validation**: Rely on TypeScript types

## Composables Usage

- Extract reusable logic to composables (`use*.ts`)
- Import composables at the top
- Call composables in setup scope

Example:

```typescript
import { useChatMessages, useToast } from '@/composables'

const { messages, sendMessage } = useChatMessages()
const toast = useToast()
```

## Lifecycle

- `onMounted()` - after component is mounted
- `onUnmounted()` - cleanup (remove listeners, clear intervals)
- `watch()` - reactive side effects
- `watchEffect()` - auto-track dependencies

## Component Communication

- **Props down**: Parent → Child via props
- **Events up**: Child → Parent via emits
- **Provide/Inject**: Cross-component (use sparingly)
- **Stores**: Global state via Pinia
