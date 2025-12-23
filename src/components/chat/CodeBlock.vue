<script setup lang="ts">
/**
 * Code block component with syntax highlighting and copy functionality
 * Renders code with proper highlighting and provides copy button
 */

import hljs from 'highlight.js'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useClipboard } from '@/composables'

interface Props {
  code: string
  language?: string
}

const props = defineProps<Props>()

const { t } = useI18n()
const { copy } = useClipboard()

const isCopied = ref(false)

/**
 * Language name mapping for display
 */
const LANGUAGE_MAP: Record<string, string> = {
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

/**
 * Normalized language name for display
 */
const displayLanguage = computed(() => {
  const lang = props.language?.toLowerCase() || ''
  return LANGUAGE_MAP[lang] || lang || 'text'
})

/**
 * Syntax highlighted code HTML
 */
const highlightedCode = computed(() => {
  const lang = props.language || ''

  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(props.code, { language: lang }).value
    } catch {
      return escapeHtml(props.code)
    }
  }

  try {
    return hljs.highlightAuto(props.code).value
  } catch {
    return escapeHtml(props.code)
  }
})

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Copy code to clipboard
 */
async function copyCode() {
  await copy(props.code)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <div class="code-block">
    <div class="code-block__header">
      <span class="code-block__language">{{ displayLanguage }}</span>
      <button
        class="code-block__copy-btn"
        :class="{ 'code-block__copy-btn--copied': isCopied }"
        :aria-label="t('common.copy')"
        @click="copyCode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect
            x="9"
            y="9"
            width="13"
            height="13"
            rx="2"
            ry="2"
          />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span class="code-block__copy-text">
          {{ isCopied ? t('common.copied') : t('common.copy') }}
        </span>
      </button>
    </div>
    <div class="code-block__content">
      <pre class="code-block__pre"><code
        class="code-block__code hljs"
        v-html="highlightedCode"
      /></pre>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  margin: 1em 0;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.code-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: rgb(var(--v-theme-surface-variant));
  border-bottom: 1px solid var(--border-subtle);
}

.code-block__language {
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(var(--v-theme-text-secondary));
  text-transform: lowercase;
}

.code-block__copy-btn {
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

.code-block__copy-btn:hover {
  color: rgb(var(--v-theme-on-surface));
  background-color: var(--border-subtle);
}

.code-block__copy-btn:active {
  transform: scale(0.95);
}

.code-block__copy-btn--copied {
  color: rgb(var(--v-theme-primary));
}

.code-block__copy-text {
  line-height: 1;
}

.code-block__content {
  overflow-x: auto;
  background-color: rgb(var(--v-theme-surface-variant));
}

.code-block__pre {
  padding: 1em;
  margin: 0;
  overflow-x: auto;
  background: transparent !important;
}

.code-block__code {
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  background: transparent !important;
}
</style>
