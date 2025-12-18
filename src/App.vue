<script setup lang="ts">
/**
 * Root application component
 * Main layout with sidebar and router view
 */

import { watch } from 'vue'
import { useTheme } from 'vuetify'

import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useHead, useToast } from '@/composables'
import { useUserStore } from '@/stores/user'

// Toast notifications
const toast = useToast()

const theme = useTheme()
const userStore = useUserStore()

// Manage document head (title, description, lang)
useHead()

// Sync theme with user preferences and watch for changes
function applyTheme(themeMode: string) {
  if (themeMode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.global.name.value = prefersDark ? 'dark' : 'light'
  } else {
    theme.global.name.value = themeMode
  }
}

// Apply initial theme
applyTheme(userStore.preferences.theme)

// Watch for theme preference changes
watch(
  () => userStore.preferences.theme,
  newTheme => applyTheme(newTheme),
)
</script>

<template>
  <v-app>
    <!-- Sidebar navigation -->
    <AppSidebar />

    <!-- Main content area -->
    <v-main>
      <main
        id="main-content"
        role="main"
      >
        <router-view />
      </main>
    </v-main>

    <!-- Global toast notifications (Vuetify Snackbar) -->
    <v-snackbar
      v-model="toast.isVisible.value"
      :timeout="toast.timeout.value"
      location="top right"
      rounded="lg"
      elevation="8"
      class="app-snackbar"
      content-class="app-snackbar__content"
    >
      <div
        class="app-snackbar__inner"
        :class="`app-snackbar--${toast.type.value}`"
      >
        <v-icon
          :icon="
            toast.type.value === 'success'
              ? 'mdi-check-circle'
              : toast.type.value === 'error'
                ? 'mdi-alert-circle'
                : toast.type.value === 'warning'
                  ? 'mdi-alert'
                  : 'mdi-information'
          "
          size="20"
          class="app-snackbar__icon"
        />
        <span class="app-snackbar__text">{{ toast.message.value }}</span>
      </div>
    </v-snackbar>
  </v-app>
</template>

<style>
/* Global styles */
html,
body {
  height: 100%;
  overflow: hidden;
}

/* Allow scrolling in main content */
.v-main {
  height: 100vh;
  overflow: hidden;
}

#main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* Disable v-main padding animation when sidebar toggles */
.v-main__wrap {
  transition: none !important;
}

.v-main {
  --v-layout-left: 260px !important;
  padding-left: 260px !important;
  transition: none !important;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(128, 128, 128, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(128, 128, 128, 0.5);
}

/* Snackbar Toast Styles */
.app-snackbar .v-snackbar__wrapper {
  min-width: auto !important;
  margin: 16px;
}

.app-snackbar__content {
  padding: 0 !important;
}

.app-snackbar__inner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  backdrop-filter: blur(8px);
}

.app-snackbar__icon {
  flex-shrink: 0;
}

.app-snackbar__text {
  flex: 1;
}

/* Success variant */
.app-snackbar--success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.app-snackbar--success .app-snackbar__icon {
  color: rgba(255, 255, 255, 0.95);
}

/* Error variant */
.app-snackbar--error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
}

.app-snackbar--error .app-snackbar__icon {
  color: rgba(255, 255, 255, 0.95);
}

/* Warning variant */
.app-snackbar--warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
}

.app-snackbar--warning .app-snackbar__icon {
  color: rgba(255, 255, 255, 0.95);
}

/* Info variant */
.app-snackbar--info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
}

.app-snackbar--info .app-snackbar__icon {
  color: rgba(255, 255, 255, 0.95);
}
</style>
