import type { Message } from './message'

/**
 * Represents a chat conversation
 */
export interface Chat {
  /** Timestamp when the chat was created */
  createdAt: number
  /** Unique identifier for the chat */
  id: string
  /** Whether the chat is pinned to the top */
  isPinned: boolean
  /** Whether this is a temporary chat (not saved to history) */
  isTemporary: boolean
  /** Array of messages in the chat */
  messages: Message[]
  /** Chat title (auto-generated or user-defined) */
  title: string
  /** Timestamp when the chat was last updated */
  updatedAt: number
}

/**
 * Data required to create a new chat
 */
export interface CreateChatPayload {
  /** Optional initial message content */
  initialMessage?: string
  /** Whether this is a temporary chat */
  isTemporary?: boolean
  /** Optional custom title for the chat */
  title?: string
}

/**
 * Data required to update an existing chat
 */
export interface UpdateChatPayload {
  /** Whether the chat is pinned */
  isPinned?: boolean
  /** New title for the chat */
  title?: string
}

/**
 * Chat list item for sidebar display
 */
export interface ChatListItem {
  /** Chat unique identifier */
  id: string
  /** Whether the chat is pinned */
  isPinned: boolean
  /** Whether this is a temporary chat */
  isTemporary: boolean
  /** Last message preview */
  lastMessage?: string
  /** Chat title */
  title: string
  /** Timestamp of last activity */
  updatedAt: number
}
