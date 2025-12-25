# Adding Translations

This guide explains how to add new translations to the application's internationalization system.

## Overview

The application uses Vue I18n for internationalization. Currently supported languages:

- **English (en)** - Default language
- **Ukrainian (uk)** - Secondary language

Translation files are located in `src/locales/`.

## Translation File Structure

Translation files use nested object structure:

```typescript
// src/locales/en.ts
export default {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
  },
  chat: {
    new: 'New Chat',
    placeholder: 'Type a message...',
    send: 'Send',
  },
  settings: {
    title: 'Settings',
    api: {
      title: 'API Settings',
      apiKey: 'API Key',
    },
  },
}
```

## Step-by-Step Guide

### Step 1: Add Translation Key

Add the key to **both** language files:

**English (`src/locales/en.ts`):**

```typescript
export default {
  // ... existing translations
  myFeature: {
    title: 'My Feature',
    description: 'This is my new feature',
    button: 'Click Me',
  },
}
```

**Ukrainian (`src/locales/uk.ts`):**

```typescript
export default {
  // ... existing translations
  myFeature: {
    title: 'Моя функція',
    description: 'Це моя нова функція',
    button: 'Натисни мене',
  },
}
```

### Step 2: Use in Components

#### In Templates

```vue
<template>
  <h1>{{ $t('myFeature.title') }}</h1>
  <p>{{ $t('myFeature.description') }}</p>
  <v-btn>{{ $t('myFeature.button') }}</v-btn>
</template>
```

#### In Script

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const title = t('myFeature.title')
</script>
```

### Step 3: Type Safety (Optional)

For TypeScript type safety, the translation keys are automatically typed based on the English translation file.

## Translation Patterns

### Simple Translation

```typescript
// Translation
common: {
  save: 'Save',
}

// Usage
$t('common.save')
```

### Nested Keys

```typescript
// Translation
settings: {
  api: {
    title: 'API Settings',
  },
}

// Usage
$t('settings.api.title')
```

### With Parameters

```typescript
// Translation
chat: {
  messageCount: 'You have {count} messages',
}

// Usage
$t('chat.messageCount', { count: 5 })
// Result: "You have 5 messages"
```

### Pluralization

```typescript
// Translation
chat: {
  messageCount: 'no messages | 1 message | {count} messages',
}

// Usage
$t('chat.messageCount', { count: 0 })  // "no messages"
$t('chat.messageCount', { count: 1 })   // "1 message"
$t('chat.messageCount', { count: 5 })   // "5 messages"
```

## Best Practices

### ✅ DO

- **Keep keys organized** - Use nested structure for related translations
- **Use descriptive keys** - `chat.sendButton` is better than `btn1`
- **Keep translations synchronized** - Add to all language files
- **Use parameters** - For dynamic content
- **Test both languages** - Verify translations work correctly

### ❌ DON'T

- **Hardcode text** - Always use translation keys
- **Skip translations** - Add to all language files
- **Use generic keys** - Be specific about context
- **Mix languages** - Keep each file in its language

## Translation File Organization

Current structure:

```
locales/
├── index.ts    # i18n configuration
├── en.ts       # English translations
└── uk.ts       # Ukrainian translations
```

### Recommended Structure

```typescript
{
  // Common UI elements
  common: { ... },

  // Feature-specific
  chat: { ... },
  settings: { ... },

  // Error messages
  errors: { ... },

  // Validation messages
  validation: { ... },
}
```

## Adding a New Language

To add a new language (e.g., German):

### Step 1: Create Translation File

```bash
touch src/locales/de.ts
```

### Step 2: Copy Structure

Copy the English file structure and translate:

```typescript
// src/locales/de.ts
export default {
  common: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
  },
  // ... translate all keys
}
```

### Step 3: Register Language

Update `src/locales/index.ts`:

```typescript
import de from './de'
import en from './en'
import uk from './uk'

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    de,
    en,
    uk,
  },
})
```

### Step 4: Add Language Selector

Update the language settings component to include the new language.

## Dynamic Language Switching

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function changeLanguage(lang: 'en' | 'uk' | 'de') {
  locale.value = lang
  // Optionally save to localStorage
  localStorage.setItem('preferred-language', lang)
}
</script>

<template>
  <v-select
    :model-value="locale"
    :items="[
      { title: 'English', value: 'en' },
      { title: 'Українська', value: 'uk' },
      { title: 'Deutsch', value: 'de' },
    ]"
    @update:model-value="changeLanguage"
  />
</template>
```

## Testing Translations

### Manual Testing

1. Switch language in Settings
2. Navigate through the application
3. Verify all text is translated
4. Check for missing keys (should show key path)

### Automated Testing

```typescript
import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'

import en from '@/locales/en'
import uk from '@/locales/uk'

describe('Translations', () => {
  it('should have same keys in all languages', () => {
    const enKeys = getKeys(en)
    const ukKeys = getKeys(uk)

    expect(enKeys).toEqual(ukKeys)
  })
})

function getKeys(obj: Record<string, any>, prefix = ''): string[] {
  const keys: string[] = []
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object') {
      keys.push(...getKeys(obj[key], fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}
```

## Common Translation Keys

Reference for common translations:

```typescript
{
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
  errors: {
    networkError: 'Network error. Check your connection.',
    unauthorized: 'Invalid API key.',
    rateLimited: 'Rate limit exceeded.',
    serverError: 'Server error. Please try again.',
    unknown: 'An unknown error occurred.',
  },
}
```

## Next Steps

- Review [i18n Explanation](../explanation/i18n.md)
- Check [Component Reference](../reference/components.md) for i18n usage
- Study [Development Patterns](../explanation/patterns.md)

---

**Translations added!** Your application now supports multiple languages.
