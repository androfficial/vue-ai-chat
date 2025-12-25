---
description: TypeScript Strict Mode Guidelines
globs:
  - '**/*.ts'
  - '**/*.vue'
alwaysApply: false
---

# TypeScript Guidelines

## Type Imports

Always use `import type` for type-only imports:

```typescript
// ✅ Correct
import type { Chat, Message } from '@/types'
import type { RouteLocationNormalized } from 'vue-router'

// ❌ Wrong
import { Chat, Message } from '@/types'
```

## Interface vs Type

- **Interface**: For object shapes, can be extended
- **Type**: For unions, intersections, primitives

```typescript
// ✅ Use interface for objects
interface User {
  id: string
  name: string
}

// ✅ Use type for unions
type Theme = 'light' | 'dark' | 'system'

// ✅ Use type for intersections
type UserWithChat = User & { chatId: string }
```

## Barrel Exports

Use `index.ts` files to re-export types:

```typescript
// types/index.ts
export type { Chat } from './chat'
export type { Message } from './message'
export type { User } from './user'

// Usage
import type { Chat, Message, User } from '@/types'
```

## Strict Mode

- **No `any`** - always provide proper types
- **No `as unknown as X`** - fix the type properly
- **No `@ts-ignore`** - resolve the type issue

## Generic Types

Use generics for reusable types:

```typescript
interface ApiResponse<T> {
  data: T
  status: number
  error?: string
}

// Usage
type ChatResponse = ApiResponse<Chat[]>
```
