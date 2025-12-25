import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useChatStore } from '../chat'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    clear: () => {
      store = {}
    },
    getItem: (key: string) => store[key] || null,
    removeItem: (key: string) => {
      delete store[key]
    },
    setItem: (key: string, value: string) => {
      store[key] = value
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useChatStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('state initialization', () => {
    it('should initialize with empty chats', () => {
      const store = useChatStore()
      expect(store.chats).toEqual([])
      expect(store.activeChatId).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.temporaryChatMode).toBe(false)
    })

    it('should have hasChats computed as false when empty', () => {
      const store = useChatStore()
      expect(store.hasChats).toBe(false)
    })
  })

  describe('createChat', () => {
    it('should create a new chat with default values', () => {
      const store = useChatStore()
      const chat = store.createChat()

      expect(chat.id).toBeDefined()
      expect(chat.title).toBe('New Chat')
      expect(chat.messages).toEqual([])
      expect(chat.isPinned).toBe(false)
      expect(chat.isTemporary).toBe(false)
      expect(store.chats).toHaveLength(1)
      expect(store.activeChatId).toBe(chat.id)
    })

    it('should create chat with custom title', () => {
      const store = useChatStore()
      const chat = store.createChat({ title: 'My Custom Chat' })

      expect(chat.title).toBe('My Custom Chat')
    })

    it('should create temporary chat when mode is enabled', () => {
      const store = useChatStore()
      store.setTemporaryChatMode(true)
      const chat = store.createChat()

      expect(chat.isTemporary).toBe(true)
      expect(chat.title).toBe('Temporary Chat')
    })

    it('should create temporary chat via payload', () => {
      const store = useChatStore()
      const chat = store.createChat({ isTemporary: true })

      expect(chat.isTemporary).toBe(true)
    })
  })

  describe('getChatById', () => {
    it('should return chat by id', () => {
      const store = useChatStore()
      const created = store.createChat()
      const found = store.getChatById(created.id)

      expect(found).toEqual(created)
    })

    it('should return undefined for non-existent id', () => {
      const store = useChatStore()
      const found = store.getChatById('non-existent')

      expect(found).toBeUndefined()
    })
  })

  describe('getMessageById', () => {
    it('should return message by id', () => {
      const store = useChatStore()
      const chat = store.createChat()
      const message = store.addMessage({
        chatId: chat.id,
        content: 'Hello',
        role: 'user',
      })

      const found = store.getMessageById(chat.id, message.id)
      expect(found).toEqual(message)
    })

    it('should return undefined for non-existent message', () => {
      const store = useChatStore()
      const chat = store.createChat()
      const found = store.getMessageById(chat.id, 'non-existent')

      expect(found).toBeUndefined()
    })

    it('should return undefined for non-existent chat', () => {
      const store = useChatStore()
      const found = store.getMessageById('non-existent', 'message-id')

      expect(found).toBeUndefined()
    })
  })

  describe('updateChat', () => {
    it('should update chat title', () => {
      const store = useChatStore()
      const chat = store.createChat()
      store.updateChat(chat.id, { title: 'Updated Title' })

      expect(store.getChatById(chat.id)?.title).toBe('Updated Title')
    })

    it('should update chat pinned status', () => {
      const store = useChatStore()
      const chat = store.createChat()
      store.updateChat(chat.id, { isPinned: true })

      expect(store.getChatById(chat.id)?.isPinned).toBe(true)
    })
  })

  describe('deleteChat', () => {
    it('should delete chat', () => {
      const store = useChatStore()
      const chat = store.createChat()
      store.deleteChat(chat.id)

      expect(store.chats).toHaveLength(0)
    })

    it('should update activeChatId when deleting active chat', () => {
      const store = useChatStore()
      const chat1 = store.createChat()
      const chat2 = store.createChat()
      store.setActiveChat(chat2.id)

      store.deleteChat(chat2.id)

      expect(store.activeChatId).toBe(chat1.id)
    })

    it('should set activeChatId to null when deleting last chat', () => {
      const store = useChatStore()
      const chat = store.createChat()
      store.deleteChat(chat.id)

      expect(store.activeChatId).toBeNull()
    })
  })

  describe('addMessage', () => {
    it('should add message to chat', () => {
      const store = useChatStore()
      const chat = store.createChat()
      const message = store.addMessage({
        chatId: chat.id,
        content: 'Hello world',
        role: 'user',
      })

      expect(message.content).toBe('Hello world')
      expect(message.role).toBe('user')
      expect(message.status).toBe('completed')
      expect(store.getChatById(chat.id)?.messages).toHaveLength(1)
    })

    it('should auto-generate title from first user message', () => {
      const store = useChatStore()
      const chat = store.createChat()
      store.addMessage({
        chatId: chat.id,
        content: 'How do I learn JavaScript?',
        role: 'user',
      })

      expect(store.getChatById(chat.id)?.title).toBe('How do I learn JavaScript?')
    })

    it('should throw error for non-existent chat', () => {
      const store = useChatStore()

      expect(() =>
        store.addMessage({
          chatId: 'non-existent',
          content: 'Hello',
          role: 'user',
        }),
      ).toThrow()
    })
  })

  describe('updateMessageContent', () => {
    it('should update message content', () => {
      const store = useChatStore()
      const chat = store.createChat()
      const message = store.addMessage({
        chatId: chat.id,
        content: 'Original',
        role: 'user',
      })

      store.updateMessageContent(chat.id, message.id, 'Updated')
      const updated = store.getMessageById(chat.id, message.id)

      expect(updated?.content).toBe('Updated')
      expect(updated?.isEdited).toBe(true)
      expect(updated?.originalContent).toBe('Original')
    })
  })

  describe('updateMessageStatus', () => {
    it('should update message status', () => {
      const store = useChatStore()
      const chat = store.createChat()
      const message = store.addMessage({
        chatId: chat.id,
        content: 'Hello',
        role: 'assistant',
      })

      store.updateMessageStatus(chat.id, message.id, 'streaming')
      expect(store.getMessageById(chat.id, message.id)?.status).toBe('streaming')

      store.updateMessageStatus(chat.id, message.id, 'error')
      expect(store.getMessageById(chat.id, message.id)?.status).toBe('error')
    })
  })

  describe('appendToMessage', () => {
    it('should append content to message', () => {
      const store = useChatStore()
      const chat = store.createChat()
      const message = store.addMessage({
        chatId: chat.id,
        content: 'Hello',
        role: 'assistant',
      })

      store.appendToMessage(chat.id, message.id, ' world')
      expect(store.getMessageById(chat.id, message.id)?.content).toBe('Hello world')
    })
  })

  describe('deleteMessage', () => {
    it('should delete message from chat', () => {
      const store = useChatStore()
      const chat = store.createChat()
      const message = store.addMessage({
        chatId: chat.id,
        content: 'Hello',
        role: 'user',
      })

      store.deleteMessage(chat.id, message.id)
      expect(store.getChatById(chat.id)?.messages).toHaveLength(0)
    })
  })

  describe('deleteMessagesAfter', () => {
    it('should delete all messages after specified message', () => {
      const store = useChatStore()
      const chat = store.createChat()
      const msg1 = store.addMessage({ chatId: chat.id, content: 'First', role: 'user' })
      store.addMessage({ chatId: chat.id, content: 'Second', role: 'assistant' })
      store.addMessage({ chatId: chat.id, content: 'Third', role: 'user' })

      store.deleteMessagesAfter(chat.id, msg1.id)

      const updatedChat = store.getChatById(chat.id)
      expect(updatedChat?.messages).toHaveLength(1)
      expect(updatedChat?.messages[0]?.content).toBe('First')
    })
  })

  describe('convertToRegularChat', () => {
    it('should convert temporary chat to regular', () => {
      const store = useChatStore()
      const chat = store.createChat({ isTemporary: true })

      expect(chat.isTemporary).toBe(true)

      store.convertToRegularChat(chat.id)
      expect(store.getChatById(chat.id)?.isTemporary).toBe(false)
    })
  })

  describe('clearAllChats', () => {
    it('should clear all chats', () => {
      const store = useChatStore()
      store.createChat()
      store.createChat()
      store.createChat()

      expect(store.chats).toHaveLength(3)

      store.clearAllChats()
      expect(store.chats).toHaveLength(0)
      expect(store.activeChatId).toBeNull()
    })
  })

  describe('chatList computed', () => {
    it('should sort chats by pinned first, then by updatedAt', () => {
      const store = useChatStore()
      const chat1 = store.createChat({ title: 'First' })
      const chat2 = store.createChat({ title: 'Second' })
      const chat3 = store.createChat({ title: 'Third' })

      store.updateChat(chat1.id, { isPinned: true })

      const list = store.chatList
      expect(list[0]?.id).toBe(chat1.id) // Pinned first
      expect(list[1]?.id).toBe(chat3.id) // Most recent unpinned
      expect(list[2]?.id).toBe(chat2.id)
    })
  })

  describe('getLastUserMessage', () => {
    it('should return last user message', () => {
      const store = useChatStore()
      const chat = store.createChat()
      store.addMessage({ chatId: chat.id, content: 'User 1', role: 'user' })
      store.addMessage({ chatId: chat.id, content: 'Assistant', role: 'assistant' })
      store.addMessage({ chatId: chat.id, content: 'User 2', role: 'user' })

      const lastUserMsg = store.getLastUserMessage(chat.id)
      expect(lastUserMsg?.content).toBe('User 2')
    })

    it('should return undefined if no user messages', () => {
      const store = useChatStore()
      const chat = store.createChat()
      store.addMessage({ chatId: chat.id, content: 'Assistant', role: 'assistant' })

      const lastUserMsg = store.getLastUserMessage(chat.id)
      expect(lastUserMsg).toBeUndefined()
    })
  })
})
