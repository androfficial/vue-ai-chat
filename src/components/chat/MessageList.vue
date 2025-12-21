<script setup lang="ts">
/**
 * Message list component
 * Displays chat messages with auto-scroll functionality
 */

import type { Message } from '@/types'

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAutoScroll } from '@/composables'

import MessageBubble from './MessageBubble.vue'

interface Props {
  messages: Message[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  copy: [content: string]
  delete: [messageId: string]
  edit: [messageId: string, content: string]
  regenerate: [messageId: string]
  suggestion: [text: string]
}>()

const { t, tm } = useI18n()

const { containerRef, handleScroll, isAtBottom, scrollToBottom } = useAutoScroll({
  smooth: false,
  threshold: 150,
})

const isInitialLoad = ref(true)
const isSmoothScrolling = ref(false)

// Rotating titles animation
const currentTitleIndex = ref(0)
const isAnimating = ref(false)
let titleInterval: ReturnType<typeof setInterval> | null = null

const titles = computed(() => {
  const rawTitles = tm('chat.emptyState.titles') as string[] | undefined
  return Array.isArray(rawTitles) ? rawTitles : [t('chat.emptyState.title')]
})

interface Suggestion {
  icon: string
  text: string
}

const suggestions = computed(() => {
  const rawSuggestions = tm('chat.emptyState.suggestions') as Suggestion[] | undefined
  return Array.isArray(rawSuggestions) ? rawSuggestions : []
})

function handleSuggestionClick(text: string) {
  emit('suggestion', text)
}

const currentTitle = computed(() => titles.value[currentTitleIndex.value] || titles.value[0])

function startTitleRotation() {
  if (titleInterval) return
  titleInterval = setInterval(() => {
    isAnimating.value = true
    setTimeout(() => {
      currentTitleIndex.value = (currentTitleIndex.value + 1) % titles.value.length
      setTimeout(() => {
        isAnimating.value = false
      }, 50)
    }, 300)
  }, 4000)
}

function stopTitleRotation() {
  if (titleInterval) {
    clearInterval(titleInterval)
    titleInterval = null
  }
}

function onScroll() {
  if (isSmoothScrolling.value) return
  handleScroll()
}

onMounted(async () => {
  await nextTick()
  if (containerRef.value && props.messages.length > 0) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
    isAtBottom.value = true
  } else {
    startTitleRotation()
  }
  setTimeout(() => {
    isInitialLoad.value = false
  }, 100)
})

onUnmounted(() => {
  stopTitleRotation()
})

watch(
  () => props.messages.length,
  async (newLen, oldLen) => {
    if (isInitialLoad.value) return

    if (newLen === 0) {
      currentTitleIndex.value = 0
      startTitleRotation()
    } else {
      stopTitleRotation()
    }

    if (newLen > (oldLen ?? 0)) {
      await nextTick()
      scrollToBottom()
    }
  },
)

watch(
  () => props.messages[props.messages.length - 1]?.content,
  async (newContent, oldContent) => {
    if (newContent !== oldContent && isAtBottom.value) {
      await nextTick()
      scrollToBottom()
    }
  },
)

async function scrollToBottomInstant() {
  await nextTick()
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
    isAtBottom.value = true
  }
}

function scrollToBottomSmooth() {
  if (containerRef.value) {
    isSmoothScrolling.value = true
    isAtBottom.value = true

    containerRef.value.scrollTo({
      behavior: 'smooth',
      top: containerRef.value.scrollHeight,
    })

    setTimeout(() => {
      isSmoothScrolling.value = false
    }, 500)
  }
}

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
      <h2
        class="text-h5 mb-2 message-list__title"
        :class="{ 'message-list__title--animating': isAnimating }"
      >
        {{ currentTitle }}
      </h2>
      <p class="text-body-1 text-medium-emphasis text-center mb-6">
        {{ $t('chat.emptyState.subtitle') }}
      </p>

      <!-- Prompt Suggestions -->
      <div class="message-list__suggestions">
        <button
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="message-list__suggestion"
          @click="handleSuggestionClick(suggestion.text)"
        >
          <span class="message-list__suggestion-text">{{ suggestion.text }}</span>
        </button>
      </div>
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
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden auto;
}

.message-list__empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 48px 24px;
}

.message-list__title {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  will-change: opacity, transform;
}

.message-list__title--animating {
  opacity: 0;
  transform: translateY(-8px);
}

.message-list__suggestions {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 8px;
  justify-content: center;
  width: 100%;
  max-width: 680px;
}

.message-list__suggestion {
  padding: 10px 16px;
  font-size: 0.875rem;
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface));
  cursor: pointer;
  background-color: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  transition: all var(--transition-fast);
}

.message-list__suggestion:hover {
  background-color: rgb(var(--v-theme-surface-variant));
  border-color: var(--border-default);
}

.message-list__suggestion:active {
  transform: scale(0.98);
}

.message-list__suggestion-text {
  white-space: nowrap;
}

@media (width <= 600px) {
  .message-list__empty {
    padding: 48px 16px 24px;
  }

  .message-list__empty .text-h5 {
    font-size: 1.125rem !important;
  }

  .message-list__empty > .v-icon {
    font-size: 48px !important;
  }

  .message-list__suggestions {
    grid-template-columns: 1fr;
    max-width: 280px;
  }

  .message-list__suggestion {
    padding: 12px 16px;
    text-align: center;
  }

  .message-list__suggestion-text {
    white-space: normal;
  }
}

.message-list__messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-top: 16px;
  padding-bottom: 24px;
}

@media (width <= 600px) {
  .message-list__messages {
    padding-top: 12px;
    padding-bottom: 16px;
  }
}
</style>
