<script setup lang="ts">
/**
 * Chat header component
 * Mobile header with menu button and temporary chat toggle
 */

interface Props {
  canToggleTemporaryMode: boolean;
  hasMessages: boolean;
  isCurrentChatTemporary: boolean;
  isTemporaryChatMode: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'new-chat': [];
  'save-chat': [];
  'toggle-sidebar': [];
  'toggle-temporary-mode': [];
}>();
</script>

<template>
  <!-- Mobile header with menu button -->
  <div class="chat-header__mobile">
    <v-btn
      icon="mdi-menu"
      variant="text"
      size="40"
      :aria-label="$t('sidebar.expandSidebar')"
      @click="emit('toggle-sidebar')"
    />
    <span class="chat-header__mobile-title">AI Chat</span>
    <v-btn
      icon="mdi-square-edit-outline"
      variant="text"
      size="40"
      :aria-label="$t('sidebar.newChat')"
      @click="emit('new-chat')"
    />
  </div>

  <!-- Top right temporary chat toggle -->
  <div
    v-if="canToggleTemporaryMode"
    class="chat-header__actions"
  >
    <v-btn
      variant="text"
      size="small"
      class="chat-header__temp-toggle"
      :class="{ 'chat-header__temp-toggle--active': isTemporaryChatMode || isCurrentChatTemporary }"
      @click="emit('toggle-temporary-mode')"
    >
      <v-icon
        :icon="
          isTemporaryChatMode || isCurrentChatTemporary ? 'mdi-incognito' : 'mdi-incognito-off'
        "
        size="18"
        class="mr-2"
      />
      <span class="chat-header__temp-toggle-text">
        {{
          isTemporaryChatMode || isCurrentChatTemporary
            ? $t('chat.temporaryChat.disable')
            : $t('chat.temporaryChat.enable')
        }}
      </span>
    </v-btn>

    <!-- Save button for temporary chats -->
    <v-btn
      v-if="isCurrentChatTemporary && hasMessages"
      variant="tonal"
      size="small"
      color="primary"
      class="chat-header__save-btn ml-2"
      @click="emit('save-chat')"
    >
      <v-icon
        icon="mdi-content-save-outline"
        size="18"
        class="mr-1"
      />
      {{ $t('chat.temporaryChat.save') }}
    </v-btn>
  </div>
</template>

<style scoped>
.chat-header__mobile {
  display: none;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background-color: rgb(var(--v-theme-background));
  border-bottom: 1px solid var(--border-subtle);
}

.chat-header__mobile-title {
  font-size: 1.1rem;
  font-weight: 600;
}

@media (width <= 960px) {
  .chat-header__mobile {
    display: flex;
  }
}

.chat-header__actions {
  position: absolute;
  top: 12px;
  right: 16px;
  z-index: 100;
  display: flex;
  align-items: center;
}

@media (width <= 960px) {
  .chat-header__actions {
    position: relative;
    top: 0;
    right: 0;
    justify-content: center;
    padding: 8px 12px;
  }
}

.chat-header__temp-toggle {
  padding: 0 12px !important;
  font-weight: 400;
  text-transform: none !important;
  letter-spacing: normal;
  border-radius: 20px !important;
  opacity: 0.6;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease;
}

.chat-header__temp-toggle:hover {
  background-color: var(--border-subtle) !important;
  opacity: 1;
}

.chat-header__temp-toggle--active {
  color: rgb(var(--v-theme-primary)) !important;
  background-color: rgb(var(--v-theme-primary), 0.1) !important;
  opacity: 1;
}

.chat-header__temp-toggle-text {
  font-size: 0.85rem;
}

.chat-header__save-btn {
  font-weight: 500;
  text-transform: none !important;
  border-radius: 20px !important;
}
</style>
