<script setup lang="ts">
import type { Message } from '@/types/message'

import { computed, ref } from 'vue'

import { useUserStore } from '@/stores/user'
import { formatMessageTime } from '@/utils/date'

import MessageActions from './MessageActions.vue'
import MessageContent from './MessageContent.vue'

// Props
interface Props {
  message: Message
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  copy: [content: string]
  delete: [messageId: string]
  edit: [messageId: string, content: string]
  regenerate: [messageId: string]
}>()

// State
const userStore = useUserStore()
const isEditing = ref(false)
const editContent = ref('')
const showActions = ref(false)

// Computed
const isUser = computed(() => props.message.role === 'user')
const isAssistant = computed(() => props.message.role === 'assistant')
const showTimestamps = computed(() => userStore.preferences.showTimestamps)
const formattedTime = computed(() => formatMessageTime(props.message.createdAt))
const isStreaming = computed(() => props.message.status === 'streaming')
const isError = computed(() => props.message.status === 'error')
const isPending = computed(() => props.message.status === 'pending')
const canShowActions = computed(
  () =>
    !isEditing.value &&
    !isStreaming.value &&
    !isPending.value &&
    (showActions.value || isAssistant.value),
)

// Methods
function startEdit() {
  editContent.value = props.message.content
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  editContent.value = ''
}

function saveEdit() {
  if (editContent.value.trim()) {
    emit('edit', props.message.id, editContent.value.trim())
  }
  isEditing.value = false
}

function copyContent() {
  emit('copy', props.message.content)
}

function deleteMessage() {
  emit('delete', props.message.id)
}

function regenerate() {
  emit('regenerate', props.message.id)
}
</script>

<template>
  <div
    class="message-bubble"
    :class="{
      'message-bubble--user': isUser,
      'message-bubble--assistant': isAssistant,
      'message-bubble--error': isError,
    }"
    @mouseenter="showActions = true"
    @mouseleave="showActions = false"
  >
    <div class="message-bubble__container">
      <!-- User message - bubble style like ChatGPT -->
      <template v-if="isUser">
        <div class="message-bubble__user-wrapper">
          <!-- Message bubble -->
          <div
            v-if="!isEditing"
            class="message-bubble__user-bubble"
          >
            <MessageContent
              :content="message.content"
              :status="message.status"
              :error="message.error"
              is-user
            />
            <!-- Edited badge inside bubble -->
            <span
              v-if="message.isEdited"
              class="message-bubble__edited-text"
            >
              {{ $t('chat.edit') }}
            </span>
          </div>

          <!-- Edit mode -->
          <div
            v-else
            class="message-bubble__edit"
          >
            <v-textarea
              v-model="editContent"
              auto-grow
              rows="2"
              hide-details
              variant="outlined"
              density="compact"
              :aria-label="$t('chat.editMessage')"
            />
            <div class="d-flex justify-end mt-2 ga-2">
              <v-btn
                variant="text"
                size="small"
                @click="cancelEdit"
              >
                {{ $t('common.cancel') }}
              </v-btn>
              <v-btn
                color="primary"
                size="small"
                @click="saveEdit"
              >
                {{ $t('common.save') }}
              </v-btn>
            </div>
          </div>
        </div>

        <!-- Actions for user -->
        <MessageActions
          :visible="canShowActions"
          is-user
          @copy="copyContent"
          @delete="deleteMessage"
          @edit="startEdit"
          @regenerate="regenerate"
        />
      </template>

      <!-- Assistant message - with avatar -->
      <template v-else>
        <!-- Avatar + Header row -->
        <div class="message-bubble__header-row">
          <v-avatar
            color="secondary"
            size="28"
          >
            <v-icon
              icon="mdi-robot"
              size="18"
            />
          </v-avatar>
          <span class="text-subtitle-2 font-weight-bold text-secondary">
            {{ $t('chat.assistant') }}
          </span>
          <span
            v-if="showTimestamps"
            class="text-caption text-medium-emphasis"
          >
            {{ formattedTime }}
          </span>
        </div>

        <!-- Content -->
        <div class="message-bubble__content">
          <!-- Message body -->
          <div class="message-bubble__body">
            <MessageContent
              :content="message.content"
              :status="message.status"
              :error="message.error"
              :is-user="false"
            />
          </div>

          <!-- Actions -->
          <MessageActions
            :visible="canShowActions"
            :is-user="false"
            @copy="copyContent"
            @delete="deleteMessage"
            @edit="startEdit"
            @regenerate="regenerate"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.message-bubble {
  padding: 12px 0;
  transition: background-color var(--transition-fast);
}

.message-bubble__container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 848px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 960px) {
  .message-bubble__container {
    padding: 0 16px;
  }
}

@media (max-width: 600px) {
  .message-bubble__container {
    padding: 0 12px;
  }
}

.message-bubble__header-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-bubble__header-row :deep(.v-avatar) {
  box-shadow: var(--shadow-sm);
}

/* User message - ChatGPT style bubble */
.message-bubble--user .message-bubble__container {
  align-items: flex-end;
}

.message-bubble__user-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  max-width: 85%;
}

@media (max-width: 600px) {
  .message-bubble__user-wrapper {
    max-width: 92%;
  }
}

.message-bubble__user-bubble {
  background-color: rgb(var(--v-theme-chat-user-bg));
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  padding: 12px 18px;
  text-align: left;
  line-height: 1.6;
  font-size: 0.9375rem;
}

@media (max-width: 600px) {
  .message-bubble__user-bubble {
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 0.9rem;
  }
}

.message-bubble__edited-text {
  display: block;
  font-size: 0.75rem;
  color: rgb(var(--v-theme-text-secondary));
  margin-top: 4px;
  font-style: italic;
}

.message-bubble--user .message-bubble__edit {
  width: 100%;
  min-width: 280px;
}

@media (max-width: 600px) {
  .message-bubble--user .message-bubble__edit {
    min-width: 200px;
  }
}

.message-bubble--user :deep(.message-actions) {
  justify-content: flex-end;
}

.message-bubble__content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
}

.message-bubble__body {
  line-height: 1.65;
  font-size: 0.9375rem;
}

.message-bubble:hover :deep(.message-actions) {
  opacity: 1;
}

/* Animation */
.message-bubble {
  animation: messageAppear 0.3s ease-out;
}

@keyframes messageAppear {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
