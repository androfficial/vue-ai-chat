# Getting Started

This guide will help you install and run the AI Chat project from scratch.

## Prerequisites

Before starting, make sure you have installed:

- **Node.js** version 18.0.0 or higher
- **npm** version 9.0.0 or higher
- **Git** for cloning the repository
- **Cerebras API key** (get one at [cloud.cerebras.ai](https://cloud.cerebras.ai))

Check versions:

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

## Installation

### 1. Clone the repository

```bash
git clone git@github.com:androfficial/vue-ai-chat-test-task.git
cd vue-ai-chat-test-task
```

### 2. Install dependencies

```bash
npm install
```

This will install all necessary dependencies, including:

- Vue 3 and related libraries
- Vuetify 3 for UI components
- Pinia for state management
- Vue Router for routing
- And other project dependencies

### 3. Start the development server

```bash
npm run dev
```

After starting, open your browser and navigate to:

```
http://localhost:5173
```

You should see the application interface with a sidebar and chat area.

## Initial Setup

### Configure API Key

On first launch, the application will ask you to enter your Cerebras API key:

1. Go to **Settings** via the sidebar
2. In the **API Settings** section, enter your API key
3. Select an AI model (default: Llama 3.3 70B)
4. Click **Save**

### Create Your First Chat

1. Click the **New Chat** button in the sidebar
2. Type your message in the input field
3. Press **Enter** or click the send button
4. Wait for the AI response (response will stream character by character)

## Verify Installation

Make sure everything works correctly:

```bash
# TypeScript type checking
npm run type-check

# Run linter
npm run lint

# Run tests
npm run test
```

All commands should execute without errors.

## Project Structure

After installation, the project structure looks like this:

```
ai-chat/
├── src/
│   ├── components/     # Vue components
│   ├── composables/    # Composable functions
│   ├── stores/         # Pinia stores
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   └── ...
├── docs/               # Documentation (this section)
├── .cursor/            # Development rules for Cursor AI
└── package.json        # Dependencies and scripts
```

## Available Commands

| Command                 | Description               |
| ----------------------- | ------------------------- |
| `npm run dev`           | Start development server  |
| `npm run build`         | Build production version  |
| `npm run preview`       | Preview production build  |
| `npm run type-check`    | TypeScript type checking  |
| `npm run lint`          | Run ESLint with auto-fix  |
| `npm run format`        | Format code with Prettier |
| `npm run test`          | Run tests                 |
| `npm run test:watch`    | Run tests in watch mode   |
| `npm run test:coverage` | Run tests with coverage   |

## Next Steps

Now that the project is installed and running:

1. Study [Project Architecture](../reference/architecture.md)
2. Read [Building Your First Chat](./building-your-first-chat.md)
3. Review [Development Patterns](../explanation/patterns.md)

## Troubleshooting

### Issue: Error installing dependencies

**Solution**: Delete `node_modules` and `package-lock.json`, then run:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 is already in use

**Solution**: Vite will automatically suggest using another port, or you can specify a port manually:

```bash
npm run dev -- --port 3000
```

### Issue: API key doesn't work

**Solution**:

- Make sure the key is copied completely
- Check that the key is active on [cloud.cerebras.ai](https://cloud.cerebras.ai)
- Try a different key

### Issue: TypeScript errors

**Solution**: Make sure all types are correct:

```bash
npm run type-check
```

## Useful Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vuetify 3 Documentation](https://vuetifyjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Cerebras AI API Docs](https://docs.cerebras.ai/)

---

**Ready for the next step?** Move on to [Building Your First Chat](./building-your-first-chat.md)!
