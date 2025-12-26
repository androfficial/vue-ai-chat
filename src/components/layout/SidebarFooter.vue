<script setup lang="ts">
/**
 * Sidebar footer component
 * Contains theme toggle and settings link
 */

import { useUserStore } from '@/stores/user'

interface Props {
  isMobile: boolean
  rail: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'open-settings': []
}>()

const userStore = useUserStore()
</script>

<template>
  <v-list
    density="compact"
    nav
    :class="['pa-2 sidebar-footer', { 'sidebar-footer-railed': !isMobile && rail }]"
  >
    <v-list-item
      :prepend-icon="userStore.isDarkMode ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
      @click="userStore.toggleTheme()"
    >
      <v-list-item-title
        class="sidebar-item-title"
        :class="{ 'sidebar-item-title-hidden': !isMobile && rail }"
      >
        {{ userStore.isDarkMode ? $t('sidebar.lightMode') : $t('sidebar.darkMode') }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item
      prepend-icon="mdi-cog-outline"
      @click="emit('open-settings')"
    >
      <v-list-item-title
        class="sidebar-item-title"
        :class="{ 'sidebar-item-title-hidden': !isMobile && rail }"
      >
        {{ $t('common.settings') }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style scoped>
.sidebar-footer :deep(.v-list-item) {
  min-height: 40px !important;
  padding-inline: 12px !important;
  margin-bottom: 2px;
  border-radius: var(--radius-sm) !important;
  transition:
    background-color var(--transition-fast),
    margin 0.2s ease,
    padding 0.2s ease;
}

.sidebar-footer :deep(.v-list-item__prepend) {
  margin-inline-end: 12px;
}

.sidebar-item-title {
  overflow: hidden;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  transition:
    opacity 0.15s ease,
    width 0.15s ease;
}

.sidebar-item-title-hidden {
  width: 0;
  pointer-events: none;
  opacity: 0;
}

/* Styles for collapsed sidebar (rail mode) */
.sidebar-footer-railed {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px !important;
}

.sidebar-footer-railed :deep(.v-list-item) {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  width: 40px !important;
  min-width: 40px !important;
  padding: 8px !important;
  margin: 0 0 2px !important;
}

.sidebar-footer-railed :deep(.v-list-item__prepend) {
  padding: 0 !important;
  margin: 0 !important;
  margin-inline-end: 0 !important;
}

.sidebar-footer-railed :deep(.v-list-item__spacer) {
  width: 0 !important;
  min-width: 0 !important;
  opacity: 0;
}

.sidebar-footer-railed :deep(.v-list-item__content) {
  position: absolute;
  width: 0 !important;
  max-width: 0 !important;
  overflow: hidden;
  opacity: 0;
}

.sidebar-footer-railed :deep(.v-list-item .v-icon) {
  margin: 0 auto !important;
}

@media (width <= 960px) {
  .sidebar-footer :deep(.v-list-item) {
    min-height: 48px !important;
    padding-inline: 16px !important;
  }
}
</style>
