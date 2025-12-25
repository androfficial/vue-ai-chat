# Components Reference

Complete reference for all Vue components in the project.

## Chat Components

### `ChatInput.vue`

Message input component with auto-resize.

**Location**: `src/components/chat/ChatInput.vue`

**Props:**

- `disabled?: boolean` - Disable input
- `loading?: boolean` - Show loading state
- `placeholder?: string` - Input placeholder

**Emits:**

- `send: [content: string]` - Emitted when message is sent
- `suggestion: [text: string]` - Emitted when suggestion is clicked

**Features:**

- Auto-resize textarea
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Suggestion buttons

### `MessageList.vue`

Container for chat messages with auto-scroll.

**Location**: `src/components/chat/MessageList.vue`

**Props:**

- `messages: Message[]` - Array of messages to display

**Emits:**

- `copy: [content: string]` - Copy message content
- `delete: [messageId: string]` - Delete message
- `edit: [messageId: string, content: string]` - Edit message
- `regenerate: [messageId: string]` - Regenerate AI response
- `suggestion: [text: string]` - Use suggestion

**Features:**

- Auto-scroll to bottom
- Empty state with suggestions
- Rotating titles animation

### `MessageBubble.vue`

Individual message display component.

**Location**: `src/components/chat/MessageBubble.vue`

**Props:**

- `message: Message` - Message to display
- `isStreaming?: boolean` - Is message currently streaming

**Emits:**

- `copy: [content: string]` - Copy message
- `delete: [messageId: string]` - Delete message
- `edit: [messageId: string, content: string]` - Edit message
- `regenerate: [messageId: string]` - Regenerate response

**Features:**

- User/Assistant message styling
- Message actions (copy, edit, delete, regenerate)
- Streaming indicator

### `MessageContent.vue`

Markdown content renderer for messages.

**Location**: `src/components/chat/MessageContent.vue`

**Props:**

- `content: string` - Markdown content to render

**Features:**

- Markdown rendering with `marked`
- Syntax highlighting with `highlight.js`
- Code block support

### `MessageActions.vue`

Action buttons for messages.

**Location**: `src/components/chat/MessageActions.vue`

**Props:**

- `message: Message` - Message for actions
- `isUser: boolean` - Is user message

**Emits:**

- `copy: []` - Copy action
- `delete: []` - Delete action
- `edit: []` - Edit action
- `regenerate: []` - Regenerate action

### `CodeBlock.vue`

Syntax-highlighted code block component.

**Location**: `src/components/chat/CodeBlock.vue`

**Props:**

- `code: string` - Code to display
- `language?: string` - Programming language

**Features:**

- Syntax highlighting
- Copy to clipboard
- Language detection

## Layout Components

### `AppSidebar.vue`

Application sidebar with navigation and chat list.

**Location**: `src/components/layout/AppSidebar.vue`

**Features:**

- Chat list with grouping
- New chat button
- Settings navigation
- Responsive (collapsible on mobile)
- Rail mode support

**Exposed Methods:**

- `toggleDrawer()` - Toggle sidebar visibility

### `ChatListItem.vue`

Individual chat item in sidebar.

**Location**: `src/components/layout/ChatListItem.vue`

**Props:**

- `chat: ChatListItem` - Chat data
- `isActive: boolean` - Is currently active
- `timestamp: string` - Formatted timestamp

**Emits:**

- `click: []` - Chat clicked
- `delete: [event: Event]` - Delete chat
- `rename: [newTitle: string]` - Rename chat

**Features:**

- Context menu (rename, delete)
- Active state styling
- Temporary chat indicator

## Settings Components

### `ApiSettings.vue`

API configuration settings.

**Location**: `src/components/settings/ApiSettings.vue`

**Features:**

- API key input
- Model selection
- Parameter configuration
- Connection test

### `AppearanceSettings.vue`

Appearance and theme settings.

**Location**: `src/components/settings/AppearanceSettings.vue`

**Features:**

- Theme selection (light/dark/system)
- Language selection

### `BehaviorSettings.vue`

Behavior and preference settings.

**Location**: `src/components/settings/BehaviorSettings.vue`

**Features:**

- Temporary chat mode
- Sidebar collapse preference

### `LanguageSettings.vue`

Language and localization settings.

**Location**: `src/components/settings/LanguageSettings.vue`

**Features:**

- Language selection
- i18n configuration

### `DangerZoneSettings.vue`

Dangerous operations (reset, clear data).

**Location**: `src/components/settings/DangerZoneSettings.vue`

**Features:**

- Clear all chats
- Reset settings
- Export/Import data

### `SettingsCard.vue`

Reusable settings card wrapper.

**Location**: `src/components/settings/SettingsCard.vue`

**Props:**

- `title: string` - Card title
- `description?: string` - Card description

**Slots:**

- `default` - Card content

## Page Components

### `ChatPage.vue`

Main chat page component.

**Location**: `src/pages/ChatPage.vue`

**Features:**

- Message list
- Chat input
- Empty state
- Loading states

### `SettingsPage.vue`

Settings page component.

**Location**: `src/pages/SettingsPage.vue`

**Features:**

- Settings sections
- Navigation
- Form handling

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

### Using Composables

```vue
<script setup lang="ts">
import { useToast } from '@/composables'
import { useChatStore } from '@/stores'

const toast = useToast()
const chatStore = useChatStore()
</script>
```

### Using i18n

```vue
<template>
  <h1>{{ $t('common.title') }}</h1>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const title = t('common.title')
</script>
```

## Next Steps

- Review [Adding Components Guide](../how-to/add-new-component.md)
- Study [Development Patterns](../explanation/patterns.md)
- Check [Architecture](./architecture.md)

---

**Components Reference complete!** Use this reference when working with Vue components.
