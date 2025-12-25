---
description: Vuetify 3 Material Design Guidelines
globs:
  - '**/*.vue'
alwaysApply: false
---

# Vuetify 3 Guidelines

## Utility Classes

Prefer Vuetify utility classes over custom CSS:

### Layout

- `d-flex` - display: flex
- `d-block` - display: block
- `d-none` - display: none
- `flex-column` - flex-direction: column
- `flex-row` - flex-direction: row

### Spacing

- `pa-{0-16}` - padding all sides (e.g., `pa-4`)
- `ma-{0-16}` - margin all sides (e.g., `ma-2`)
- `px-4` - padding left/right
- `py-4` - padding top/bottom
- `mt-4` - margin top
- `mb-4` - margin bottom

### Gap (Vuetify 3+)

- `ga-2` - gap all (row + column)
- `gx-2` - gap horizontal
- `gy-2` - gap vertical

### Alignment

- `align-center` - align-items: center
- `justify-center` - justify-content: center
- `justify-space-between`

## Components

### Buttons

```vue
<v-btn color="primary" variant="flat" size="default" @click="handleClick">
  Click Me
</v-btn>
```

### Cards

```vue
<v-card rounded="lg">
  <v-card-title>Title</v-card-title>
  <v-card-text>Content</v-card-text>
  <v-card-actions>
    <v-btn>Action</v-btn>
  </v-card-actions>
</v-card>
```

### Icons (Material Design Icons)

```vue
<v-icon icon="mdi-check" size="20" />
<v-icon>mdi-account</v-icon>
```

## Theming

Use theme colors:

- `color="primary"` - primary theme color
- `color="secondary"` - secondary theme color
- `color="error"` - error color
- `color="success"` - success color

## Responsive Design

Use Vuetify display breakpoints:

```typescript
import { useDisplay } from 'vuetify'

const { mobile, smAndDown, mdAndUp } = useDisplay()

// In template
<v-container v-if="mobile">Mobile view</v-container>
```

Breakpoints:

- `xs` - < 600px
- `sm` - 600px - 960px
- `md` - 960px - 1280px
- `lg` - 1280px - 1920px
- `xl` - > 1920px
