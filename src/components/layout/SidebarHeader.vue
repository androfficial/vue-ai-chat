<script setup lang="ts">
/**
 * Sidebar header component
 * Contains rail toggle, title, and new chat button
 */

interface Props {
  isMobile: boolean;
  rail: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'close-drawer': [];
  'new-chat': [];
  'toggle-rail': [];
}>();
</script>

<template>
  <div :class="['sidebar-header', { 'sidebar-header-railed': !isMobile && rail }]">
    <!-- Desktop: Rail toggle button -->
    <v-btn
      v-if="!isMobile"
      :icon="rail ? 'mdi-menu' : 'mdi-menu-open'"
      variant="text"
      density="comfortable"
      :aria-label="rail ? $t('sidebar.expandSidebar') : $t('sidebar.collapseSidebar')"
      :aria-expanded="!rail"
      @click="emit('toggle-rail')"
    />
    <!-- Mobile: Close button -->
    <v-btn
      v-else
      icon="mdi-close"
      variant="text"
      density="comfortable"
      :aria-label="$t('common.close')"
      @click="emit('close-drawer')"
    />
    <span
      class="sidebar-title text-h6 font-weight-bold flex-grow-1 ml-2"
      :class="{ 'sidebar-title-hidden': !isMobile && rail }"
      style="cursor: pointer"
      @click="emit('new-chat')"
    >
      AI Chat
    </span>
    <v-btn
      icon="mdi-square-edit-outline"
      variant="text"
      density="comfortable"
      :aria-label="$t('sidebar.newChat')"
      class="sidebar-new-chat-btn"
      :class="{ 'sidebar-new-chat-btn-hidden': !isMobile && rail }"
      @click="emit('new-chat')"
    />
  </div>
</template>

<style scoped>
.sidebar-header {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  min-height: 48px;
  padding: 12px;
  transition: padding 0.2s ease;
}

.sidebar-header-railed {
  padding: 12px 8px;
}

.sidebar-title {
  overflow: hidden;
  white-space: nowrap;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    width 0.15s ease;
}

.sidebar-title-hidden {
  width: 0;
  pointer-events: none;
  opacity: 0;
  transform: translateX(-10px);
}

.sidebar-new-chat-btn {
  flex-shrink: 0;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.sidebar-new-chat-btn-hidden {
  position: absolute;
  right: 0;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.8);
}

.sidebar-header-railed .sidebar-title-hidden,
.sidebar-header-railed .sidebar-new-chat-btn-hidden {
  position: absolute;
  width: 0;
  overflow: hidden;
}

@media (width <= 960px) {
  .sidebar-header {
    padding: 16px;
  }
}
</style>
