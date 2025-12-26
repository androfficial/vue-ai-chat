import type { ApiMessage } from '@/types'
import type { Ref } from 'vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useStreamBuffer } from '@/composables/useStreamBuffer'
import { type ApiErrorCode, sendStreamingChatCompletion } from '@/services/api'
import { useApiStore } from '@/stores/api'
import { useChatStore } from '@/stores/chat'

export interface UseChatMessagesReturn {
  abortController: Ref<AbortController | null>
  isLoading: Ref<boolean>
  regenerateMessage: (chatId: string, assistantMessageId: string) => Promise<void>
  sendMessage: (chatId: string, content: string, skipAddUserMessage?: boolean) => Promise<void>
  stopGeneration: () => void
}

/**
 * Composable for managing chat messages with AI streaming responses
 */
export function useChatMessages(): UseChatMessagesReturn {
  const chatStore = useChatStore()
  const apiStore = useApiStore()
  const { t } = useI18n()

  const isLoading = ref(false)
  const abortController = ref<AbortController | null>(null)

  /**
   * Get localized error message for API error codes
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

  /**
   * Create a stream buffer for smooth character-by-character animation
   */
  function createMessageBuffer(chatId: string, messageId: string) {
    return useStreamBuffer({
      onFlush: text => {
        chatStore.appendToMessage(chatId, messageId, text)
      },
      wordDelay: 50,
    })
  }

  /**
   * Handle streaming response completion
   */
  function handleStreamComplete(chatId: string, messageId: string) {
    chatStore.updateMessageStatus(chatId, messageId, 'completed')
    isLoading.value = false
    abortController.value = null
  }

  /**
   * Handle streaming response error
   */
  function handleStreamError(chatId: string, messageId: string, errorCode: string) {
    chatStore.updateMessageStatus(chatId, messageId, 'error')
    const msg = chatStore.getMessageById(chatId, messageId)
    if (msg) {
      msg.error = getLocalizedErrorMessage(errorCode)
    }
    isLoading.value = false
    abortController.value = null
  }

  /**
   * Execute streaming request with common setup and cleanup
   */
  async function executeStreamingRequest(
    chatId: string,
    messageId: string,
    apiMessages: ApiMessage[],
  ): Promise<void> {
    const streamBuffer = createMessageBuffer(chatId, messageId)
    streamBuffer.start()

    abortController.value = new AbortController()
    let streamingComplete = false

    await sendStreamingChatCompletion(
      apiMessages,
      chunk => streamBuffer.push(chunk),
      () => {
        streamingComplete = true
        streamBuffer.flushImmediate()
        handleStreamComplete(chatId, messageId)
      },
      errorCode => {
        streamBuffer.flushImmediate()
        handleStreamError(chatId, messageId, errorCode)
      },
      abortController.value.signal,
    )

    // Handle abort case - flush remaining buffer
    if (!streamingComplete) {
      streamBuffer.flushImmediate()
    }
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

    // Prepare messages for API (exclude the new assistant message)
    const chat = chatStore.getChatById(chatId)
    const apiMessages: ApiMessage[] =
      chat?.messages
        .filter(msg => msg.id !== assistantMessage.id)
        .map(msg => ({
          content: msg.content,
          role: msg.role,
        })) ?? []

    await executeStreamingRequest(chatId, assistantMessage.id, apiMessages)
  }

  function stopGeneration(): void {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
      isLoading.value = false
    }
  }

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

    await executeStreamingRequest(chatId, assistantMessageId, apiMessages)
  }

  return {
    abortController,
    isLoading,
    regenerateMessage,
    sendMessage,
    stopGeneration,
  }
}
