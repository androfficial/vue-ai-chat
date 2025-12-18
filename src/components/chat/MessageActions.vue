<script setup lang="ts">
/**
 * Message actions component
 * Isolated action buttons to prevent re-renders of parent
 */

// Props
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
  opacity: 0;
  transform: translateY(-4px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  display: flex;
  gap: 2px;
  margin-top: 4px;
  margin-left: -6px;
  pointer-events: none;
}

.message-actions--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.message-actions--always-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.message-actions__btn {
  border-radius: 6px !important;
  transition: all 0.15s ease !important;
  width: 28px !important;
  height: 28px !important;
}

.message-actions__btn :deep(.v-icon) {
  font-size: 16px !important;
}

.message-actions__btn:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.08) !important;
  transform: scale(1.05);
}

.message-actions__btn--danger:hover {
  color: rgb(var(--v-theme-error)) !important;
  background-color: rgba(var(--v-theme-error), 0.1) !important;
}
</style>
