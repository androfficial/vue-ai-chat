---
description: AI Chat - Vue 3 + TypeScript + Vuetify 3 Project Rules
globs:
  - '**/*.vue'
  - '**/*.ts'
  - '**/*.js'
alwaysApply: true
---

# AI Chat Project Rules

You are an expert in Vue 3, TypeScript, Vite, and Vuetify 3 development.

## Project Context

This is an AI Chat application with Cerebras AI integration. Features multiple chat sessions, streaming responses, dark/light themes, and multilingual support (EN/UK).

## Tech Stack

- **Framework**: Vue 3.5 (Composition API with `<script setup>`)
- **Language**: TypeScript 5.x (strict mode)
- **Build Tool**: Vite 7.x
- **UI Framework**: Vuetify 3.11 (Material Design 3)
- **State Management**: Pinia 3.x
- **Routing**: Vue Router 4.x
- **i18n**: Vue I18n 9.x
- **Markdown**: Marked + Highlight.js

## Code Style

### Vue Components

- Always use `<script setup lang="ts">` syntax
- Structure: `<script setup>` → `<template>` → `<style>`
- Add JSDoc comments at the top of each component
- Use `ref()` for primitives, `reactive()` sparingly for objects
- Define props with `defineProps<PropsType>()`
- Define emits with `defineEmits<EmitsType>()`

### TypeScript

- **Strict mode enabled** - no `any` types
- Prefer `interface` for object shapes
- Use `type` for unions/intersections
- Always use `import type` for type-only imports
- Use barrel exports (`index.ts`)

### Import Order (ESLint Perfectionist)

Sort alphabetically in groups:

1. Vue core (`vue`, `vue-router`, `pinia`, `vuetify`)
2. Internal (`@/components`, `@/composables`, `@/stores`, `@/types`, `@/utils`)
3. Assets (`@/assets/styles`)

## Project Structure

```
src/
├── assets/styles/      # Global CSS, theme variables
├── components/
│   ├── chat/           # Chat components
│   ├── layout/         # Layout components
│   ├── settings/       # Settings components
│   └── ui/             # Reusable UI
├── composables/        # Vue composables
├── locales/            # i18n (en.ts, uk.ts)
├── pages/              # Page components
├── plugins/            # Vue plugins
├── services/api/       # API integration
├── stores/             # Pinia stores
├── types/              # TypeScript types
└── utils/              # Utilities
```

## Best Practices

✅ **DO**:

- Use TypeScript strict mode
- Add JSDoc for complex functions
- Handle loading/error states
- Test both themes and languages

❌ **DON'T**:

- Use Options API
- Import types without `import type`
- Mutate props directly
- Use inline styles
