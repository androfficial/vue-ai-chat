# AI Chat

A modern chat application powered by Cerebras AI, built with Vue 3, TypeScript, and Vuetify 3.

## Features

- 🤖 **AI Chat** - Chat with Cerebras AI models (Llama 4 Scout 17B, Llama 3.1 8B/70B)
- 💬 **Multiple Chats** - Create and manage multiple chat conversations
- 📝 **Message Actions** - Copy, edit, delete, and regenerate messages
- 🌙 **Dark/Light Theme** - Switch between themes with ChatGPT-inspired design
- 🌍 **Multilingual** - English and Ukrainian interface support
- 💾 **Persistent Storage** - Chats saved in localStorage
- ⚡ **Streaming Responses** - Real-time AI response streaming
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **Vue 3.5** - Composition API with `<script setup>`
- **TypeScript 5.9** - Type-safe development
- **Vite 7** - Fast build tool
- **Pinia 3** - State management
- **Vue Router 4** - Client-side routing
- **Vuetify 3** - Material Design components
- **Vue I18n 9** - Internationalization
- **Axios** - HTTP client for API requests
- **ESLint** - Code linting with Perfectionist plugin
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks

## Getting Started

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

## Available Scripts

```bash
# Development
npm run dev       # Start dev server

# Build
npm run build     # Build for production
npm run preview   # Preview production build

# Code Quality
npm run lint      # Run ESLint with auto-fix
npm run format    # Format code with Prettier
npm run type-check # TypeScript type checking
```

## Project Structure

```
src/
├── assets/           # Static assets and global styles
├── components/       # Vue components
│   ├── chat/        # Chat-related components (ChatInput, MessageList, etc.)
│   ├── layout/      # Layout components (AppSidebar, ChatListItem)
│   └── settings/    # Settings page components
├── composables/      # Reusable composition functions
├── locales/          # i18n translations (en.ts, uk.ts)
├── pages/            # Page components (ChatPage, SettingsPage)
├── plugins/          # Vue plugins (router, vuetify, i18n)
├── services/api/     # API services (Cerebras integration)
├── stores/           # Pinia stores (chat, api, user)
├── types/            # TypeScript interfaces
└── utils/            # Utility functions (storage, validation, etc.)
```

## Configuration

### API Settings

Configure your Cerebras API settings in the Settings page:

- API Key
- Model selection

### User Preferences

- Theme (Light/Dark/System)
- Language (English/Ukrainian)

## License

MIT
