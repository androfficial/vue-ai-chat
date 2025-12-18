/**
 * Chat messages composable
 * Handles message sending, streaming, and abort logic
 *
 * @example
 * const { sendMessage, stopGeneration, isLoading } = useChatMessages()
 */

import type { ApiMessage } from '@/types/api'
import type { Ref } from 'vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { type ApiErrorCode, sendStreamingChatCompletion } from '@/services/api/cerebras'
import { useApiStore } from '@/stores/api'
import { useChatStore } from '@/stores/chat'

export interface UseChatMessagesReturn {
  /** Current AbortController for cancelling requests */
  abortController: Ref<AbortController | null>
  /** Whether a message is currently being generated */
  isLoading: Ref<boolean>
  /** Regenerate assistant message (without adding new user message) */
  regenerateMessage: (chatId: string, assistantMessageId: string) => Promise<void>
  /** Send a message and get streaming response */
  sendMessage: (chatId: string, content: string, skipAddUserMessage?: boolean) => Promise<void>
  /** Stop current generation */
  stopGeneration: () => void
}

/**
 * Creates chat message handling logic
 */
export function useChatMessages(): UseChatMessagesReturn {
  const chatStore = useChatStore()
  const apiStore = useApiStore()
  const { t } = useI18n()

  const isLoading = ref(false)
  const abortController = ref<AbortController | null>(null)

  /**
   * Maps error codes to user-friendly localized messages
   */
  function getLocalizedErrorMessage(errorCode: string): string {
    const errorMap: Record<ApiErrorCode, string> = {
      networkError: t('errors.networkError'),
      rateLimited: t('errors.rateLimited'),
      serverError: t('errors.serverError'),
      unauthorized: t('errors.unauthorized'),
      unknown: t('errors.unknown'),
    }

    return errorMap[errorCode as ApiErrorCode] || t('errors.unknown')
  }

  async function sendMessage(
    chatId: string,
    content: string,
    skipAddUserMessage = false,
  ): Promise<void> {
    if (!apiStore.hasApiKey) {
      throw new Error('API key is not configured')
    }

    // Add user message only if not editing
    if (!skipAddUserMessage) {
      chatStore.addMessage({
        chatId,
        content,
        role: 'user',
      })
    }

    // Create pending assistant message
    const assistantMessage = chatStore.addMessage({
      chatId,
      content: '',
      role: 'assistant',
    })

    chatStore.updateMessageStatus(chatId, assistantMessage.id, 'streaming')
    isLoading.value = true

    // Prepare messages for API
    const chat = chatStore.getChatById(chatId)
    const apiMessages: ApiMessage[] =
      chat?.messages
        .filter(msg => msg.id !== assistantMessage.id)
        .map(msg => ({
          content: msg.content,
          role: msg.role,
        })) ?? []

    // Send streaming request
    abortController.value = new AbortController()

    await sendStreamingChatCompletion(
      apiMessages,
      // On chunk
      chunk => {
        chatStore.appendToMessage(chatId, assistantMessage.id, chunk)
      },
      // On complete
      () => {
        chatStore.updateMessageStatus(chatId, assistantMessage.id, 'completed')
        isLoading.value = false
        abortController.value = null
      },
      // On error
      errorCode => {
        chatStore.updateMessageStatus(chatId, assistantMessage.id, 'error')
        const currentChat = chatStore.getChatById(chatId)
        const msg = currentChat?.messages.find(m => m.id === assistantMessage.id)
        if (msg) {
          msg.error = getLocalizedErrorMessage(errorCode)
        }
        isLoading.value = false
        abortController.value = null
      },
      abortController.value.signal,
    )
  }

  function stopGeneration(): void {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
      isLoading.value = false
    }
  }

  /**
   * Regenerate assistant message - clears the assistant message and re-sends request
   * without adding a new user message
   */
  async function regenerateMessage(chatId: string, assistantMessageId: string): Promise<void> {
    if (!apiStore.hasApiKey) {
      throw new Error('API key is not configured')
    }

    const chat = chatStore.getChatById(chatId)
    if (!chat) return

    // Find the assistant message to regenerate
    const messageIndex = chat.messages.findIndex(m => m.id === assistantMessageId)
    if (messageIndex <= 0) return

    // Clear the assistant message content and set to streaming
    chatStore.updateMessageContent(chatId, assistantMessageId, '')
    chatStore.updateMessageStatus(chatId, assistantMessageId, 'streaming')
    isLoading.value = true

    // Prepare messages for API (exclude the assistant message being regenerated)
    const apiMessages: ApiMessage[] = chat.messages.slice(0, messageIndex).map(msg => ({
      content: msg.content,
      role: msg.role,
    }))

    // Send streaming request
    abortController.value = new AbortController()

    await sendStreamingChatCompletion(
      apiMessages,
      // On chunk
      chunk => {
        chatStore.appendToMessage(chatId, assistantMessageId, chunk)
      },
      // On complete
      () => {
        chatStore.updateMessageStatus(chatId, assistantMessageId, 'completed')
        isLoading.value = false
        abortController.value = null
      },
      // On error
      errorCode => {
        chatStore.updateMessageStatus(chatId, assistantMessageId, 'error')
        const currentChat = chatStore.getChatById(chatId)
        const msg = currentChat?.messages.find(m => m.id === assistantMessageId)
        if (msg) {
          msg.error = getLocalizedErrorMessage(errorCode)
        }
        isLoading.value = false
        abortController.value = null
      },
      abortController.value.signal,
    )
  }

  return {
    abortController,
    isLoading,
    regenerateMessage,
    sendMessage,
    stopGeneration,
  }
}
