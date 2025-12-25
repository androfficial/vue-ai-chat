# Architecture

This document provides an overview of the project architecture and structure.

## Project Structure

```
ai-chat/
├── src/
│   ├── assets/
│   │   └── styles/          # Global CSS and themes
│   ├── components/
│   │   ├── chat/           # Chat-related components
│   │   ├── layout/         # Layout components
│   │   ├── settings/        # Settings components
│   │   └── ui/             # Reusable UI components
│   ├── composables/        # Vue composables
│   ├── locales/            # i18n translations
│   ├── pages/              # Page components
│   ├── plugins/            # Vue plugins (router, vuetify, i18n)
│   ├── services/
│   │   └── api/            # API integration
│   ├── stores/             # Pinia stores
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── main.ts             # Application entry point
├── docs/                   # Documentation
├── .cursor/                # Cursor AI rules
└── package.json
```

## Architecture Layers

### 1. Presentation Layer (Components)

**Location**: `src/components/`

- **Chat Components** (`chat/`) - Message display, input, actions
- **Layout Components** (`layout/`) - Sidebar, navigation
- **Settings Components** (`settings/`) - Settings pages
- **UI Components** (`ui/`) - Reusable UI elements

**Pattern**: Vue 3 Composition API with `<script setup>`

### 2. Business Logic Layer (Composables)

**Location**: `src/composables/`

Reusable logic extracted into composables:

- `useChatMessages` - Chat message management
- `useToast` - Toast notifications
- `useAutoScroll` - Auto-scroll behavior
- `useStreamBuffer` - Streaming animation

**Pattern**: Single responsibility, reactive state

### 3. State Management Layer (Stores)

**Location**: `src/stores/`

Pinia stores for global state:

- `chat.ts` - Chat state (chats, messages, active chat)
- `api.ts` - API configuration
- `user.ts` - User preferences

**Pattern**: Composition API style with persistence

### 4. Service Layer (API)

**Location**: `src/services/api/`

API integration:

- `cerebras.ts` - Cerebras AI API client

**Pattern**: Async functions, error handling, streaming support

### 5. Data Layer (Types)

**Location**: `src/types/`

TypeScript type definitions:

- `chat.ts` - Chat-related types
- `message.ts` - Message types
- `api.ts` - API types
- `user.ts` - User types

**Pattern**: Interfaces for objects, types for unions

## Data Flow

### Sending a Message

```
User Input (ChatInput.vue)
    ↓
useChatMessages composable
    ↓
Chat Store (addMessage)
    ↓
API Service (sendStreamingChatCompletion)
    ↓
Streaming Response
    ↓
useStreamBuffer (smooth animation)
    ↓
Chat Store (appendToMessage)
    ↓
Component Update (MessageBubble.vue)
    ↓
localStorage Persistence
```

### State Management Flow

```
Component
    ↓
Composable (useChatMessages)
    ↓
Store (useChatStore)
    ↓
localStorage (persistence)
```

## Key Patterns

### Component Pattern

```vue
<script setup lang="ts">
// 1. Imports (Vue, types, composables, stores)
import { ref } from 'vue'
import type { Message } from '@/types'
import { useToast } from '@/composables'
import { useChatStore } from '@/stores'

// 2. Props and emits
interface Props { ... }
const props = defineProps<Props>()
const emit = defineEmits<{ ... }>()

// 3. Composables and stores
const toast = useToast()
const chatStore = useChatStore()

// 4. State
const isLoading = ref(false)

// 5. Computed
const displayText = computed(() => ...)

// 6. Methods
function handleAction() { ... }
</script>
```

### Store Pattern

```typescript
export const useStore = defineStore('store', () => {
  // 1. State
  const items = ref<Item[]>([])

  // 2. Load from storage
  function loadItems() { ... }

  // 3. Persistence watcher
  watch(items, newItems => { ... }, { deep: true })

  // 4. Getters (computed)
  const itemCount = computed(() => ...)

  // 5. Actions
  function addItem(item: Item) { ... }

  // 6. Return public API
  return { items, itemCount, addItem }
})
```

### Composable Pattern

```typescript
export function useFeature(): UseFeatureReturn {
  // 1. State
  const value = ref('')

  // 2. Computed
  const display = computed(() => ...)

  // 3. Methods
  function doSomething() { ... }

  // 4. Return API
  return { value, display, doSomething }
}
```

## Technology Stack

| Layer     | Technology                |
| --------- | ------------------------- |
| Framework | Vue 3.5 (Composition API) |
| Language  | TypeScript 5.x (strict)   |
| Build     | Vite 7.x                  |
| UI        | Vuetify 3.11              |
| State     | Pinia 3.x                 |
| Routing   | Vue Router 4.x            |
| i18n      | Vue I18n 9.x              |
| Testing   | Vitest + Vue Test Utils   |

## Module Dependencies

```
main.ts
    ↓
App.vue
    ↓
Pages (ChatPage, SettingsPage)
    ↓
Components
    ↓
Composables ← Stores ← Services
    ↓
Utils
```

## Storage Strategy

### localStorage Keys

- `ai-chat:chats` - Chat history
- `ai-chat:api-config` - API configuration
- `ai-chat:preferences` - User preferences

### Persistence Pattern

```typescript
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage'

// Load on store initialization
const items = ref(loadItems())

function loadItems(): Item[] {
  return getStorageItem<Item[]>(STORAGE_KEYS.ITEMS) ?? []
}

// Watch for changes
watch(
  items,
  newItems => {
    setStorageItem(STORAGE_KEYS.ITEMS, newItems)
  },
  { deep: true },
)
```

## Routing

**Location**: `src/plugins/router.ts`

Routes:

- `/` - Chat page (default)
- `/chat/:id` - Specific chat
- `/settings` - Settings page

## Plugin Initialization

**Location**: `src/main.ts`

Initialization order:

1. Create Vue app
2. Register Pinia
3. Register Router
4. Register i18n
5. Register Vuetify
6. Setup error handlers
7. Mount app

## Error Handling

### Global Error Handler

**Location**: `src/utils/errorHandler.ts`

- Catches unhandled errors
- Shows user-friendly messages
- Logs to console

### API Error Handling

**Location**: `src/services/api/cerebras.ts`

- Network errors
- HTTP status codes
- Streaming errors

## Performance Considerations

### Code Splitting

- Route-based code splitting (Vue Router)
- Lazy-loaded components

### Optimization

- Computed properties for derived state
- `watch` with proper options
- Virtual scrolling (if needed)

## Testing Strategy

### Unit Tests

- Composables: `src/composables/__tests__/`
- Utils: `src/utils/__tests__/`
- Stores: `src/stores/__tests__/`

### Component Tests

- Component behavior
- User interactions
- Props and emits

## Build and Deployment

### Development

```bash
npm run dev  # Vite dev server
```

### Production

```bash
npm run build  # Vite build
npm run preview  # Preview build
```

### CI/CD

- GitHub Actions for CI
- Vercel for deployment

## Next Steps

- Review [API Reference](./api-reference.md)
- Study [Development Patterns](../explanation/patterns.md)
- Check [Components Reference](./components.md)

---

**Architecture overview complete!** This structure provides a solid foundation for the application.
