# AI Chat

Chat client for large language models on the Cerebras API: stream answers, keep several conversations, edit and regenerate messages, and switch the interface between English and Ukrainian. Built in December 2025 as a take-home assignment.

**Live demo:** [vue-ai-chat-androfficial.vercel.app](https://vue-ai-chat-androfficial.vercel.app)

## Features

- Streams answers word by word from the Cerebras chat completions API, with a stop button. Four models to choose from: Llama 3.3 70B, Llama 3.1 8B, Qwen 3 32B and GPT OSS 120B.
- Several chats in a sidebar grouped by date, with rename and delete. The first message becomes the chat title, and a new chat offers four prompt suggestions.
- Copy any message, edit a sent message (later messages are removed and a new answer is generated) or regenerate an answer.
- Markdown answers with syntax-highlighted code blocks and a copy button.
- Temporary chats: the incognito toggle on a new chat keeps it out of the sidebar and localStorage until it is saved.
- Light, dark and system themes, and an English or Ukrainian interface that follows the browser language until the user picks one.
- A settings page for the API key with a connection test, the model, the theme, the language and deleting all chats.
- Enter sends a message and Shift+Enter adds a line. The sidebar collapses to icons on desktop and becomes a drawer on mobile.

## Tech stack

- **Framework:** Vue 3 (Composition API with `<script setup>`), TypeScript 5
- **State:** Pinia 3, persisted to localStorage
- **Data:** Fetch API with server-sent events from the Cerebras chat completions endpoint
- **Routing:** Vue Router 4
- **UI:** Vuetify 3, Material Design Icons, Vue I18n 9, marked 17, highlight.js 11
- **Testing:** Vitest 4, happy-dom, V8 coverage
- **Tooling:** Vite 7, vue-tsc, ESLint 9 with typescript-eslint and perfectionist, Stylelint 16, Prettier 3, Husky 9 with lint-staged, GitHub Actions
- **Hosting:** Vercel

## Getting started

You need Node.js 20.19 or later and a Cerebras API key from [cloud.cerebras.ai](https://cloud.cerebras.ai), which the app asks for on first launch.

```bash
git clone https://github.com/androfficial/vue-ai-chat.git
cd vue-ai-chat
npm install
npm run dev
```

The dev server runs at http://localhost:5173. There are no environment variables: the key is entered in the app, stored in localStorage and sent from the browser straight to the Cerebras API.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite dev server |
| `npm run build` | Type-checks with `vue-tsc -b` and builds to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run type-check` | Runs `vue-tsc` without emitting files |
| `npm run lint` | Runs ESLint and fixes what it can |
| `npm run lint:css` | Runs Stylelint on CSS and Vue files and fixes what it can |
| `npm run format` | Formats the project with Prettier |
| `npm test` | Runs the unit tests once |
| `npm run test:watch` | Runs the unit tests in watch mode |
| `npm run test:coverage` | Runs the unit tests with a V8 coverage report |

## Project structure

```text
src/
  api/          fetch client, server-sent events parser, error codes, Cerebras chat completions
  assets/       global styles and the highlight.js theme
  components/   chat (input, message list, bubbles, code blocks), layout (sidebar, toasts), settings cards
  composables/  chat messaging, stream buffer, auto-scroll, markdown, theme, clipboard, toasts
  locales/      English and Ukrainian messages
  pages/        chat page and settings page
  plugins/      Vue I18n, Vue Router and Vuetify setup
  stores/       Pinia stores for chats, API settings and user preferences
  test/         Vitest setup with localStorage, clipboard and crypto mocks
  types/        shared types and injection keys
  utils/        storage, dates, ids, validation and global error handlers
```

Unit tests sit next to the code in `__tests__` folders.

## Notes

- Data flow: `useChatMessages` passes the chat history to `sendStreamingChatCompletion` (`src/api/cerebras.ts`), which posts it to `/chat/completions` with `stream: true`. `processStream` parses the server-sent events, and `useStreamBuffer` releases the text into the Pinia chat store word by word, pausing longer after punctuation and speeding up when the buffer grows. Store watchers save chats, API settings and preferences to localStorage under `ai-chat:` keys.
- Testing: Vitest runs nine unit test files in happy-dom, covering the utilities, `useClipboard`, `useToast` and the three Pinia stores, with 60% coverage thresholds. The Husky pre-commit hook runs lint-staged and then the whole test suite.
- CI: `.github/workflows/ci.yml` runs ESLint, Stylelint, the type check, the tests and the build on Node.js 20 for pushes and pull requests to `main`. It then deploys with the Vercel CLI: a preview for pull requests, with the URL posted as a comment, and production for pushes to `main`. It needs the repository secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.
- `docs/` holds longer guides split into tutorials, how-to guides, reference and explanations. Start with [docs/README.md](docs/README.md); [architecture](docs/reference/architecture.md), [streaming](docs/explanation/streaming.md) and [state management](docs/explanation/state-management.md) cover the parts above in depth.
