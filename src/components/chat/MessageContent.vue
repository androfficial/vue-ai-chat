<script setup lang="ts">
/**
 * Message content component
 * Renders message content with markdown support for assistant messages
 * Code blocks are rendered as separate Vue components with proper event handling
 */

import type { MessageStatus } from '@/types';

import { computed, toRef } from 'vue';

import { useMarkdownRenderer } from '@/composables';

import CodeBlock from './CodeBlock.vue';

// Props
interface Props {
  content: string;
  error?: string;
  isUser?: boolean;
  messageStatus: MessageStatus;
}

const props = defineProps<Props>();

// Emits
defineEmits<{
  retry: [];
}>();

// Use markdown renderer composable for assistant messages
const contentRef = toRef(props, 'content');
const { parsedBlocks } = useMarkdownRenderer(contentRef);

// Check if content has any actual text
const hasContent = computed(() => props.content.length > 0);
</script>

<template>
  <!-- Loading indicator for pending -->
  <div
    v-if="messageStatus === 'pending'"
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
    v-else-if="messageStatus === 'streaming'"
    class="message-content__streaming"
  >
    <!-- Show thinking indicator when no content yet -->
    <div
      v-if="!hasContent"
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
      <div class="message-content__text message-content__markdown">
        <template
          v-for="(block, index) in parsedBlocks"
          :key="index"
        >
          <CodeBlock
            v-if="block.type === 'code'"
            :code="block.code"
            :language="block.language"
          />
          <div
            v-else
            class="markdown-content"
            v-html="block.html"
          />
        </template>
      </div>
      <span class="streaming-cursor">▌</span>
    </template>
  </div>

  <!-- Error state -->
  <div
    v-else-if="messageStatus === 'error'"
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

  <!-- Normal content for user messages -->
  <div
    v-else-if="isUser"
    class="message-content__text message-content__text--user"
  >
    {{ content }}
  </div>

  <!-- Markdown content for assistant with code blocks as Vue components -->
  <div
    v-else
    class="message-content__text message-content__markdown"
  >
    <template
      v-for="(block, index) in parsedBlocks"
      :key="index"
    >
      <CodeBlock
        v-if="block.type === 'code'"
        :code="block.code"
        :language="block.language"
      />
      <div
        v-else
        class="markdown-content"
        v-html="block.html"
      />
    </template>
  </div>
</template>

<style scoped>
.message-content__text {
  line-height: 1.6;
  word-break: break-word;
}

.message-content__text--user {
  white-space: pre-wrap;
}

/* Markdown content styles - using :where() to reduce specificity duplication */
.message-content__markdown :deep(:where(p)) {
  margin: 0 0 1em;
}

.message-content__markdown :deep(:where(p:last-child)) {
  margin-bottom: 0;
}

.message-content__markdown :deep(:where(ul, ol)) {
  padding-left: 1.5em;
  margin: 0 0 1em;
}

.message-content__markdown :deep(:where(li)) {
  margin-bottom: 0.25em;
}

/* Inline code styling */
.message-content__markdown :deep(:where(code)) {
  padding: 0.2em 0.4em;
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 0.9em;
  background-color: rgb(var(--v-theme-surface-variant));
  border-radius: 4px;
}

/* Legacy pre styles for non-code-block pre elements */
.message-content__markdown :deep(:where(pre:not(.code-block__pre))) {
  padding: 1em;
  margin: 0 0 1em;
  overflow-x: auto;
  background-color: rgb(var(--v-theme-surface-variant));
  border-radius: var(--radius-md);
}

.message-content__markdown :deep(:where(pre:not(.code-block__pre) code)) {
  padding: 0;
  font-size: 0.875em;
  background: none;
}

.message-content__markdown :deep(:where(blockquote)) {
  padding-left: 1em;
  margin: 0 0 1em;
  color: rgb(var(--v-theme-text-secondary));
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.message-content__markdown :deep(:where(strong)) {
  font-weight: 600;
}

.message-content__markdown :deep(:where(a)) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.message-content__markdown :deep(:where(a:hover)) {
  text-decoration: underline;
}

.message-content__markdown :deep(:where(h1, h2, h3, h4)) {
  margin: 1em 0 0.5em;
  font-weight: 600;
}

.message-content__markdown :deep(:where(h1, h2, h3, h4):first-child) {
  margin-top: 0;
}

/* Error state */
.message-content__error {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  line-height: 1.5;
  background-color: rgb(var(--v-theme-error), 0.1);
  border-radius: var(--radius-md);
}

.message-content__error span {
  word-break: break-word;
}

/* Streaming state */
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
  background-color: rgb(var(--v-theme-primary));
  border-radius: 50%;
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
    opacity: 0.5;
    transform: scale(0.6);
  }

  40% {
    opacity: 1;
    transform: scale(1);
  }
}

.streaming-cursor {
  margin-left: 1px;
  font-weight: normal;
  color: rgb(var(--v-theme-primary));
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
