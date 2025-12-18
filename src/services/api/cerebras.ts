import type {
  ApiMessage,
  ApiResponse,
  ChatCompletionRequest,
  ChatCompletionResponse,
  StreamingChunk,
} from '@/types/api'
import type { AxiosInstance } from 'axios'

import axios from 'axios'

import { useApiStore } from '@/stores/api'

export type ApiErrorCode =
  | 'unauthorized'
  | 'rateLimited'
  | 'serverError'
  | 'networkError'
  | 'unknown'

export function getErrorCodeFromStatus(status: number): ApiErrorCode {
  if (status === 401 || status === 403) return 'unauthorized'
  if (status === 429) return 'rateLimited'
  if (status >= 500) return 'serverError'
  return 'unknown'
}

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

function createApiInstance(): AxiosInstance {
  const apiStore = useApiStore()

  const instance = axios.create({
    baseURL: apiStore.config.baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 60000,
  })

  instance.interceptors.request.use(config => {
    const apiStore = useApiStore()
    if (apiStore.apiKey) {
      config.headers.Authorization = `Bearer ${apiStore.apiKey}`
    }
    return config
  })

  instance.interceptors.response.use(
    response => response,
    error => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data as { error?: { message?: string } }
          const message = errorData?.error?.message || error.message
          console.error('Cerebras API Error:', message)
          return Promise.reject(new Error(message))
        } else if (error.request) {
          console.error('Network Error:', error.message)
          return Promise.reject(new Error('Network error - please check your connection'))
        }
      }
      return Promise.reject(error)
    },
  )

  return instance
}

export async function sendChatCompletion(
  messages: ApiMessage[],
): Promise<ApiResponse<ChatCompletionResponse>> {
  try {
    const apiStore = useApiStore()
    const api = createApiInstance()

    const requestBody: ChatCompletionRequest = {
      max_tokens: apiStore.config.maxTokens,
      messages,
      model: apiStore.config.model,
      stream: false,
      temperature: apiStore.config.temperature,
      top_p: apiStore.config.topP,
    }

    const response = await api.post<ChatCompletionResponse>('/chat/completions', requestBody)

    return {
      data: response.data,
      success: true,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    return {
      error: message,
      success: false,
    }
  }
}

export async function sendStreamingChatCompletion(
  messages: ApiMessage[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const apiStore = useApiStore()

  const requestBody: ChatCompletionRequest = {
    max_tokens: apiStore.config.maxTokens,
    messages,
    model: apiStore.config.model,
    stream: true,
    temperature: apiStore.config.temperature,
    top_p: apiStore.config.topP,
  }

  try {
    const response = await fetch(`${apiStore.config.baseUrl}/chat/completions`, {
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: `Bearer ${apiStore.apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal,
    })

    if (!response.ok) {
      const errorCode = getErrorCodeFromStatus(response.status)
      throw new Error(errorCode)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Response body is not readable')
    }

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

        if (trimmedLine === '') {
          continue
        }

        if (trimmedLine === 'data: [DONE]') {
          onComplete()
          return
        }

        if (trimmedLine.startsWith('data: ')) {
          try {
            const jsonData = trimmedLine.slice(6)
            const chunk: StreamingChunk = JSON.parse(jsonData)

            const delta = chunk.choices[0]?.delta
            if (delta?.content) {
              onChunk(delta.content)
            }

            // Check for finish reason
            if (chunk.choices[0]?.finish_reason) {
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
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return
      }
      const knownCodes: ApiErrorCode[] = [
        'unauthorized',
        'rateLimited',
        'serverError',
        'networkError',
        'unknown',
      ]
      if (knownCodes.includes(error.message as ApiErrorCode)) {
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
