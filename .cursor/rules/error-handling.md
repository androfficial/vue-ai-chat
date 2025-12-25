---
description: Error Handling and User Feedback
globs:
  - '**/*.ts'
  - '**/*.vue'
alwaysApply: false
---

# Error Handling Guidelines

## Try-Catch Pattern

Always wrap async operations in try-catch:

```typescript
import { useToast } from '@/composables'

const toast = useToast()
const loading = ref(false)

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

## Error Types

Handle different error types appropriately:

```typescript
try {
  await apiCall()
} catch (error) {
  if (error instanceof TypeError) {
    // Network error
    toast.show('Network error. Check connection.', 'error')
  } else if (error.response?.status === 401) {
    // Unauthorized
    toast.show('Invalid credentials', 'error')
  } else if (error.response?.status === 429) {
    // Rate limit
    toast.show('Too many requests. Please wait.', 'warning')
  } else {
    // Generic error
    toast.show('Something went wrong', 'error')
  }
}
```

## Loading States

Always show loading indicators:

```vue
<template>
  <v-btn
    :loading="loading"
    :disabled="loading"
    @click="handleAction"
  >
    {{ loading ? 'Loading...' : 'Submit' }}
  </v-btn>
</template>

<script setup lang="ts">
const loading = ref(false)

async function handleAction() {
  loading.value = true
  try {
    await action()
  } finally {
    loading.value = false
  }
}
</script>
```

## User Feedback

Use toast notifications for user feedback:

```typescript
// Success
toast.show('Message sent successfully', 'success')

// Error
toast.show('Failed to send message', 'error')

// Warning
toast.show('API key is missing', 'warning')

// Info
toast.show('Chat saved', 'info')
```

## Global Error Handler

Configured in `main.ts`:

```typescript
import { setupGlobalErrorHandler } from '@/utils/errorHandler'

setupGlobalErrorHandler(app, { i18n })
```

## Validation

Validate user input before processing:

```typescript
import { validateApiKey, validateMessage } from '@/utils/validation'

function handleSubmit() {
  if (!validateMessage(message.value)) {
    toast.show('Message cannot be empty', 'warning')
    return
  }

  // Process valid input
}
```
