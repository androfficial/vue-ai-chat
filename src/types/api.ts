import type { MessageRole } from './message'

/**
 * Cerebras API configuration
 */
export interface ApiConfig {
  /** API key for authentication */
  apiKey: string
  /** API base URL */
  baseUrl: string
  /** Maximum tokens for completion */
  maxTokens: number
  /** Model to use for completions */
  model: string
  /** Temperature for response randomness (0-1) */
  temperature: number
  /** Top-p sampling parameter */
  topP: number
}

/**
 * Available Cerebras models
 */
export const CEREBRAS_MODELS = [
  { description: 'Best for complex tasks', id: 'llama-3.3-70b', name: 'Llama 3.3 70B' },
  { description: 'Fast and efficient', id: 'llama3.1-8b', name: 'Llama 3.1 8B' },
  { description: 'Great multilingual support', id: 'qwen-3-32b', name: 'Qwen 3 32B' },
  { description: 'Reasoning model', id: 'gpt-oss-120b', name: 'GPT OSS 120B' },
] as const

/**
 * Default API configuration
 */
export const DEFAULT_API_CONFIG: Omit<ApiConfig, 'apiKey'> = {
  baseUrl: 'https://api.cerebras.ai/v1',
  maxTokens: 4096,
  model: 'llama-3.3-70b',
  temperature: 0.7,
  topP: 1,
}

/**
 * Message format for API request
 */
export interface ApiMessage {
  /** Message content */
  content: string
  /** Role of the message sender */
  role: MessageRole
}

/**
 * Request body for chat completions API
 */
export interface ChatCompletionRequest {
  /** Maximum tokens to generate */
  max_tokens: number
  /** Array of messages in the conversation */
  messages: ApiMessage[]
  /** Model identifier */
  model: string
  /** Whether to stream the response */
  stream: boolean
  /** Temperature for randomness */
  temperature: number
  /** Top-p sampling */
  top_p: number
}

/**
 * Response from chat completions API (non-streaming)
 */
export interface ChatCompletionResponse {
  /** Array of completion choices */
  choices: ChatCompletionChoice[]
  /** Timestamp of creation */
  created: number
  /** Unique identifier for the completion */
  id: string
  /** Model used */
  model: string
  /** Object type */
  object: string
  /** Token usage statistics */
  usage: ApiTokenUsage
}

/**
 * Single choice in completion response
 */
export interface ChatCompletionChoice {
  /** Reason for completion */
  finish_reason: 'stop' | 'length' | 'content_filter' | null
  /** Index of the choice */
  index: number
  /** Generated message */
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
