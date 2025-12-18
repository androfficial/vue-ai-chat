import type { ApiMessage } from '@/types/api'
import type { Ref } from 'vue'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useStreamBuffer } from '@/composables/useStreamBuffer'
import { type ApiErrorCode, sendStreamingChatCompletion } from '@/services/api/cerebras'
import { useApiStore } from '@/stores/api'
import { useChatStore } from '@/stores/chat'

export interface UseChatMessagesReturn {
  abortController: Ref<AbortController | null>
  isLoading: Ref<boolean>
  regenerateMessage: (chatId: string, assistantMessageId: string) => Promise<void>
  sendMessage: (chatId: string, content: string, skipAddUserMessage?: boolean) => Promise<void>
  stopGeneration: () => void
}

export function useChatMessages(): UseChatMessagesReturn {
  const chatStore = useChatStore()
  const apiStore = useApiStore()
  const { t } = useI18n()

  const isLoading = ref(false)
  const abortController = ref<AbortController | null>(null)

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

  function createMessageBuffer(chatId: string, messageId: string) {
    return useStreamBuffer({
      onFlush: text => {
        chatStore.appendToMessage(chatId, messageId, text)
      },
      wordDelay: 50,
    })
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

    // Create stream buffer for smooth character-by-character animation
    const streamBuffer = createMessageBuffer(chatId, assistantMessage.id)
    streamBuffer.start()

    // Send streaming request
    abortController.value = new AbortController()

    let streamingComplete = false

    await sendStreamingChatCompletion(
      apiMessages,
      chunk => {
        streamBuffer.push(chunk)
      },
      () => {
        streamingComplete = true
        streamBuffer.flushImmediate()
        chatStore.updateMessageStatus(chatId, assistantMessage.id, 'completed')
        isLoading.value = false
        abortController.value = null
      },
      errorCode => {
        streamBuffer.flushImmediate()
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

    // If streaming finished but buffer hasn't flushed yet (abort case)
    if (!streamingComplete) {
      streamBuffer.flushImmediate()
    }
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

    // Create stream buffer for smooth character-by-character animation
    const streamBuffer = createMessageBuffer(chatId, assistantMessageId)
    streamBuffer.start()

    // Send streaming request
    abortController.value = new AbortController()

    let streamingComplete = false

    await sendStreamingChatCompletion(
      apiMessages,
      // On chunk - push to buffer instead of direct update
      chunk => {
        streamBuffer.push(chunk)
      },
      // On complete - flush remaining buffer
      () => {
        streamingComplete = true
        streamBuffer.flushImmediate()
        chatStore.updateMessageStatus(chatId, assistantMessageId, 'completed')
        isLoading.value = false
        abortController.value = null
      },
      errorCode => {
        streamBuffer.flushImmediate()
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

    if (!streamingComplete) {
      streamBuffer.flushImmediate()
    }
  }

  return {
    abortController,
    isLoading,
    regenerateMessage,
    sendMessage,
    stopGeneration,
  }
}
