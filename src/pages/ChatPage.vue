<script setup lang="ts">
/**
 * Main chat page component
 * Displays chat messages and handles user interactions
 */

import { computed, inject, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ApiKeyDialog from '@/components/chat/ApiKeyDialog.vue'
import ChatHeader from '@/components/chat/ChatHeader.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import MessageList from '@/components/chat/MessageList.vue'
import { useChatMessages, useClipboard } from '@/composables'
import { useApiStore } from '@/stores/api'
import { useChatStore } from '@/stores/chat'
import { TOGGLE_SIDEBAR_KEY } from '@/types'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const apiStore = useApiStore()

const toggleSidebar = inject(TOGGLE_SIDEBAR_KEY)

// Use composables
const { isLoading, regenerateMessage, sendMessage, stopGeneration } = useChatMessages()
const { copy } = useClipboard()

// State
const showApiKeyDialog = ref(false)
const messageList = ref<InstanceType<typeof MessageList> | null>(null)

// Get current chat ID from route
const chatId = computed(() => route.params.id as string)
const isNewChat = computed(() => chatId.value === 'new')

// Get current chat and messages
const currentChat = computed(() => {
  if (isNewChat.value) return null
  return chatStore.getChatById(chatId.value)
})

const messages = computed(() => currentChat.value?.messages ?? [])

// Check if API key is configured
const hasApiKey = computed(() => apiStore.hasApiKey)

// Temporary chat mode
const isTemporaryChatMode = computed(() => chatStore.temporaryChatMode)
const isCurrentChatTemporary = computed(() => currentChat.value?.isTemporary ?? false)

// Can only toggle temporary mode for new chats without messages
const canToggleTemporaryMode = computed(() => {
  if (isNewChat.value) return true
  if (isCurrentChatTemporary.value) return true
  return false
})

// Handle new chat or existing chat
watch(
  chatId,
  async id => {
    if (id === 'new') {
      chatStore.setActiveChat(null)
      chatStore.setTemporaryChatMode(false)
    } else if (id) {
      const chat = chatStore.getChatById(id)
      if (chat) {
        chatStore.setActiveChat(id)
        await nextTick()
        messageList.value?.scrollToBottomInstant()
      } else {
        router.replace('/chat/new')
      }
    }
  },
  { immediate: true },
)

// Show API key dialog if not configured
watch(
  hasApiKey,
  has => {
    if (!has) {
      showApiKeyDialog.value = true
    }
  },
  { immediate: true },
)

// Methods
async function handleSendMessage(content: string) {
  if (!hasApiKey.value) {
    showApiKeyDialog.value = true
    return
  }

  let targetChatId = chatId.value

  if (isNewChat.value) {
    const newChat = chatStore.createChat()
    targetChatId = newChat.id
    router.replace(`/chat/${targetChatId}`)
  }

  await sendMessage(targetChatId, content)
}

function handleStopGeneration() {
  stopGeneration()
}

function toggleTemporaryMode() {
  chatStore.setTemporaryChatMode(!isTemporaryChatMode.value)
}

function saveCurrentChat() {
  if (currentChat.value && currentChat.value.isTemporary) {
    chatStore.convertToRegularChat(currentChat.value.id)
  }
}

function handleCopyMessage(content: string) {
  copy(content)
}

function handleDeleteMessage(messageId: string) {
  if (currentChat.value) {
    chatStore.deleteMessage(currentChat.value.id, messageId)
  }
}

async function handleEditMessage(messageId: string, content: string) {
  if (!currentChat.value || !hasApiKey.value) return

  const chatId = currentChat.value.id
  chatStore.updateMessageContent(chatId, messageId, content)
  chatStore.deleteMessagesAfter(chatId, messageId)
  await sendMessage(chatId, content, true)
}

async function handleRegenerateMessage(messageId: string) {
  if (!currentChat.value || !hasApiKey.value) return
  await regenerateMessage(currentChat.value.id, messageId)
}

function handleSaveApiKey(apiKey: string) {
  apiStore.setApiKey(apiKey)
  showApiKeyDialog.value = false
}

function handleNewChat() {
  router.push('/chat/new')
}
</script>

<template>
  <div class="chat-page d-flex flex-column">
    <!-- Header -->
    <ChatHeader
      :can-toggle-temporary-mode="canToggleTemporaryMode"
      :has-messages="messages.length > 0"
      :is-current-chat-temporary="isCurrentChatTemporary"
      :is-temporary-chat-mode="isTemporaryChatMode"
      @toggle-sidebar="toggleSidebar?.()"
      @new-chat="handleNewChat"
      @toggle-temporary-mode="toggleTemporaryMode"
      @save-chat="saveCurrentChat"
    />

    <!-- Message list -->
    <div class="chat-page__messages">
      <MessageList
        ref="messageList"
        :messages="messages"
        @copy="handleCopyMessage"
        @delete="handleDeleteMessage"
        @edit="handleEditMessage"
        @regenerate="handleRegenerateMessage"
        @suggestion="handleSendMessage"
      />
    </div>

    <!-- Input area - fixed at bottom -->
    <div class="chat-page__input-wrapper">
      <div class="chat-page__input-container">
        <ChatInput
          :loading="isLoading"
          :disabled="!hasApiKey"
          :placeholder="hasApiKey ? undefined : $t('chat.apiKeyRequired')"
          @send="handleSendMessage"
          @stop="handleStopGeneration"
        />
        <Transition name="scroll-btn">
          <v-fab
            v-if="!isLoading && messages.length > 0 && messageList && !messageList.isAtBottom"
            class="chat-page__scroll-btn"
            icon="mdi-chevron-down"
            size="small"
            color="surface"
            @click="messageList.scrollToBottomSmooth()"
          />
        </Transition>
      </div>
    </div>

    <!-- API Key Dialog -->
    <ApiKeyDialog
      v-model="showApiKeyDialog"
      @save="handleSaveApiKey"
    />
  </div>
</template>

<style scoped>
.chat-page {
  position: relative;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background-color: rgb(var(--v-theme-background));
}

.chat-page__messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding-top: 48px;
  overflow: hidden auto;
}

@media (width <= 960px) {
  .chat-page__messages {
    padding-top: 0;
  }
}

.chat-page__input-wrapper {
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  padding-top: 24px;
  background: linear-gradient(
    to top,
    rgb(var(--v-theme-background)) 0%,
    rgb(var(--v-theme-background)) 70%,
    transparent 100%
  );
}

@media (width <= 960px) {
  .chat-page__input-wrapper {
    padding-top: 16px;
    padding-bottom: env(safe-area-inset-bottom);
  }
}

.chat-page__input-container {
  position: relative;
  width: 100%;
  max-width: 848px;
  margin: 0 auto;
}

.chat-page__scroll-btn {
  position: absolute;
  top: -56px;
  left: 50%;
  z-index: 20;
  pointer-events: auto;
  transform: translateX(-50%);
}

/* Scroll button animation */
.scroll-btn-enter-active,
.scroll-btn-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.scroll-btn-enter-from,
.scroll-btn-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.scroll-btn-enter-to,
.scroll-btn-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
