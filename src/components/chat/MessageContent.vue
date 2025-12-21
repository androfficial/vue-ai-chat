<script setup lang="ts">
/**
 * Message content component
 * Renders message content with markdown support for assistant messages
 * Code blocks are rendered with syntax highlighting and copy functionality
 */

import type { MessageStatus } from '@/types'
import type { Tokens } from 'marked'

import hljs from 'highlight.js'
import { marked } from 'marked'
import { computed } from 'vue'

// Props
interface Props {
  content: string
  error?: string
  isUser?: boolean
  messageStatus: MessageStatus
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  retry: []
}>()

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Generate unique ID for code block copy functionality
 */
function generateCodeBlockId(): string {
  return `code-block-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Custom renderer for code blocks with syntax highlighting and copy button
 */
const renderer = {
  code({ lang, text }: Tokens.Code): string {
    const language = lang || ''
    const codeBlockId = generateCodeBlockId()

    // Normalize language name for display
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      md: 'markdown',
      py: 'python',
      rb: 'ruby',
      sh: 'bash',
      shell: 'bash',
      ts: 'typescript',
      tsx: 'typescript',
      yml: 'yaml',
    }
    const displayLanguage = languageMap[language.toLowerCase()] || language.toLowerCase() || 'text'

    // Highlight code
    let highlightedCode: string
    if (language && hljs.getLanguage(language)) {
      try {
        highlightedCode = hljs.highlight(text, { language }).value
      } catch {
        highlightedCode = escapeHtml(text)
      }
    } else {
      try {
        highlightedCode = hljs.highlightAuto(text).value
      } catch {
        highlightedCode = escapeHtml(text)
      }
    }

    return `<div class="code-block" data-code-block-id="${codeBlockId}">
      <div class="code-block__header">
        <span class="code-block__language">${displayLanguage}</span>
        <button class="code-block__copy-btn" data-copy-code="${codeBlockId}" onclick="window.__copyCodeBlock('${codeBlockId}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span class="code-block__copy-text">Copy code</span>
        </button>
      </div>
      <div class="code-block__content">
        <pre class="code-block__pre"><code class="code-block__code hljs" data-code-content="${codeBlockId}">${highlightedCode}</code></pre>
      </div>
      <textarea class="code-block__hidden-textarea" data-code-raw="${codeBlockId}" aria-hidden="true">${escapeHtml(text)}</textarea>
    </div>`
  },
}

// Configure marked with custom renderer
marked.use({
  breaks: true,
  gfm: true,
  renderer,
})

// Global function for copy button click handler
if (typeof window !== 'undefined') {
  ;(window as Window & { __copyCodeBlock?: (id: string) => void }).__copyCodeBlock = (
    id: string,
  ) => {
    const textarea = document.querySelector(
      `textarea[data-code-raw="${id}"]`,
    ) as HTMLTextAreaElement
    const button = document.querySelector(`button[data-copy-code="${id}"]`) as HTMLButtonElement

    if (textarea && button) {
      navigator.clipboard.writeText(textarea.value).then(() => {
        const textSpan = button.querySelector('.code-block__copy-text')
        if (textSpan) {
          const originalText = textSpan.textContent
          textSpan.textContent = 'Copied!'
          button.classList.add('code-block__copy-btn--copied')

          setTimeout(() => {
            textSpan.textContent = originalText
            button.classList.remove('code-block__copy-btn--copied')
          }, 2000)
        }
      })
    }
  }
}

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

  <!-- Normal content -->
  <div
    v-else-if="isUser"
    class="message-content__text message-content__text--user"
  >
    {{ content }}
  </div>

  <!-- Markdown content for assistant with code blocks -->
  <div
    v-else
    class="message-content__text message-content__markdown"
    v-html="renderedContent"
  />
</template>

<style scoped>
.message-content__text {
  line-height: 1.6;
  word-break: break-word;
}

.message-content__text--user {
  white-space: pre-wrap;
}

.message-content__markdown :deep(p) {
  margin: 0 0 1em;
}

.message-content__markdown :deep(p:last-child) {
  margin-bottom: 0;
}

.message-content__markdown :deep(ul),
.message-content__markdown :deep(ol) {
  padding-left: 1.5em;
  margin: 0 0 1em;
}

.message-content__markdown :deep(li) {
  margin-bottom: 0.25em;
}

.message-content__markdown :deep(code) {
  padding: 0.2em 0.4em;
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 0.9em;
  background-color: rgb(var(--v-theme-surface-variant));
  border-radius: 4px;
}

/* Code block container */
.message-content__markdown :deep(.code-block) {
  margin: 1em 0;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.message-content__markdown :deep(.code-block__header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: rgb(var(--v-theme-surface-variant));
  border-bottom: 1px solid var(--border-subtle);
}

.message-content__markdown :deep(.code-block__language) {
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(var(--v-theme-text-secondary));
  text-transform: lowercase;
}

.message-content__markdown :deep(.code-block__copy-btn) {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 4px 10px;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(var(--v-theme-text-secondary));
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.message-content__markdown :deep(.code-block__copy-btn:hover) {
  color: rgb(var(--v-theme-on-surface));
  background-color: var(--border-subtle);
}

.message-content__markdown :deep(.code-block__copy-btn:active) {
  transform: scale(0.95);
}

.message-content__markdown :deep(.code-block__copy-btn--copied) {
  color: rgb(var(--v-theme-primary));
}

.message-content__markdown :deep(.code-block__copy-text) {
  line-height: 1;
}

.message-content__markdown :deep(.code-block__content) {
  overflow-x: auto;
  background-color: rgb(var(--v-theme-surface-variant));
}

.message-content__markdown :deep(.code-block__pre) {
  padding: 1em;
  margin: 0;
  overflow-x: auto;
  background: transparent !important;
}

.message-content__markdown :deep(.code-block__code) {
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  background: transparent !important;
}

.message-content__markdown :deep(.code-block__hidden-textarea) {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  opacity: 0;
}

/* Legacy pre styles for non-code-block pre elements */
.message-content__markdown :deep(pre:not(.code-block__pre)) {
  padding: 1em;
  margin: 0 0 1em;
  overflow-x: auto;
  background-color: rgb(var(--v-theme-surface-variant));
  border-radius: var(--radius-md);
}

.message-content__markdown :deep(pre:not(.code-block__pre) code) {
  padding: 0;
  font-size: 0.875em;
  background: none;
}

.message-content__markdown :deep(blockquote) {
  padding-left: 1em;
  margin: 0 0 1em;
  color: rgb(var(--v-theme-text-secondary));
  border-left: 3px solid rgb(var(--v-theme-primary));
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
  margin: 1em 0 0.5em;
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
  line-height: 1.5;
  background-color: rgb(var(--v-theme-error), 0.1);
  border-radius: var(--radius-md);
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
