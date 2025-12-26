<script setup lang="ts">
/**
 * Chat input component
 * Handles user message input with auto-resize textarea
 */

import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAutoResizeTextarea } from '@/composables';
import { useUserStore } from '@/stores/user';

// Props
interface Props {
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  placeholder: undefined,
});

// Emits
const emit = defineEmits<{
  send: [message: string];
  stop: [];
}>();

const { t } = useI18n();
const userStore = useUserStore();

// State
const message = ref('');
const textareaRef = ref<HTMLTextAreaElement>();
const textareaWrapperRef = ref<HTMLDivElement>();

// Use composable for auto-resize
const { resetHeight } = useAutoResizeTextarea(message, textareaRef, textareaWrapperRef, {
  maxHeight: 200,
  minHeight: 40,
});

// Computed
const canSend = computed(() => message.value.trim().length > 0 && !props.loading);
const sendOnEnter = computed(() => userStore.preferences.sendOnEnter);
const placeholderText = computed(() => props.placeholder ?? t('chat.typeMessage'));

// Methods
function handleSend() {
  if (!canSend.value) return;

  emit('send', message.value.trim());
  message.value = '';
  resetHeight();
}

function handleStop() {
  emit('stop');
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey && sendOnEnter.value) {
    event.preventDefault();
    handleSend();
  }
}
</script>

<template>
  <div class="chat-input pa-4">
    <v-card
      class="chat-input__card"
      :color="$vuetify.theme.current.colors['input-bg']"
      rounded="xl"
      elevation="0"
    >
      <div class="chat-input__wrapper">
        <!-- Input area -->
        <div
          ref="textareaWrapperRef"
          class="chat-input__textarea-wrapper"
        >
          <textarea
            ref="textareaRef"
            v-model="message"
            :placeholder="placeholderText"
            :disabled="disabled"
            :aria-label="$t('chat.typeMessage')"
            aria-describedby="chat-input-hint"
            class="chat-input__textarea"
            rows="1"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Action buttons -->
        <div class="chat-input__actions">
          <v-btn
            v-if="loading"
            icon="mdi-stop"
            color="error"
            variant="flat"
            size="40"
            :aria-label="$t('chat.stopGeneration')"
            @click="handleStop"
          />
          <v-btn
            v-else
            :disabled="!canSend"
            icon="mdi-send"
            color="primary"
            variant="flat"
            size="40"
            :aria-label="$t('chat.sendMessage')"
            @click="handleSend"
          />
        </div>
      </div>

      <!-- Keyboard hint with separator -->
      <div class="chat-input__hint-wrapper">
        <v-divider class="chat-input__divider" />
        <div
          id="chat-input-hint"
          class="chat-input__hint text-caption text-medium-emphasis px-4 py-2"
        >
          {{ $t('chat.hints.warning') }}
        </div>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.chat-input {
  width: 100%;
  max-width: 848px;
  padding: 0 24px 24px !important;
  margin: 0 auto;
}

@media (width <= 960px) {
  .chat-input {
    padding: 0 12px 16px !important;
  }
}

@media (width <= 600px) {
  .chat-input {
    padding: 0 8px 12px !important;
    padding-bottom: max(12px, env(safe-area-inset-bottom)) !important;
  }
}

.chat-input__card {
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.chat-input__card:focus-within {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: var(--shadow-focus);
}

.chat-input__wrapper {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding: 12px 12px 12px 16px;
}

@media (width <= 600px) {
  .chat-input__wrapper {
    gap: 6px;
    padding: 10px 10px 10px 14px;
  }
}

.chat-input__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 40px;
}

.chat-input__textarea-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 0;
  min-height: 40px;
  overflow: hidden;
}

.chat-input__textarea {
  box-sizing: border-box;
  display: block;
  width: 100%;
  min-height: 40px;
  max-height: 200px;
  padding: 8px 0;
  overflow-y: hidden;
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: rgb(var(--v-theme-on-surface));
  resize: none;
  outline: none;
  scrollbar-color: rgb(var(--v-theme-on-surface), 0.3) transparent;
  scrollbar-width: thin;
  background: transparent;
  border: none;
}

.chat-input__textarea::-webkit-scrollbar {
  width: 6px;
}

.chat-input__textarea::-webkit-scrollbar-track {
  background: transparent;
}

.chat-input__textarea::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 3px;
}

.chat-input__textarea::placeholder {
  color: rgb(var(--v-theme-text-secondary));
}

.chat-input__hint-wrapper {
  margin-top: 0;
}

.chat-input__divider {
  margin: 0 12px;
  opacity: 0.15;
}

.chat-input__hint {
  font-size: 0.75rem;
  text-align: center;
  letter-spacing: 0.02em;
}
</style>
