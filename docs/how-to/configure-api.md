# Configuring API

This guide explains how to configure the Cerebras AI API integration in the application.

## Overview

The application uses Cerebras AI API for chat completions. Configuration is managed through the API store and persisted in localStorage.

## Configuration Options

### API Key

Your Cerebras API key is required for all API requests. Get your key at [cloud.cerebras.ai](https://cloud.cerebras.ai).

### Available Models

| Model ID        | Name          | Description                |
| --------------- | ------------- | -------------------------- |
| `llama-3.3-70b` | Llama 3.3 70B | Best for complex tasks     |
| `llama3.1-8b`   | Llama 3.1 8B  | Fast and efficient         |
| `qwen-3-32b`    | Qwen 3 32B    | Great multilingual support |
| `gpt-oss-120b`  | GPT OSS 120B  | Reasoning model            |

### API Parameters

- **maxTokens** (default: 4096) - Maximum tokens in response
- **temperature** (default: 0.7) - Response randomness (0-2)
- **topP** (default: 1.0) - Nucleus sampling parameter

## Configuration Methods

### Method 1: Settings Page (Recommended)

1. Open the application
2. Click **Settings** in the sidebar
3. Navigate to **API Settings**
4. Enter your API key
5. Select a model
6. Adjust parameters if needed
7. Click **Save**

### Method 2: Programmatic Configuration

```typescript
import { useApiStore } from '@/stores'

const apiStore = useApiStore()

// Set API key
apiStore.setApiKey('your-api-key-here')

// Set model
apiStore.setModel('llama-3.3-70b')

// Update multiple settings
apiStore.updateConfig({
  maxTokens: 2048,
  temperature: 0.8,
})
```

### Method 3: Direct Storage (Not Recommended)

You can directly set localStorage, but this is not recommended:

```typescript
localStorage.setItem(
  'ai-chat:api-config',
  JSON.stringify({
    apiKey: 'your-key',
    model: 'llama-3.3-70b',
  }),
)
```

## Default Configuration

The default configuration is defined in `src/types/api.ts`:

```typescript
export const DEFAULT_API_CONFIG: Omit<ApiConfig, 'apiKey'> = {
  baseUrl: 'https://api.cerebras.ai/v1',
  maxTokens: 4096,
  model: 'llama-3.3-70b',
  temperature: 0.7,
  topP: 1,
}
```

## Storage

API configuration is stored in localStorage with the key `ai-chat:api-config`:

```typescript
// Storage structure
{
  apiKey: string
  baseUrl: string
  maxTokens: number
  model: string
  temperature: number
  topP: number
}
```

## API Store Reference

### State

```typescript
const apiStore = useApiStore()

// Access configuration
apiStore.config // Full config object
apiStore.apiKey // API key (computed)
apiStore.model // Current model (computed)
apiStore.hasApiKey // Boolean: has API key
apiStore.isConfigured // Boolean: is fully configured
```

### Actions

```typescript
// Set API key
apiStore.setApiKey('new-key')

// Set model
apiStore.setModel('llama3.1-8b')

// Update multiple settings
apiStore.updateConfig({
  maxTokens: 2048,
  temperature: 0.8,
})

// Reset to defaults
apiStore.resetConfig()
```

## Testing API Connection

The application provides a connection test function:

```typescript
import { testApiConnection } from '@/services/api/cerebras'

const result = await testApiConnection()

if (result.success) {
  console.log('API connection successful')
} else {
  console.error('API connection failed:', result.error)
}
```

## Error Handling

The API service handles various error scenarios:

### Error Codes

- `networkError` - Network connection issues
- `unauthorized` - Invalid API key (401/403)
- `rateLimited` - Rate limit exceeded (429)
- `serverError` - Server errors (500+)
- `unknown` - Unknown errors

### Error Handling Example

```typescript
import { sendStreamingChatCompletion } from '@/services/api/cerebras'

try {
  await sendStreamingChatCompletion(messages, onChunk, onComplete, errorCode => {
    switch (errorCode) {
      case 'unauthorized':
        // Show error: invalid API key
        break
      case 'rateLimited':
        // Show error: rate limit
        break
      default:
      // Show generic error
    }
  })
} catch (error) {
  // Handle error
}
```

## Environment Variables

For development, you can use environment variables (optional):

```bash
# .env.local
VITE_CEREBRAS_API_KEY=your-key-here
VITE_CEREBRAS_BASE_URL=https://api.cerebras.ai/v1
```

Then access in code:

```typescript
const apiKey = import.meta.env.VITE_CEREBRAS_API_KEY
```

**Note**: Environment variables are exposed to the client, so don't use them for production secrets.

## Best Practices

### ✅ DO

- Store API key securely (localStorage is acceptable for client-side apps)
- Validate API key before making requests
- Handle errors gracefully
- Show user-friendly error messages
- Test API connection on configuration change

### ❌ DON'T

- Hardcode API keys in source code
- Commit API keys to version control
- Expose API keys in URLs or logs
- Ignore error responses

## Troubleshooting

### API Key Not Working

1. Verify the key is correct (no extra spaces)
2. Check key is active on [cloud.cerebras.ai](https://cloud.cerebras.ai)
3. Verify key has necessary permissions
4. Try regenerating the key

### Connection Errors

1. Check internet connection
2. Verify API endpoint is accessible
3. Check browser console for errors
4. Verify CORS settings (if applicable)

### Rate Limiting

1. Reduce request frequency
2. Check your API plan limits
3. Implement request queuing
4. Add retry logic with backoff

## Next Steps

- Learn about [API Reference](../reference/api-reference.md)
- Review [Streaming Responses](../explanation/streaming.md)
- Study [Error Handling](../explanation/patterns.md#error-handling)

---

**API configured!** You're ready to use the Cerebras AI API in your application.
