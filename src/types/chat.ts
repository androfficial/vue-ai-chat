import type { Message } from './message'

export interface Chat {
  createdAt: number
  id: string
  isPinned: boolean
  isTemporary: boolean
  messages: Message[]
  title: string
  updatedAt: number
}

export interface CreateChatPayload {
  initialMessage?: string
  isTemporary?: boolean
  title?: string
}

export interface UpdateChatPayload {
  isPinned?: boolean
  title?: string
}

export interface ChatListItem {
  id: string
  isPinned: boolean
  isTemporary: boolean
  lastMessage?: string
  title: string
  updatedAt: number
}
