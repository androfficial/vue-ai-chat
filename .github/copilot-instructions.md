# AI Chat - Copilot Instructions

## Architecture Overview

Vue 3 + TypeScript chat app with Cerebras AI integration. Uses Composition API with `<script setup>`, Pinia for state, Vuetify 3 for UI, and Vue I18n for localization.

**Data flow:** User input → `useChatMessages` composable → `cerebras.ts` service (streaming) → Pinia stores → localStorage persistence.

## Project Structure

- **`src/stores/`** - Pinia stores with localStorage sync (`chat.ts`, `api.ts`, `user.ts`)
- **`src/composables/`** - Reusable logic:
  - `useChatMessages` - Chat messaging with streaming
  - `useAutoScroll` - Auto-scroll to bottom
  - `useStreamBuffer` - Smooth word-by-word animation
  - `useMarkdownRenderer` - Markdown to HTML with syntax highlighting
  - `useAutoResizeTextarea` - Dynamic textarea height
  - `useClipboard` - Copy to clipboard
  - `useToast` - Toast notifications
  - `useDateFormatter` - Date formatting
  - `useHead` - Document head management
- **`src/services/api/`** - API clients with streaming support
- **`src/types/`** - TypeScript interfaces, barrel-exported via `index.ts`
- **`src/locales/`** - i18n translations (EN/UK)
- **`src/utils/`** - Utility functions (`storage.ts`, `validation.ts`, `date.ts`, `id.ts`, `errorHandler.ts`)

## Code Conventions

### Vue Components

- Use `<script setup lang="ts">` with block order: script → template → style
- Define props/emits with TypeScript: `defineProps<Props>()`, `defineEmits<{ event: [payload: Type] }>()`
- Use PascalCase for component names in templates
- Add JSDoc comment at top of `<script setup>` describing the component

### TypeScript

- **Type imports required:** `import type { Chat } from '@/types'`
- Use barrel exports from `@/types`, `@/composables`, `@/stores`
- Prefix unused params with `_` (e.g., `_event`)

### Sorting (enforced by ESLint Perfectionist)

- Imports: type imports first, then external, internal, relative
- Object keys, interface properties, named exports: alphabetical
- Store return objects: getters first, then state, then actions

### i18n

- All user-facing text via `$t('key')` or `t('key')` from `useI18n()`
- Keys follow nested structure: `chat.emptyState.title`, `errors.networkError`
- Add translations to both `src/locales/en.ts` and `src/locales/uk.ts`

## Key Patterns

### State Management

```typescript
// Stores use setup syntax with localStorage persistence
export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>(loadChats())
  watch(chats, newChats => setStorageItem(STORAGE_KEYS.CHATS, newChats), { deep: true })
  // Return: getters first, state, actions (alphabetically sorted)
})
```

### Streaming API Calls

```typescript
// Use AbortController for cancellation
const abortController = ref<AbortController | null>(null)
await sendStreamingChatCompletion(messages, { signal: abortController.value?.signal })
```

### Composables

- Prefix with `use` (e.g., `useAutoScroll`)
- Export type for return value: `export type UseFooReturn = { ... }`
- Return refs and methods as object (alphabetically sorted)

## Commands

```bash
npm run dev        # Start dev server (port 5173)
npm run build      # Type-check + build
npm run lint       # ESLint with auto-fix
npm run lint:css   # Stylelint with auto-fix
npm run format     # Prettier formatting
npm run type-check # TypeScript validation only
```

## Storage Keys

All localStorage uses prefixed keys defined in `src/utils/storage.ts`:

- `ai-chat:chats` - Chat history
- `ai-chat:api-config` - API settings
- `ai-chat:preferences` - User preferences
