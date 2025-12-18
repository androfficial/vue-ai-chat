<script setup lang="ts">
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

const { containerRef, handleScroll, isAtBottom, scrollToBottom } = useAutoScroll({
  smooth: false,
  threshold: 150,
})

const isInitialLoad = ref(true)
const isSmoothScrolling = ref(false)

function onScroll() {
  if (isSmoothScrolling.value) return
  handleScroll()
}

onMounted(async () => {
  await nextTick()
  if (containerRef.value && props.messages.length > 0) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
    isAtBottom.value = true
  }
  setTimeout(() => {
    isInitialLoad.value = false
  }, 100)
})

watch(
  () => props.messages.length,
  async (newLen, oldLen) => {
    if (isInitialLoad.value) return

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

@media (max-width: 600px) {
  .message-list__empty {
    padding: 32px 16px;
  }

  .message-list__empty .text-h5 {
    font-size: 1.25rem !important;
  }

  .message-list__empty .v-icon {
    font-size: 64px !important;
  }
}

.message-list__messages {
  padding-bottom: 24px;
  padding-top: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 600px) {
  .message-list__messages {
    padding-bottom: 16px;
    padding-top: 12px;
  }
}
</style>
