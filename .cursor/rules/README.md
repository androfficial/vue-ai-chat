---
description: Cursor Rules Documentation - Overview
alwaysApply: false
---

# Cursor Rules Documentation

This directory contains AI-specific rules and guidelines for the AI Chat project. These rules help Cursor AI understand the project's architecture, patterns, and best practices.

## 📁 Rules Structure

```
.cursor/rules/
├── README.md              # This file - overview
├── project.md            # ✅ Global project rules (alwaysApply: true)
├── vue-components.md     # Vue 3 component patterns
├── typescript.md         # TypeScript guidelines
├── pinia-stores.md       # Pinia state management
├── composables.md        # Composables patterns
├── vuetify.md           # Vuetify 3 UI framework
├── i18n.md              # Internationalization
├── api-services.md      # API integration
├── error-handling.md    # Error handling patterns
├── styling.md           # CSS and styling
└── testing.md           # Testing guidelines
```

## 🎯 How Rules Work

### Frontmatter Metadata

Each rule file has metadata in frontmatter:

```markdown
---
description: Brief description of the rule
globs:
  - '**/*.vue' # Apply to all Vue files
  - '**/*.ts' # Apply to all TypeScript files
alwaysApply: true # Always include in context
---
```

### Rule Scoping

- **alwaysApply: true** - Always included in AI context (use for global rules)
- **alwaysApply: false** - Applied based on glob patterns (file-specific rules)
- **globs** - File patterns to match (uses glob syntax)

### Nested Rules

You can create nested rules for different project areas:

```
.cursor/rules/
  backend/
    .cursor/rules/       # Backend-specific rules
  frontend/
    .cursor/rules/       # Frontend-specific rules
```

## 📚 Rule Categories

### Core Rules (Always Applied)

- **project.md** - Global project context, tech stack, best practices

### Component Rules (Conditional)

Applied based on file type:

- **vue-components.md** - Vue component patterns
- **typescript.md** - TypeScript strict mode
- **pinia-stores.md** - State management
- **composables.md** - Reusable composition functions

### Framework Rules

- **vuetify.md** - Vuetify 3 Material Design
- **i18n.md** - Vue I18n translations

### Architecture Rules

- **api-services.md** - API integration, streaming
- **error-handling.md** - Error handling, user feedback
- **styling.md** - CSS patterns, theming
- **testing.md** - Testing guidelines

## 🔍 Using Rules

Rules are automatically loaded by Cursor AI based on:

1. **Current file context** - Glob patterns match current file
2. **Always apply rules** - Global rules always included
3. **Chat context** - Rules relevant to your query

### Example: Editing Vue Component

When editing `ChatInput.vue`, Cursor loads:

- ✅ project.md (alwaysApply: true)
- ✅ vue-components.md (globs: `**/*.vue`)
- ✅ typescript.md (globs: `**/*.vue`)
- ✅ vuetify.md (globs: `**/*.vue`)
- ✅ styling.md (globs: `**/*.vue`)

### Example: Editing Pinia Store

When editing `stores/chat.ts`, Cursor loads:

- ✅ project.md (alwaysApply: true)
- ✅ typescript.md (globs: `**/*.ts`)
- ✅ pinia-stores.md (globs: `**/stores/**/*.ts`)

## ✨ Benefits

1. **Context-Aware** - AI understands project patterns
2. **Consistent Code** - Enforces code style automatically
3. **Modular** - Rules organized by domain
4. **Maintainable** - Easy to update specific guidelines
5. **Scalable** - Add rules as project grows

## 🛠️ Maintaining Rules

### Adding New Rules

1. Create new `.md` file in `.cursor/rules/`
2. Add frontmatter with description and globs
3. Write guidelines with examples
4. Test by editing matching files

### Updating Rules

1. Edit existing rule file
2. Cursor automatically picks up changes
3. No restart required

### Best Practices

- ✅ Keep rules focused and specific
- ✅ Use code examples
- ✅ Set appropriate glob patterns
- ✅ Use `alwaysApply: true` sparingly
- ✅ Document edge cases

## 📖 References

- [Cursor Documentation](https://docs.cursor.com)
- [Project README](../../README.md)
- [Vue 3 Docs](https://vuejs.org)
- [TypeScript Docs](https://typescriptlang.org)
- [Vuetify 3 Docs](https://vuetifyjs.com)
