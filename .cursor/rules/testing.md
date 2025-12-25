---
description: Testing and Quality Assurance Guidelines
globs:
  - '**/*.ts'
  - '**/*.vue'
alwaysApply: false
---

# Testing Guidelines

## Manual Testing Checklist

When testing features, check:

### Functionality

- ✅ Feature works as expected
- ✅ Edge cases handled (empty input, long text, special chars)
- ✅ Error states display correctly
- ✅ Loading states work properly

### Themes

- ✅ Light theme - colors, contrast, readability
- ✅ Dark theme - colors, contrast, readability
- ✅ System theme - follows OS preference

### Languages

- ✅ English - all text displays correctly
- ✅ Ukrainian - all text displays correctly
- ✅ No missing translation keys

### Responsive Design

- ✅ Desktop (> 960px) - layout, sidebar
- ✅ Tablet (600px - 960px) - responsive behavior
- ✅ Mobile (< 600px) - touch-friendly, overlay sidebar

### Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

## Code Quality Checks

Before committing:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format check
npm run format
```

## E2E Testing (Playwright)

When implemented, run:

```bash
npm run test:e2e
```

## Common Test Scenarios

### Chat Functionality

1. Create new chat
2. Send message
3. Receive AI response
4. Edit message
5. Delete message
6. Delete chat

### Settings

1. Update API key
2. Change model
3. Switch theme
4. Change language
5. Reset all settings

### Error Handling

1. Send message without API key
2. Send empty message
3. Network error simulation
4. Invalid API key

## Performance Testing

Monitor:

- Bundle size (`npm run build` - check dist/)
- Loading time
- Memory usage (Chrome DevTools)
- Smooth animations (60 FPS)

## Accessibility Testing

Verify:

- Keyboard navigation (Tab, Enter, Esc)
- Screen reader compatibility
- Color contrast (WCAG AA)
- Focus indicators
- ARIA labels
