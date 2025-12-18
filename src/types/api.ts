import type { MessageRole } from './message'

export interface ApiConfig {
  apiKey: string
  baseUrl: string
  maxTokens: number
  model: string
  temperature: number
  topP: number
}

export const CEREBRAS_MODELS = [
  { description: 'Best for complex tasks', id: 'llama-3.3-70b', name: 'Llama 3.3 70B' },
  { description: 'Fast and efficient', id: 'llama3.1-8b', name: 'Llama 3.1 8B' },
  { description: 'Great multilingual support', id: 'qwen-3-32b', name: 'Qwen 3 32B' },
  { description: 'Reasoning model', id: 'gpt-oss-120b', name: 'GPT OSS 120B' },
] as const

export const DEFAULT_API_CONFIG: Omit<ApiConfig, 'apiKey'> = {
  baseUrl: 'https://api.cerebras.ai/v1',
  maxTokens: 4096,
  model: 'llama-3.3-70b',
  temperature: 0.7,
  topP: 1,
}

export interface ApiMessage {
  content: string
  role: MessageRole
}

export interface ChatCompletionRequest {
  max_tokens: number
  messages: ApiMessage[]
  model: string
  stream: boolean
  temperature: number
  top_p: number
}

export interface ChatCompletionResponse {
  choices: ChatCompletionChoice[]
  created: number
  id: string
  model: string
  object: string
  usage: ApiTokenUsage
}

export interface ChatCompletionChoice {
  finish_reason: 'stop' | 'length' | 'content_filter' | null
  index: number
  message: ApiMessage
}

/**
 * Token usage from API response
 */
export interface ApiTokenUsage {
  /** Tokens in the completion */
  completion_tokens: number
  /** Tokens in the prompt */
  prompt_tokens: number
  /** Total tokens used */
  total_tokens: number
}

/**
 * Streaming response chunk
 */
export interface StreamingChunk {
  /** Array of delta choices */
  choices: StreamingChoice[]
  /** Timestamp of creation */
  created: number
  /** Chunk identifier */
  id: string
  /** Model used */
  model: string
  /** Object type */
  object: string
}

/**
 * Single choice in streaming response
 */
export interface StreamingChoice {
  /** Delta content */
  delta: StreamingDelta
  /** Reason for completion (present on last chunk) */
  finish_reason: 'stop' | 'length' | 'content_filter' | null
  /** Index of the choice */
  index: number
}

/**
 * Delta content in streaming response
 */
export interface StreamingDelta {
  /** Content delta */
  content?: string
  /** Role of the message (present in first chunk) */
  role?: MessageRole
}

/**
 * API error response
 */
export interface ApiError {
  /** Error object */
  error: {
    /** Error message */
    message: string
    /** Error type */
    type: string
    /** Error code */
    code: string
  }
}

/**
 * Generic API response wrapper
 */
export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }
