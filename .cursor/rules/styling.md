---
description: CSS and Styling Guidelines
globs:
  - '**/*.vue'
  - '**/*.css'
alwaysApply: false
---

# Styling Guidelines

## CSS Custom Properties

Use CSS custom properties for theming (defined in `assets/styles/global.css`):

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

## Prefer Vuetify Utilities

Use Vuetify utility classes instead of custom CSS:

```vue
<!-- ✅ Good - Vuetify utilities -->
<div class="d-flex flex-column ga-4 pa-4">
  <v-card rounded="lg">
    <v-card-title class="text-h5">Title</v-card-title>
  </v-card>
</div>

<!-- ❌ Bad - Custom CSS -->
<div style="display: flex; flex-direction: column; gap: 16px; padding: 16px;">
  <div style="border-radius: 8px;">
    <h2 style="font-size: 24px;">Title</h2>
  </div>
</div>
```

## Scoped Styles

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

## Responsive Design

Use Vuetify breakpoints:

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

Place global styles in `assets/styles/global.css`:

```css
/* Scrollbar styling */
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
```

## Avoid Inline Styles

Don't use inline styles unless absolutely necessary:

```vue
<!-- ❌ Bad -->
<div :style="{ color: 'red', fontSize: '16px' }">Text</div>

<!-- ✅ Good -->
<div class="error-text">Text</div>

<style scoped>
.error-text {
  color: rgb(var(--v-theme-error));
  font-size: 16px;
}
</style>
```

## CSS Architecture

```
assets/styles/
├── global.css       # Global styles, CSS variables
└── hljs-theme.css   # Highlight.js code theme
```

Import in `main.ts`:

```typescript
import '@/assets/styles/global.css'
import '@/assets/styles/hljs-theme.css'
```
