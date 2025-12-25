---
description: Testing and Quality Assurance Guidelines
globs:
  - '**/*.ts'
  - '**/*.vue'
alwaysApply: false
---

# Testing Guidelines

## Unit Testing Stack

| Tool             | Purpose                           |
| ---------------- | --------------------------------- |
| Vitest           | Test runner and assertion library |
| @vue/test-utils  | Vue component testing utilities   |
| happy-dom        | DOM environment for tests         |
| @vitest/coverage | Code coverage reporting           |

## Test File Structure

```
src/
├── composables/
│   └── __tests__/
│       └── useClipboard.test.ts
├── utils/
│   └── __tests__/
│       ├── date.test.ts
│       ├── id.test.ts
│       ├── storage.test.ts
│       └── validation.test.ts
└── test/
    └── setup.ts
```

## Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Writing Tests

### Test Naming Convention

- Use `.test.ts` suffix for test files
- Place tests in `__tests__` directory next to source files
- Name describe blocks after the module/function being tested

```typescript
import { describe, expect, it } from 'vitest'

import { myFunction } from '../myModule'

describe('myFunction', () => {
  it('should do something specific', () => {
    expect(myFunction('input')).toBe('expected output')
  })
})
```

### Testing Utilities

```typescript
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

describe('myModule', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should handle async operations', async () => {
    const mockFn = vi.fn().mockResolvedValue('result')
    await expect(mockFn()).resolves.toBe('result')
  })
})
```

### Testing Composables

```typescript
import { describe, expect, it } from 'vitest'

import { useMyComposable } from '../useMyComposable'

describe('useMyComposable', () => {
  it('should return reactive state', () => {
    const { value, setValue } = useMyComposable()

    expect(value.value).toBe(0)

    setValue(5)
    expect(value.value).toBe(5)
  })
})
```

### Testing Vue Components

```typescript
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('should render props', () => {
    const wrapper = mount(MyComponent, {
      props: { message: 'Hello' },
    })

    expect(wrapper.text()).toContain('Hello')
  })

  it('should emit events', async () => {
    const wrapper = mount(MyComponent)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

## Mocking

### Mocking Modules

```typescript
import { vi } from 'vitest'

vi.mock('@/services/api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'mocked' }),
}))
```

### Mocking Browser APIs

Setup file (`src/test/setup.ts`) provides mocks for:

- `localStorage`
- `navigator.clipboard`
- `crypto.randomUUID`

### Spying on Functions

```typescript
const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
// ... test code
expect(spy).toHaveBeenCalledWith('error message')
spy.mockRestore()
```

## Coverage Thresholds

Configured in `vitest.config.ts`:

| Metric     | Threshold |
| ---------- | --------- |
| Lines      | 60%       |
| Functions  | 60%       |
| Branches   | 60%       |
| Statements | 60%       |

## CI Integration

Tests run automatically:

- **Pre-commit**: Husky runs `npm run test` before each commit
- **GitHub Actions**: CI pipeline runs tests on push/PR

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

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how
2. **Keep tests isolated** - Each test should be independent
3. **Use meaningful assertions** - Be specific about expected outcomes
4. **Avoid testing external dependencies** - Mock API calls, timers, etc.
5. **Write tests first when fixing bugs** - Ensures the bug is covered
