/**
 * Role of the message sender
 */
export type MessageRole = 'user' | 'assistant' | 'system'

/**
 * Current status of the message
 */
export type MessageStatus = 'pending' | 'streaming' | 'completed' | 'error'

/**
 * Represents a single message in a chat
 */
export interface Message {
  /** ID of the chat this message belongs to */
  chatId: string
  /** Message content (supports markdown) */
  content: string
  /** Timestamp when the message was created */
  createdAt: number
  /** Error message if status is 'error' */
  error?: string
  /** Unique identifier for the message */
  id: string
  /** Whether the message has been edited */
  isEdited: boolean
  /** Original content before editing */
  originalContent?: string
  /** Role of the message sender */
  role: MessageRole
  /** Current status of the message */
  status: MessageStatus
  /** Token usage information (for assistant messages) */
  tokenUsage?: TokenUsage
}

/**
 * Token usage statistics for a message
 */
export interface TokenUsage {
  /** Number of tokens in the completion */
  completionTokens: number
  /** Number of tokens in the prompt */
  promptTokens: number
  /** Total tokens used */
  totalTokens: number
}

/**
 * Data required to create a new message
 */
export interface CreateMessagePayload {
  /** ID of the chat to add the message to */
  chatId: string
  /** Message content */
  content: string
  /** Role of the message sender */
  role: MessageRole
}

/**
 * Data required to update an existing message
 */
export interface UpdateMessagePayload {
  /** New content for the message */
  content: string
}

/**
 * Message for streaming response handling
 */
export interface StreamingMessage {
  /** Current accumulated content */
  content: string
  /** Whether streaming is complete */
  isComplete: boolean
  /** Message ID being streamed */
  messageId: string
}
