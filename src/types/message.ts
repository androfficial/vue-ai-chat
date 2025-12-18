export type MessageRole = 'user' | 'assistant' | 'system'

export type MessageStatus = 'pending' | 'streaming' | 'completed' | 'error'

export interface Message {
  chatId: string
  content: string
  createdAt: number
  error?: string
  id: string
  isEdited: boolean
  originalContent?: string
  role: MessageRole
  status: MessageStatus
  tokenUsage?: TokenUsage
}

export interface TokenUsage {
  completionTokens: number
  promptTokens: number
  totalTokens: number
}

export interface CreateMessagePayload {
  chatId: string
  content: string
  role: MessageRole
}

export interface UpdateMessagePayload {
  content: string
}

export interface StreamingMessage {
  content: string
  isComplete: boolean
  messageId: string
}
