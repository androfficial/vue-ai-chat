<script setup lang="ts">
/**
 * Message actions component
 * Provides copy, edit, and regenerate actions for messages
 */

interface Props {
  isUser: boolean
  visible: boolean
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  copy: []
  delete: []
  edit: []
  regenerate: []
}>()
</script>

<template>
  <div
    class="message-actions"
    :class="{
      'message-actions--visible': visible,
      'message-actions--always-visible': !isUser,
    }"
  >
    <v-btn
      icon="mdi-content-copy"
      variant="text"
      size="x-small"
      class="message-actions__btn"
      :aria-label="$t('common.copy')"
      @click="emit('copy')"
    />
    <v-btn
      v-if="isUser"
      icon="mdi-pencil"
      variant="text"
      size="x-small"
      class="message-actions__btn"
      :aria-label="$t('common.edit')"
      @click="emit('edit')"
    />
    <v-btn
      v-if="!isUser"
      icon="mdi-refresh"
      variant="text"
      size="x-small"
      class="message-actions__btn"
      :aria-label="$t('chat.regenerate')"
      @click="emit('regenerate')"
    />
  </div>
</template>

<style scoped>
.message-actions {
  display: flex;
  gap: 2px;
  margin-top: 4px;
  margin-left: -6px;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-4px);
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}

.message-actions--visible {
  pointer-events: auto;
  opacity: 1;
  transform: translateY(0);
}

.message-actions--always-visible {
  pointer-events: auto;
  opacity: 1;
  transform: translateY(0);
}

.message-actions__btn {
  width: 28px !important;
  height: 28px !important;
  border-radius: var(--radius-sm) !important;
  transition: all var(--transition-fast) !important;
}

.message-actions__btn :deep(.v-icon) {
  font-size: 16px !important;
}

.message-actions__btn:hover {
  background-color: var(--border-subtle) !important;
  transform: scale(1.05);
}

.message-actions__btn--danger:hover {
  color: rgb(var(--v-theme-error)) !important;
  background-color: rgb(var(--v-theme-error), 0.1) !important;
}
</style>
