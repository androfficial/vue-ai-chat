import type {
  Chat,
  ChatListItem,
  CreateChatPayload,
  CreateMessagePayload,
  Message,
  MessageStatus,
  UpdateChatPayload,
} from '@/types'

import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { now } from '@/utils/date'
import { generateId } from '@/utils/id'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage'
import { generateChatTitle } from '@/utils/validation'

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>(loadChats())
  const activeChatId = ref<string | null>(null)
  const isLoading = ref(false)
  const temporaryChatMode = ref(false)

  function loadChats(): Chat[] {
    const stored = getStorageItem<Chat[]>(STORAGE_KEYS.CHATS) ?? []
    return stored.filter(chat => !chat.isTemporary)
  }

  watch(
    chats,
    newChats => {
      const persistentChats = newChats.filter(chat => !chat.isTemporary)
      setStorageItem(STORAGE_KEYS.CHATS, persistentChats)
    },
    { deep: true },
  )

  const activeChat = computed(() => {
    if (!activeChatId.value) return null
    return chats.value.find(chat => chat.id === activeChatId.value) ?? null
  })

  const chatList = computed<ChatListItem[]>(() => {
    return chats.value
      .map(chat => ({
        id: chat.id,
        isPinned: chat.isPinned,
        isTemporary: chat.isTemporary,
        lastMessage: chat.messages[chat.messages.length - 1]?.content,
        title: chat.title,
        updatedAt: chat.updatedAt,
      }))
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1
        }
        return b.updatedAt - a.updatedAt
      })
  })

  const persistentChatList = computed<ChatListItem[]>(() => {
    return chatList.value.filter(chat => !chat.isTemporary)
  })

  const hasChats = computed(() => chats.value.length > 0)

  function getChatById(id: string): Chat | undefined {
    return chats.value.find(chat => chat.id === id)
  }

  function getMessageById(chatId: string, messageId: string): Message | undefined {
    const chat = getChatById(chatId)
    return chat?.messages.find(msg => msg.id === messageId)
  }

  function setActiveChat(chatId: string | null) {
    activeChatId.value = chatId
  }

  function createChat(payload?: CreateChatPayload): Chat {
    const timestamp = now()
    const isTemporary = payload?.isTemporary ?? temporaryChatMode.value
    const newChat: Chat = {
      createdAt: timestamp,
      id: generateId(),
      isPinned: false,
      isTemporary,
      messages: [],
      title: isTemporary ? 'Temporary Chat' : (payload?.title ?? 'New Chat'),
      updatedAt: timestamp,
    }

    chats.value.unshift(newChat)
    activeChatId.value = newChat.id

    return newChat
  }

  function setTemporaryChatMode(enabled: boolean) {
    temporaryChatMode.value = enabled
  }

  function convertToRegularChat(chatId: string) {
    const chat = getChatById(chatId)
    if (!chat || !chat.isTemporary) return

    chat.isTemporary = false
    chat.updatedAt = now()
  }

  function updateChat(chatId: string, payload: UpdateChatPayload) {
    const chat = getChatById(chatId)
    if (!chat) return

    if (payload.title !== undefined) {
      chat.title = payload.title
    }
    if (payload.isPinned !== undefined) {
      chat.isPinned = payload.isPinned
    }
    chat.updatedAt = now()
  }

  function deleteChat(chatId: string) {
    const index = chats.value.findIndex(chat => chat.id === chatId)
    if (index === -1) return

    chats.value.splice(index, 1)

    if (activeChatId.value === chatId) {
      activeChatId.value = chats.value[0]?.id ?? null
    }
  }

  function clearAllChats() {
    chats.value = []
    activeChatId.value = null
  }

  function addMessage(payload: CreateMessagePayload): Message {
    const chat = getChatById(payload.chatId)
    if (!chat) {
      throw new Error(`Chat with id ${payload.chatId} not found`)
    }

    const message: Message = {
      chatId: payload.chatId,
      content: payload.content,
      createdAt: now(),
      id: generateId(),
      isEdited: false,
      role: payload.role,
      status: 'completed',
    }

    chat.messages.push(message)
    chat.updatedAt = now()

    if (chat.messages.length === 1 && payload.role === 'user') {
      chat.title = generateChatTitle(payload.content)
    }

    return message
  }

  function updateMessageContent(chatId: string, messageId: string, content: string) {
    const message = getMessageById(chatId, messageId)
    if (!message) return

    const chat = getChatById(chatId)
    if (!chat) return

    if (!message.isEdited) {
      message.originalContent = message.content
    }
    message.content = content
    message.isEdited = true
    chat.updatedAt = now()
  }

  function updateMessageStatus(chatId: string, messageId: string, status: MessageStatus) {
    const message = getMessageById(chatId, messageId)
    if (message) {
      message.status = status
    }
  }

  function appendToMessage(chatId: string, messageId: string, content: string) {
    const message = getMessageById(chatId, messageId)
    if (message) {
      message.content += content
    }
  }

  function deleteMessage(chatId: string, messageId: string) {
    const chat = getChatById(chatId)
    if (!chat) return

    const index = chat.messages.findIndex(msg => msg.id === messageId)
    if (index !== -1) {
      chat.messages.splice(index, 1)
      chat.updatedAt = now()
    }
  }

  function deleteMessagesAfter(chatId: string, messageId: string) {
    const chat = getChatById(chatId)
    if (!chat) return

    const index = chat.messages.findIndex(msg => msg.id === messageId)
    if (index !== -1 && index < chat.messages.length - 1) {
      chat.messages.splice(index + 1)
      chat.updatedAt = now()
    }
  }

  function getLastUserMessage(chatId: string): Message | undefined {
    const chat = getChatById(chatId)
    if (!chat) return

    return [...chat.messages].reverse().find(msg => msg.role === 'user')
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  return {
    // Getters (computed)
    activeChat,
    // State (refs)
    activeChatId,
    // Actions (alphabetically sorted)
    addMessage,
    appendToMessage,

    chatList,
    chats,
    clearAllChats,
    convertToRegularChat,

    createChat,
    deleteChat,
    deleteMessage,
    deleteMessagesAfter,
    getChatById,
    getLastUserMessage,
    getMessageById,
    hasChats,
    isLoading,
    persistentChatList,
    setActiveChat,
    setLoading,
    setTemporaryChatMode,
    temporaryChatMode,
    updateChat,
    updateMessageContent,
    updateMessageStatus,
  }
})
