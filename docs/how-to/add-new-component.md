# Adding a New Component

This guide will walk you through creating a new Vue component following the project's patterns and conventions.

## Component Structure

All components in this project follow a consistent structure:

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

## Step-by-Step Guide

### Step 1: Choose Component Location

Components are organized by feature:

- `components/chat/` - Chat-related components
- `components/layout/` - Layout components (sidebar, navigation)
- `components/settings/` - Settings page components
- `components/ui/` - Reusable UI components

**Example**: Creating a new chat feature component → `components/chat/YourComponent.vue`

### Step 2: Create Component File

Create a new `.vue` file in the appropriate directory:

```bash
touch src/components/chat/YourComponent.vue
```

### Step 3: Write Component Code

```vue
<script setup lang="ts">
/**
 * YourComponent - Brief description of what this component does
 */
import { computed, ref } from 'vue'

interface Props {
  /** Component title */
  title: string
  /** Optional count value */
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

const emit = defineEmits<{
  /** Emitted when value changes */
  update: [value: string]
  /** Emitted on click */
  click: []
}>()

// Component state
const isVisible = ref(true)

// Computed properties
const displayText = computed(() => {
  return `${props.title}: ${props.count}`
})

// Methods
function handleClick() {
  emit('click')
  emit('update', 'new value')
}
</script>

<template>
  <v-card
    v-if="isVisible"
    rounded="lg"
    class="pa-4"
  >
    <v-card-title>{{ displayText }}</v-card-title>
    <v-card-text>
      <v-btn
        color="primary"
        @click="handleClick"
      >
        Click Me
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Component-specific styles */
.your-component {
  /* Use Vuetify utilities when possible */
}
</style>
```

### Step 4: Use Vuetify Components

Prefer Vuetify components and utilities:

```vue
<template>
  <!-- ✅ Good - Vuetify components -->
  <v-card
    rounded="lg"
    class="pa-4"
  >
    <v-card-title class="text-h5">Title</v-card-title>
    <v-card-text class="d-flex flex-column ga-2">
      <v-btn color="primary">Action</v-btn>
    </v-card-text>
  </v-card>

  <!-- ❌ Bad - Custom HTML with inline styles -->
  <div style="border-radius: 8px; padding: 16px;">
    <h2 style="font-size: 24px;">Title</h2>
  </div>
</template>
```

### Step 5: Import and Use

Import the component where needed:

```vue
<script setup lang="ts">
import YourComponent from '@/components/chat/YourComponent.vue'
</script>

<template>
  <YourComponent
    title="Hello"
    :count="5"
    @update="handleUpdate"
    @click="handleClick"
  />
</template>
```

## Best Practices

### ✅ DO

- Use `<script setup lang="ts">` syntax
- Define props with TypeScript interfaces
- Use `import type` for type-only imports
- Add JSDoc comments for complex components
- Use Vuetify utility classes
- Keep components focused (single responsibility)
- Use scoped styles

### ❌ DON'T

- Use Options API
- Use `any` types
- Import types without `import type`
- Use inline styles
- Mutate props directly
- Create overly complex components

## Component Patterns

### Using Composables

```vue
<script setup lang="ts">
import { useToast } from '@/composables'
import { useChatStore } from '@/stores'

const toast = useToast()
const chatStore = useChatStore()

function handleAction() {
  try {
    chatStore.doSomething()
    toast.show('Success!', 'success')
  } catch (error) {
    toast.show('Error occurred', 'error')
  }
}
</script>
```

### Using Stores

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useChatStore } from '@/stores'

const chatStore = useChatStore()

const activeChat = computed(() => chatStore.activeChat)
const hasChats = computed(() => chatStore.hasChats)
</script>
```

### Using i18n

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <h1>{{ $t('common.title') }}</h1>
  <p>{{ t('common.description') }}</p>
</template>
```

## Testing

Create a test file for your component:

```typescript
// src/components/chat/__tests__/YourComponent.test.ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import YourComponent from '../YourComponent.vue'

describe('YourComponent', () => {
  it('should render props', () => {
    const wrapper = mount(YourComponent, {
      props: { title: 'Test', count: 5 },
    })

    expect(wrapper.text()).toContain('Test')
  })

  it('should emit events', async () => {
    const wrapper = mount(YourComponent, {
      props: { title: 'Test' },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

## Example: Complete Component

Here's a complete example of a chat action button component:

```vue
<script setup lang="ts">
/**
 * ChatActionButton - Reusable button for chat actions
 */
import { computed } from 'vue'

interface Props {
  /** Button label */
  label: string
  /** Icon name (Material Design Icons) */
  icon?: string
  /** Button color */
  color?: 'primary' | 'secondary' | 'error'
  /** Disabled state */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'mdi-help',
  color: 'primary',
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

const iconClass = computed(() => `mdi-${props.icon}`)

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<template>
  <v-btn
    :color="color"
    :disabled="disabled"
    variant="text"
    size="small"
    @click="handleClick"
  >
    <v-icon
      :icon="icon"
      size="16"
      class="mr-2"
    />
    {{ label }}
  </v-btn>
</template>

<style scoped>
/* No custom styles needed - using Vuetify utilities */
</style>
```

## Next Steps

- Learn about [Creating a New Composable](./add-new-composable.md)
- Review [Component Reference](../reference/components.md)
- Study [Development Patterns](../explanation/patterns.md)

---

**Component created!** Your component is now ready to use throughout the application.
