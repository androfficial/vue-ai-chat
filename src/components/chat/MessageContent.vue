<script setup lang="ts">
/**
 * Message content component
 * Handles different message states: pending, streaming, error, complete
 * Supports Markdown rendering for AI responses
 */

import type { MessageStatus } from '@/types/message'

import { marked } from 'marked'
import { computed } from 'vue'

const props = defineProps<Props>()

// Emits
defineEmits<{
  retry: []
}>()

// Configure marked for safe rendering
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
})

// Props
interface Props {
  content: string
  error?: string
  isUser?: boolean
  status: MessageStatus
}

// Render markdown for assistant messages, plain text for user
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

  <!-- Streaming indicator -->
  <div
    v-else-if="status === 'streaming'"
    class="message-content__text"
    v-html="renderedContent"
  />

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
  background-color: rgba(var(--v-theme-on-surface), 0.08);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
}

.message-content__markdown :deep(pre) {
  background-color: rgba(var(--v-theme-on-surface), 0.08);
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0 0 1em 0;
}

.message-content__markdown :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.875em;
}

.message-content__markdown :deep(blockquote) {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.5);
  margin: 0 0 1em 0;
  padding-left: 1em;
  color: rgba(var(--v-theme-on-surface), 0.7);
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
  background-color: rgba(var(--v-theme-error), 0.08);
  border-radius: 8px;
  line-height: 1.5;
}

.message-content__error span {
  word-break: break-word;
}

.streaming-cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
