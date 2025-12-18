# AI Chat

A modern chat application powered by Cerebras AI, built with Vue 3, TypeScript, and Vuetify 3.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vuetify](https://img.shields.io/badge/Vuetify-3.11-1867C0?logo=vuetify)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🤖 **AI Chat** - Chat with Cerebras AI models (Llama 3.3 70B, Llama 3.1 8B, Qwen 3 32B, GPT OSS 120B)
- 💬 **Multiple Chats** - Create and manage multiple chat conversations
- 🔄 **Streaming Responses** - Real-time AI response streaming with smooth word-by-word animation
- 📝 **Message Actions** - Copy, edit, delete, and regenerate messages
- 🕐 **Temporary Chats** - Incognito mode for chats that won't be saved
- 🌙 **Dark/Light Theme** - Switch between themes with system preference support
- 🌍 **Multilingual** - English and Ukrainian interface support
- 💾 **Persistent Storage** - Chats and preferences saved in localStorage
- 📱 **Responsive Design** - Collapsible sidebar, works on desktop and mobile
- ⌨️ **Keyboard Shortcuts** - Send on Enter, new line with Shift+Enter

## 🛠️ Tech Stack

| Category             | Technology                                      |
| -------------------- | ----------------------------------------------- |
| Framework            | Vue 3.5 (Composition API with `<script setup>`) |
| Language             | TypeScript 5.x                                  |
| Build Tool           | Vite 7.x                                        |
| State Management     | Pinia 3.x                                       |
| Routing              | Vue Router 4.x                                  |
| UI Framework         | Vuetify 3.11                                    |
| Internationalization | Vue I18n 9.x                                    |
| HTTP Client          | Axios                                           |
| Markdown             | Marked                                          |
| Linting              | ESLint 9.x with Perfectionist plugin            |
| Formatting           | Prettier                                        |
| Git Hooks            | Husky                                           |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Cerebras API key (get one at [cloud.cerebras.ai](https://cloud.cerebras.ai))

### Installation

1. Clone the repository:

```bash
git clone git@github.com:androfficial/vue-ai-chat-test-task.git
cd vue-ai-chat-test-task
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

5. Enter your Cerebras API key when prompted

## 📜 Available Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start development server            |
| `npm run build`      | Type-check and build for production |
| `npm run preview`    | Preview production build            |
| `npm run type-check` | TypeScript type checking only       |
| `npm run lint`       | Run ESLint with auto-fix            |
| `npm run format`     | Format code with Prettier           |

## 📁 Project Structure

```
src/
├── assets/styles/      # Global CSS variables and styles
├── components/
│   ├── chat/           # Chat components
│   │   ├── ChatInput.vue       # Message input with auto-resize
│   │   ├── MessageList.vue     # Messages container with auto-scroll
│   │   ├── MessageBubble.vue   # Individual message display
│   │   ├── MessageContent.vue  # Markdown rendering
│   │   └── MessageActions.vue  # Copy, edit, regenerate actions
│   ├── layout/
│   │   ├── AppSidebar.vue      # Navigation sidebar
│   │   └── ChatListItem.vue    # Chat list entry
│   └── settings/       # Settings page components
│       ├── ApiSettings.vue
│       ├── AppearanceSettings.vue
│       ├── BehaviorSettings.vue
│       ├── LanguageSettings.vue
│       └── DangerZoneSettings.vue
├── composables/        # Reusable composition functions
│   ├── useChatMessages.ts      # Chat messaging logic
│   ├── useAutoScroll.ts        # Auto-scroll functionality
│   ├── useStreamBuffer.ts      # Streaming animation buffer
│   ├── useToast.ts             # Toast notifications
│   └── ...
├── locales/            # i18n translations (en.ts, uk.ts)
├── pages/
│   ├── ChatPage.vue    # Main chat view
│   └── SettingsPage.vue
├── plugins/            # Vue plugins (router, vuetify, i18n)
├── services/api/
│   └── cerebras.ts     # Cerebras API integration
├── stores/             # Pinia stores
│   ├── chat.ts         # Chat state management
│   ├── api.ts          # API configuration
│   └── user.ts         # User preferences
├── types/              # TypeScript interfaces
└── utils/              # Utility functions
    ├── storage.ts      # localStorage helpers
    ├── validation.ts   # Input validation
    └── date.ts         # Date formatting
```

## ⚙️ Configuration

### API Settings

Configure in Settings page or provide on first launch:

- **API Key** - Your Cerebras API key
- **Model** - Choose from available models:
  - Llama 3.3 70B (best for complex tasks)
  - Llama 3.1 8B (fast and efficient)
  - Qwen 3 32B (great multilingual support)
  - GPT OSS 120B (reasoning model)

### User Preferences

- **Theme** - Light / Dark / System
- **Language** - English / Ukrainian

### Storage Keys

All data is stored in localStorage with prefixed keys:

- `ai-chat:chats` - Chat history
- `ai-chat:api-config` - API settings
- `ai-chat:preferences` - User preferences

## 🏗️ Architecture

### Data Flow

```
User Input → useChatMessages composable → cerebras.ts service (streaming)
     ↓
Pinia Stores ← useStreamBuffer (smooth animation)
     ↓
localStorage persistence
```

### Key Patterns

- **Composition API** - All components use `<script setup lang="ts">`
- **Type imports** - `import type { Chat } from '@/types'`
- **Barrel exports** - Types, composables, stores via index files
- **ESLint Perfectionist** - Enforced import/property sorting

## 📄 License

MIT

## 👤 Author

**Andrii Nakonechnyi**

- Email: andriinkn@gmail.com
- GitHub: [@androfficial](https://github.com/androfficial)
