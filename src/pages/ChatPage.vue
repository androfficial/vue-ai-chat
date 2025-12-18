<script setup lang="ts">
/**
 * Main chat page component
 * Displays chat messages and handles user interactions
 */

import { computed, inject, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ChatInput from '@/components/chat/ChatInput.vue'
import MessageList from '@/components/chat/MessageList.vue'
import { useChatMessages, useClipboard } from '@/composables'
import { useApiStore } from '@/stores/api'
import { useChatStore } from '@/stores/chat'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const apiStore = useApiStore()

const toggleSidebar = inject<() => void>('toggleSidebar')

// Use composables
const { isLoading, regenerateMessage, sendMessage, stopGeneration } = useChatMessages()
const { copy } = useClipboard()

// State
const showApiKeyDialog = ref(false)
const tempApiKey = ref('')
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
  // Always show for new chat page
  if (isNewChat.value) return true
  // Show for temporary chats (to allow saving)
  if (isCurrentChatTemporary.value) return true
  // Don't show for regular chats with messages
  return false
})

// Handle new chat or existing chat
watch(
  chatId,
  async id => {
    if (id === 'new') {
      chatStore.setActiveChat(null)
      // Reset temporary chat mode when going to new chat
      chatStore.setTemporaryChatMode(false)
    } else if (id) {
      const chat = chatStore.getChatById(id)
      if (chat) {
        chatStore.setActiveChat(id)
        // Instant scroll to bottom when switching chats
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

  // Create new chat if needed
  if (isNewChat.value) {
    const newChat = chatStore.createChat()
    targetChatId = newChat.id
    router.replace(`/chat/${targetChatId}`)
  }

  // Send message using composable
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

  // Update the message content
  chatStore.updateMessageContent(chatId, messageId, content)

  // Delete all messages after the edited message
  chatStore.deleteMessagesAfter(chatId, messageId)

  // Send new request to AI
  await sendMessage(chatId, content, true)
}

async function handleRegenerateMessage(messageId: string) {
  if (!currentChat.value || !hasApiKey.value) return

  // Use the regenerateMessage function from composable
  await regenerateMessage(currentChat.value.id, messageId)
}

function saveApiKey() {
  if (tempApiKey.value.trim()) {
    apiStore.setApiKey(tempApiKey.value.trim())
    showApiKeyDialog.value = false
    tempApiKey.value = ''
  }
}
</script>

<template>
  <div class="chat-page d-flex flex-column">
    <!-- Mobile header with menu button -->
    <div class="chat-page__mobile-header">
      <v-btn
        icon="mdi-menu"
        variant="text"
        size="40"
        :aria-label="$t('sidebar.expandSidebar')"
        @click="toggleSidebar?.()"
      />
      <span class="chat-page__mobile-title">AI Chat</span>
      <v-btn
        icon="mdi-square-edit-outline"
        variant="text"
        size="40"
        :aria-label="$t('sidebar.newChat')"
        @click="router.push('/chat/new')"
      />
    </div>

    <!-- Top right temporary chat toggle -->
    <div
      v-if="canToggleTemporaryMode"
      class="chat-page__header"
    >
      <v-btn
        variant="text"
        size="small"
        class="chat-page__temp-toggle"
        :class="{ 'chat-page__temp-toggle--active': isTemporaryChatMode || isCurrentChatTemporary }"
        @click="toggleTemporaryMode"
      >
        <v-icon
          :icon="
            isTemporaryChatMode || isCurrentChatTemporary ? 'mdi-incognito' : 'mdi-incognito-off'
          "
          size="18"
          class="mr-2"
        />
        <span class="chat-page__temp-toggle-text">
          {{
            isTemporaryChatMode || isCurrentChatTemporary
              ? $t('chat.temporaryChat.disable')
              : $t('chat.temporaryChat.enable')
          }}
        </span>
      </v-btn>

      <!-- Save button for temporary chats -->
      <v-btn
        v-if="isCurrentChatTemporary && messages.length > 0"
        variant="tonal"
        size="small"
        color="primary"
        class="chat-page__save-btn ml-2"
        @click="saveCurrentChat"
      >
        <v-icon
          icon="mdi-content-save-outline"
          size="18"
          class="mr-1"
        />
        {{ $t('chat.temporaryChat.save') }}
      </v-btn>
    </div>

    <!-- Message list -->
    <div class="chat-page__messages">
      <MessageList
        ref="messageList"
        :messages="messages"
        @copy="handleCopyMessage"
        @delete="handleDeleteMessage"
        @edit="handleEditMessage"
        @regenerate="handleRegenerateMessage"
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
    <v-dialog
      v-model="showApiKeyDialog"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 pa-6 pb-2">
          <v-icon
            icon="mdi-key"
            class="mr-2"
          />
          {{ $t('dialog.apiKey.title') }}
        </v-card-title>

        <v-card-text class="pa-6">
          <p class="text-body-1 mb-4">
            {{ $t('dialog.apiKey.description') }}
            <a
              href="https://cloud.cerebras.ai"
              target="_blank"
              class="text-primary"
            >
              {{ $t('dialog.apiKey.link') }}
            </a>
          </p>

          <v-text-field
            v-model="tempApiKey"
            :label="$t('settings.api.apiKey')"
            type="password"
            variant="outlined"
            :placeholder="$t('settings.api.apiKeyPlaceholder')"
            hide-details
          />
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="text"
            @click="showApiKeyDialog = false"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!tempApiKey.trim()"
            @click="saveApiKey"
          >
            {{ $t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.chat-page {
  background-color: rgb(var(--v-theme-background));
  position: relative;
  overflow: hidden;
  height: 100%;
}

/* Mobile header */
.chat-page__mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
  background-color: rgb(var(--v-theme-background));
}

.chat-page__mobile-title {
  font-weight: 600;
  font-size: 1.1rem;
}

@media (max-width: 960px) {
  .chat-page__mobile-header {
    display: flex;
  }
}

/* Header with temporary chat toggle */
.chat-page__header {
  position: absolute;
  top: 12px;
  right: 16px;
  z-index: 100;
  display: flex;
  align-items: center;
}

@media (max-width: 960px) {
  .chat-page__header {
    position: relative;
    top: 0;
    right: 0;
    padding: 8px 12px;
    justify-content: center;
  }
}

.chat-page__temp-toggle {
  text-transform: none !important;
  font-weight: 400;
  letter-spacing: normal;
  opacity: 0.6;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease;
  border-radius: 20px !important;
  padding: 0 12px !important;
}

.chat-page__temp-toggle:hover {
  opacity: 1;
  background-color: var(--border-subtle) !important;
}

.chat-page__temp-toggle--active {
  opacity: 1;
  color: rgb(var(--v-theme-primary)) !important;
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}

.chat-page__temp-toggle-text {
  font-size: 0.85rem;
}

.chat-page__save-btn {
  text-transform: none !important;
  font-weight: 500;
  border-radius: 20px !important;
}

.chat-page__messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-top: 48px;
}

@media (max-width: 960px) {
  .chat-page__messages {
    padding-top: 0;
  }
}

.chat-page__input-wrapper {
  flex-shrink: 0;
  background: linear-gradient(
    to top,
    rgb(var(--v-theme-background)) 0%,
    rgb(var(--v-theme-background)) 70%,
    transparent 100%
  );
  padding-top: 24px;
  position: relative;
  z-index: 10;
}

@media (max-width: 960px) {
  .chat-page__input-wrapper {
    padding-top: 16px;
  }
}

.chat-page__input-container {
  position: relative;
  max-width: 848px;
  margin: 0 auto;
  width: 100%;
}

.chat-page__scroll-btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -56px;
  z-index: 20;
  pointer-events: auto;
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
