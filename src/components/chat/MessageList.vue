<script setup lang="ts">
/**
 * Message list component
 * Displays chat messages with auto-scroll
 * Refactored to use composables for better code reuse
 */

import type { Message } from '@/types/message'

import { nextTick, onMounted, ref, watch } from 'vue'

import { useAutoScroll } from '@/composables'

import MessageBubble from './MessageBubble.vue'

// Props
interface Props {
  messages: Message[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  copy: [content: string]
  delete: [messageId: string]
  edit: [messageId: string, content: string]
  regenerate: [messageId: string]
}>()

// Use composable for auto-scroll
const { containerRef, handleScroll, isAtBottom, scrollToBottom } = useAutoScroll({
  smooth: false, // Use instant scroll for chat
  threshold: 150,
})

// Track if initial scroll has been done (to avoid animated scroll on load)
const isInitialLoad = ref(true)
// Track if smooth scrolling is in progress
const isSmoothScrolling = ref(false)

// Custom scroll handler that ignores events during smooth scroll
function onScroll() {
  if (isSmoothScrolling.value) return
  handleScroll()
}

// Initial scroll to bottom on mount - instant, no animation
onMounted(async () => {
  await nextTick()
  if (containerRef.value && props.messages.length > 0) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
    isAtBottom.value = true
  }
  // Mark initial load as complete after a short delay
  setTimeout(() => {
    isInitialLoad.value = false
  }, 100)
})

// Auto-scroll to bottom when new messages arrive (always scroll for new messages)
watch(
  () => props.messages.length,
  async (newLen, oldLen) => {
    // Skip during initial load - onMounted handles it
    if (isInitialLoad.value) return

    // Always scroll when a new message is added
    if (newLen > (oldLen ?? 0)) {
      await nextTick()
      scrollToBottom()
    }
  },
)

// Also scroll when last message content changes (streaming) - only if user is at bottom
watch(
  () => props.messages[props.messages.length - 1]?.content,
  async (newContent, oldContent) => {
    // Only auto-scroll during streaming if user hasn't scrolled up
    if (newContent !== oldContent && isAtBottom.value) {
      await nextTick()
      scrollToBottom()
    }
  },
)

// Instant scroll to bottom (for chat switching)
async function scrollToBottomInstant() {
  await nextTick()
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
    isAtBottom.value = true
  }
}

// Smooth scroll to bottom (for button click)
function scrollToBottomSmooth() {
  if (containerRef.value) {
    isSmoothScrolling.value = true
    isAtBottom.value = true

    containerRef.value.scrollTo({
      behavior: 'smooth',
      top: containerRef.value.scrollHeight,
    })

    // Reset flag after animation completes (typical duration ~300-500ms)
    setTimeout(() => {
      isSmoothScrolling.value = false
    }, 500)
  }
}

// Event handlers - using inline arrow functions would create new references on each render
// Keeping explicit functions for better performance with v-memo
function handleCopy(content: string) {
  emit('copy', content)
}

function handleDelete(messageId: string) {
  emit('delete', messageId)
}

function handleEdit(messageId: string, content: string) {
  emit('edit', messageId, content)
}

function handleRegenerate(messageId: string) {
  emit('regenerate', messageId)
}

// Expose scrollToBottom for parent component
defineExpose({
  isAtBottom,
  scrollToBottom,
  scrollToBottomInstant,
  scrollToBottomSmooth,
})
</script>

<template>
  <div
    ref="containerRef"
    class="message-list"
    role="log"
    aria-live="polite"
    :aria-label="$t('chat.messageList')"
    @scroll="onScroll"
  >
    <!-- Empty state -->
    <div
      v-if="messages.length === 0"
      class="message-list__empty d-flex flex-column align-center justify-center fill-height"
    >
      <v-icon
        icon="mdi-chat-processing-outline"
        size="80"
        color="primary"
        class="mb-4"
      />
      <h2 class="text-h5 mb-2">{{ $t('chat.emptyState.title') }}</h2>
      <p class="text-body-1 text-medium-emphasis text-center">
        {{ $t('chat.emptyState.subtitle') }}
      </p>
    </div>

    <!-- Messages -->
    <div
      v-else
      class="message-list__messages"
    >
      <!-- v-memo prevents re-renders when message hasn't changed -->
      <MessageBubble
        v-for="message in messages"
        :key="message.id"
        v-memo="[message.content, message.status, message.isEdited]"
        :message="message"
        @copy="handleCopy"
        @delete="handleDelete"
        @edit="handleEdit"
        @regenerate="handleRegenerate"
      />
    </div>
  </div>
</template>

<style scoped>
.message-list {
  position: relative;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.message-list__empty {
  padding: 48px 24px;
  max-width: 500px;
  margin: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.message-list__messages {
  padding-bottom: 24px;
  padding-top: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
