import type {
  ApiMessage,
  ApiResponse,
  ChatCompletionRequest,
  ChatCompletionResponse,
  StreamingChunk,
} from '@/types'

import { useApiStore } from '@/stores/api'

/**
 * API error codes for handling different error scenarios
 */
export type ApiErrorCode =
  | 'networkError'
  | 'rateLimited'
  | 'serverError'
  | 'unauthorized'
  | 'unknown'

/**
 * Array of all valid API error codes for type checking
 */
const API_ERROR_CODES: readonly ApiErrorCode[] = [
  'networkError',
  'rateLimited',
  'serverError',
  'unauthorized',
  'unknown',
] as const

/**
 * Type guard to check if a string is a valid ApiErrorCode
 */
function isApiErrorCode(value: string): value is ApiErrorCode {
  return API_ERROR_CODES.includes(value as ApiErrorCode)
}

/**
 * Map HTTP status code to API error code
 */
export function getErrorCodeFromStatus(status: number): ApiErrorCode {
  if (status === 401 || status === 403) return 'unauthorized'
  if (status === 429) return 'rateLimited'
  if (status >= 500) return 'serverError'
  return 'unknown'
}

/**
 * Determine error code from error object
 */
export function getErrorCode(error: unknown, status?: number): ApiErrorCode {
  if (status) {
    return getErrorCodeFromStatus(status)
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection')) {
      return 'networkError'
    }
    if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('invalid api key')) {
      return 'unauthorized'
    }
    if (msg.includes('429') || msg.includes('rate limit') || msg.includes('too many')) {
      return 'rateLimited'
    }
    if (
      msg.includes('500') ||
      msg.includes('502') ||
      msg.includes('503') ||
      msg.includes('server')
    ) {
      return 'serverError'
    }
  }

  return 'unknown'
}

/**
 * API client configuration
 */
interface ApiClientConfig {
  apiKey: string
  baseUrl: string
}

/**
 * Get current API configuration from store
 */
function getApiConfig(): ApiClientConfig {
  const apiStore = useApiStore()
  return {
    apiKey: apiStore.apiKey,
    baseUrl: apiStore.config.baseUrl,
  }
}

/**
 * Build request headers for API calls
 */
function buildHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }
}

/**
 * Build chat completion request body
 */
function buildRequestBody(messages: ApiMessage[], stream: boolean): ChatCompletionRequest {
  const apiStore = useApiStore()
  return {
    max_tokens: apiStore.config.maxTokens,
    messages,
    model: apiStore.config.model,
    stream,
    temperature: apiStore.config.temperature,
    top_p: apiStore.config.topP,
  }
}

/**
 * Unified fetch wrapper for API requests
 */
async function apiRequest(
  endpoint: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<Response> {
  const { apiKey, baseUrl } = getApiConfig()

  const response = await fetch(`${baseUrl}${endpoint}`, {
    body: JSON.stringify(body),
    headers: buildHeaders(apiKey),
    method: 'POST',
    signal,
  })

  if (!response.ok) {
    const errorCode = getErrorCodeFromStatus(response.status)
    throw new Error(errorCode)
  }

  return response
}

/**
 * Send non-streaming chat completion request
 */
export async function sendChatCompletion(
  messages: ApiMessage[],
): Promise<ApiResponse<ChatCompletionResponse>> {
  try {
    const requestBody = buildRequestBody(messages, false)
    const response = await apiRequest('/chat/completions', requestBody)
    const data = (await response.json()) as ChatCompletionResponse

    return {
      data,
      success: true,
    }
  } catch (error) {
    const errorCode =
      error instanceof Error && isApiErrorCode(error.message) ? error.message : getErrorCode(error)
    return {
      error: errorCode,
      success: false,
    }
  }
}

/**
 * Process SSE stream and extract content chunks
 */
async function processStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (content: string) => void,
  onComplete: () => void,
): Promise<void> {
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    const chunk = decoder.decode(value, { stream: true })
    buffer += chunk

    // Process complete SSE events
    const lines = buffer.split('\n')
    buffer = lines.pop() || '' // Keep incomplete line in buffer

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (trimmedLine === '' || trimmedLine === 'data: [DONE]') {
        if (trimmedLine === 'data: [DONE]') {
          onComplete()
          return
        }
        continue
      }

      if (trimmedLine.startsWith('data: ')) {
        try {
          const jsonData = trimmedLine.slice(6)
          const streamChunk: StreamingChunk = JSON.parse(jsonData)

          const delta = streamChunk.choices[0]?.delta
          if (delta?.content) {
            onChunk(delta.content)
          }

          // Check for finish reason
          if (streamChunk.choices[0]?.finish_reason) {
            onComplete()
            return
          }
        } catch {
          console.warn('Failed to parse streaming chunk:', trimmedLine)
        }
      }
    }
  }

  onComplete()
}

/**
 * Send streaming chat completion request
 */
export async function sendStreamingChatCompletion(
  messages: ApiMessage[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  try {
    const requestBody = buildRequestBody(messages, true)
    const response = await apiRequest('/chat/completions', requestBody, signal)

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Response body is not readable')
    }

    await processStream(reader, onChunk, onComplete)
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return
      }
      if (isApiErrorCode(error.message)) {
        onError(error.message)
      } else {
        onError(getErrorCode(error))
      }
    } else {
      onError('unknown')
    }
  }
}

export async function testApiConnection(): Promise<ApiResponse<boolean>> {
  try {
    const result = await sendChatCompletion([{ content: 'Hello', role: 'user' }])

    if (result.success) {
      return { data: true, success: true }
    }

    return { error: result.error, success: false }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Connection test failed'
    return { error: message, success: false }
  }
}
