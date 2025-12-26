# AI Chat - Project Documentation

Welcome to the **AI Chat** project documentation — a modern chat application with Cerebras AI integration, built with Vue 3, TypeScript, and Vuetify 3.

## 📚 Documentation Structure

The documentation is organized using the [Diátaxis Framework](https://diataxis.fr/) methodology, which divides documentation into four types based on user needs:

### 🎓 Tutorials

Step-by-step guides for beginners to learn the project from scratch.

- [Getting Started](./tutorials/getting-started.md) - Installation and first run
- [Building Your First Chat](./tutorials/building-your-first-chat.md) - Step-by-step chat creation

### 🔧 How-to Guides

Step-by-step instructions for completing specific tasks.

- [Adding a New Component](./how-to/add-new-component.md)
- [Creating a New Composable](./how-to/add-new-composable.md)
- [Creating a New Store](./how-to/add-new-store.md)
- [Configuring API](./how-to/configure-api.md)
- [Adding Translations](./how-to/add-translations.md)

### 📖 Reference

Technical documentation for APIs, components, types, and architecture.

- [Architecture](./reference/architecture.md) - Architecture and structure overview
- [API Reference](./reference/api-reference.md) - API services documentation
- [Components](./reference/components.md) - Components reference
- [Composables](./reference/composables.md) - Composable functions reference
- [Stores](./reference/stores.md) - Pinia stores documentation
- [Types](./reference/types.md) - TypeScript types and interfaces

### 💡 Explanation

Deep explanations of architectural decisions, patterns, and concepts.

- [Development Patterns](./explanation/patterns.md) - Used patterns and practices
- [State Management](./explanation/state-management.md) - Pinia stores architecture
- [Streaming Responses](./explanation/streaming.md) - How AI response streaming works
- [Theming](./explanation/theming.md) - Theme and styling system
- [Internationalization](./explanation/i18n.md) - Translation system

## 🚀 Quick Start

If you want to quickly get started with the project:

1. Read [Getting Started](./tutorials/getting-started.md)
2. Study [Project Architecture](./reference/architecture.md)
3. Review [Development Patterns](./explanation/patterns.md)

## 🎯 Who is this documentation for?

- **New developers** - Start with the Tutorials section
- **Experienced developers** - Use How-to Guides for specific tasks
- **Architects** - Study the Explanation section to understand decisions
- **API developers** - Refer to Reference for technical details

## 📋 Tech Stack

| Category         | Technology                       |
| ---------------- | -------------------------------- |
| Framework        | Vue 3.5 (Composition API)        |
| Language         | TypeScript 5.x (strict mode)     |
| Build Tool       | Vite 7.x                         |
| UI Framework     | Vuetify 3.11 (Material Design 3) |
| State Management | Pinia 3.x                        |
| Routing          | Vue Router 4.x                   |
| i18n             | Vue I18n 9.x                     |
| Markdown         | Marked + Highlight.js            |
| Testing          | Vitest + Vue Test Utils          |

## 🔗 Useful Links

- [Project Repository](https://github.com/androfficial/vue-ai-chat-test-task)
- [Cerebras AI API](https://cloud.cerebras.ai)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vuetify Documentation](https://vuetifyjs.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)

## 📝 Development Rules

The project follows strict development rules defined in `.cursor/rules/`:

- ✅ Vue 3 Composition API with `<script setup>`
- ✅ TypeScript strict mode (no `any`)
- ✅ ESLint Perfectionist for import sorting
- ✅ Vuetify utility classes instead of custom CSS
- ✅ Barrel exports via `index.ts`
- ✅ JSDoc comments for complex functions

For more details on rules, see [Development Patterns](./explanation/patterns.md).

---

_Last updated: December 2025_
