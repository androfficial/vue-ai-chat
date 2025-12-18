<script setup lang="ts">
/**
 * Message content component
 * Renders message content with markdown support for assistant messages
 */

import type { MessageStatus } from '@/types/message'

import { marked } from 'marked'
import { computed } from 'vue'

// Props
interface Props {
  content: string
  error?: string
  isUser?: boolean
  status: MessageStatus
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  retry: []
}>()

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
})

// Render markdown for assistant messages
const renderedContent = computed(() => {
  if (props.isUser) {
    return props.content
  }
  return marked.parse(props.content) as string
})
</script>

<template>
  <!-- Loading indicator for pending -->
  <div
    v-if="status === 'pending'"
    class="d-flex align-center"
  >
    <v-progress-circular
      indeterminate
      size="16"
      width="2"
      class="mr-2"
    />
    <span class="text-medium-emphasis">{{ $t('chat.thinking') }}</span>
  </div>

  <!-- Streaming content with typing indicator -->
  <div
    v-else-if="status === 'streaming'"
    class="message-content__streaming"
  >
    <!-- Show thinking indicator when no content yet -->
    <div
      v-if="!content"
      class="message-content__thinking"
    >
      <div class="thinking-dots">
        <span class="thinking-dot" />
        <span class="thinking-dot" />
        <span class="thinking-dot" />
      </div>
      <span class="text-medium-emphasis ml-2">{{ $t('chat.thinking') }}</span>
    </div>
    <!-- Show content with blinking cursor -->
    <template v-else>
      <div
        class="message-content__text message-content__markdown"
        v-html="renderedContent"
      />
      <span class="streaming-cursor">▌</span>
    </template>
  </div>

  <!-- Error state -->
  <div
    v-else-if="status === 'error'"
    class="message-content__error"
  >
    <v-icon
      icon="mdi-alert-circle"
      color="error"
      size="20"
      class="mr-2 flex-shrink-0"
    />
    <span class="text-error">{{ error || $t('chat.error.failed') }}</span>
  </div>

  <!-- Normal content -->
  <div
    v-else-if="isUser"
    class="message-content__text message-content__text--user"
  >
    {{ content }}
  </div>

  <!-- Markdown content for assistant -->
  <div
    v-else
    class="message-content__text message-content__markdown"
    v-html="renderedContent"
  />
</template>

<style scoped>
.message-content__text {
  word-break: break-word;
  line-height: 1.6;
}

.message-content__text--user {
  white-space: pre-wrap;
}

.message-content__markdown :deep(p) {
  margin: 0 0 1em 0;
}

.message-content__markdown :deep(p:last-child) {
  margin-bottom: 0;
}

.message-content__markdown :deep(ul),
.message-content__markdown :deep(ol) {
  margin: 0 0 1em 0;
  padding-left: 1.5em;
}

.message-content__markdown :deep(li) {
  margin-bottom: 0.25em;
}

.message-content__markdown :deep(code) {
  background-color: rgb(var(--v-theme-surface-variant));
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
}

.message-content__markdown :deep(pre) {
  background-color: rgb(var(--v-theme-surface-variant));
  padding: 1em;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 0 0 1em 0;
}

.message-content__markdown :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.875em;
}

.message-content__markdown :deep(blockquote) {
  border-left: 3px solid rgb(var(--v-theme-primary));
  margin: 0 0 1em 0;
  padding-left: 1em;
  color: rgb(var(--v-theme-text-secondary));
}

.message-content__markdown :deep(strong) {
  font-weight: 600;
}

.message-content__markdown :deep(a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.message-content__markdown :deep(a:hover) {
  text-decoration: underline;
}

.message-content__markdown :deep(h1),
.message-content__markdown :deep(h2),
.message-content__markdown :deep(h3),
.message-content__markdown :deep(h4) {
  margin: 1em 0 0.5em 0;
  font-weight: 600;
}

.message-content__markdown :deep(h1:first-child),
.message-content__markdown :deep(h2:first-child),
.message-content__markdown :deep(h3:first-child),
.message-content__markdown :deep(h4:first-child) {
  margin-top: 0;
}

.message-content__error {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  background-color: rgba(var(--v-theme-error), 0.1);
  border-radius: var(--radius-md);
  line-height: 1.5;
}

.message-content__error span {
  word-break: break-word;
}

.message-content__streaming {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
}

.message-content__thinking {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.thinking-dots {
  display: flex;
  gap: 4px;
}

.thinking-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-primary));
  animation: thinking-bounce 1.4s infinite ease-in-out both;
}

.thinking-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.thinking-dot:nth-child(2) {
  animation-delay: -0.16s;
}

.thinking-dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes thinking-bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.streaming-cursor {
  color: rgb(var(--v-theme-primary));
  font-weight: normal;
  animation: blink 0.8s step-end infinite;
  margin-left: 1px;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
