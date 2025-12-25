# Theming

This document explains the theming system and styling approach.

## Overview

The application uses **Vuetify 3** for theming with support for light, dark, and system themes. Styling follows a utility-first approach with minimal custom CSS.

## Theme System

### Theme Modes

The application supports three theme modes:

- **Light** - Light theme
- **Dark** - Dark theme
- **System** - Follows OS preference

### Theme Implementation

**Location**: `src/App.vue`

Theme is managed using Vuetify's theme system:

```typescript
import { useTheme } from 'vuetify'

const theme = useTheme()

function applyTheme(themeMode: string) {
  if (themeMode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.change(prefersDark ? 'dark' : 'light')
  } else {
    theme.change(themeMode)
  }
}
```

### System Theme Detection

The application listens to system theme changes:

```typescript
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (userStore.preferences.theme === 'system') {
      applyTheme('system')
    }
  })
})
```

## Styling Approach

### Vuetify Utilities

Prefer Vuetify utility classes over custom CSS:

```vue
<!-- ✅ Good -->
<div class="d-flex flex-column ga-4 pa-4">
  <v-card rounded="lg">
    <v-card-title class="text-h5">Title</v-card-title>
  </v-card>
</div>

<!-- ❌ Bad -->
<div style="display: flex; flex-direction: column; gap: 16px; padding: 16px;">
  <div style="border-radius: 8px;">
    <h2 style="font-size: 24px;">Title</h2>
  </div>
</div>
```

### Common Utilities

#### Layout

- `d-flex` - display: flex
- `d-block` - display: block
- `flex-column` - flex-direction: column
- `flex-row` - flex-direction: row

#### Spacing

- `pa-{0-16}` - padding all sides
- `ma-{0-16}` - margin all sides
- `px-4` - padding horizontal
- `py-4` - padding vertical
- `mt-4` - margin top
- `mb-4` - margin bottom

#### Gap

- `ga-2` - gap all (row + column)
- `gx-2` - gap horizontal
- `gy-2` - gap vertical

#### Alignment

- `align-center` - align-items: center
- `justify-center` - justify-content: center
- `justify-space-between` - justify-content: space-between

## CSS Custom Properties

### Global Variables

**Location**: `src/assets/styles/global.css`

```css
:root {
  /* Colors */
  --color-primary: #1976d2;
  --color-secondary: #424242;
  --color-success: #4caf50;
  --color-error: #f44336;
  --color-warning: #fb8c00;
  --color-info: #2196f3;

  /* Scrollbar */
  --scrollbar-thumb: rgba(0, 0, 0, 0.2);
  --scrollbar-thumb-hover: rgba(0, 0, 0, 0.4);
}

/* Dark theme */
.v-theme--dark {
  --scrollbar-thumb: rgba(255, 255, 255, 0.2);
  --scrollbar-thumb-hover: rgba(255, 255, 255, 0.4);
}
```

### Using CSS Variables

```vue
<style scoped>
.component {
  background: var(--color-primary);
  color: rgb(var(--v-theme-on-primary));
}
</style>
```

## Component Styling

### Scoped Styles

Use `<style scoped>` for component-specific styles:

```vue
<style scoped>
.chat-bubble {
  max-width: 80%;
  border-radius: 12px;
  padding: 12px 16px;
}

.user-message {
  background: rgb(var(--v-theme-primary));
  color: white;
}

.ai-message {
  background: rgb(var(--v-theme-surface-variant));
}
</style>
```

### Vuetify Theme Colors

Access Vuetify theme colors:

```vue
<style scoped>
.element {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}
</style>
```

## Responsive Design

### Vuetify Breakpoints

```typescript
import { useDisplay } from 'vuetify'

const { mobile, smAndDown, mdAndUp } = useDisplay()
```

Breakpoints:

- `xs` - < 600px
- `sm` - 600px - 960px
- `md` - 960px - 1280px
- `lg` - 1280px - 1920px
- `xl` - > 1920px

### Responsive Utilities

```vue
<template>
  <v-container v-if="mobile">Mobile view</v-container>
  <v-container v-else>Desktop view</v-container>
</template>
```

### Media Queries

```vue
<style scoped>
.container {
  padding: 16px;
}

/* Mobile */
@media (width <= 960px) {
  .container {
    padding: 8px;
  }
}

/* Desktop */
@media (width > 960px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
```

## Global Styles

### Scrollbar Styling

**Location**: `src/assets/styles/global.css`

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}
```

### Code Highlighting

**Location**: `src/assets/styles/hljs-theme.css`

Syntax highlighting theme for code blocks.

## Theme Configuration

### Vuetify Theme Setup

**Location**: `src/plugins/vuetify.ts`

```typescript
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976d2',
          // ... other colors
        },
      },
      dark: {
        colors: {
          primary: '#90caf9',
          // ... other colors
        },
      },
    },
  },
})
```

## Best Practices

### ✅ DO

- Use Vuetify utility classes
- Use CSS variables for theming
- Use scoped styles for components
- Support both light and dark themes
- Test responsive design
- Use Vuetify breakpoints

### ❌ DON'T

- Use inline styles
- Hardcode colors
- Ignore dark theme
- Create custom CSS when utilities exist
- Mix styling approaches

## Accessibility

### Color Contrast

Ensure sufficient contrast in both themes:

- Text on background
- Interactive elements
- Error/success messages

### Theme Persistence

Theme preference is saved to localStorage and restored on app load.

## Next Steps

- Review [Styling Guidelines](../how-to/add-new-component.md#styling)
- Study [Development Patterns](./patterns.md)
- Check [Components Reference](../reference/components.md)

---

**Theming explained!** This system provides a consistent, accessible theming solution.
