<script setup lang="ts">
/**
 * Root application component
 * Main layout with sidebar and router view
 */

import { onMounted, provide, ref, watch } from 'vue'
import { useDisplay, useTheme } from 'vuetify'

import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useHead, useToast } from '@/composables'
import { useUserStore } from '@/stores/user'

// Toast notifications
const toast = useToast()

const theme = useTheme()
const userStore = useUserStore()
const display = useDisplay()

const sidebarRef = ref<InstanceType<typeof AppSidebar> | null>(null)

provide('toggleSidebar', () => sidebarRef.value?.toggleDrawer())
provide('isMobile', () => display.smAndDown.value)

// Manage document head (title, description, lang)
useHead()

/**
 * Apply theme based on user preference
 * Uses Vuetify 3.9+ theme.change() API for proper theme switching
 */
function applyTheme(themeMode: string) {
  if (themeMode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.change(prefersDark ? 'dark' : 'light')
  } else {
    theme.change(themeMode)
  }
}

// Apply initial theme immediately (before mount to prevent flash)
applyTheme(userStore.preferences.theme)

// Listen to system theme changes when in 'system' mode
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (userStore.preferences.theme === 'system') {
      applyTheme('system')
    }
  })
})

// Watch for theme preference changes
watch(
  () => userStore.preferences.theme,
  newTheme => applyTheme(newTheme),
)
</script>

<template>
  <v-app>
    <!-- Sidebar navigation -->
    <AppSidebar ref="sidebarRef" />

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
      :color="toast.type.value"
      location="top right"
      rounded="lg"
      variant="flat"
      class="app-snackbar"
    >
      <div class="d-flex align-center ga-2">
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
        />
        <span>{{ toast.message.value }}</span>
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
  height: 100dvh; /* Dynamic viewport height for mobile */
  overflow: hidden;
}

#main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Changed from overflow-y: auto */
}

/* Disable v-main padding animation when sidebar toggles */
.v-main__wrap {
  transition: none !important;
}

.v-main {
  --v-layout-left: 280px !important;
  padding-left: 280px !important;
  transition: none !important;
}

/* Mobile - no padding for overlay sidebar */
@media (max-width: 960px) {
  .v-main {
    --v-layout-left: 0 !important;
    padding-left: 0 !important;
  }
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
  background: rgba(128, 128, 128, 0.25);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(128, 128, 128, 0.4);
}

/* Snackbar Toast Styles */
.app-snackbar {
  margin-top: 16px !important;
  margin-right: 16px !important;
}

.app-snackbar .v-snackbar__wrapper {
  min-width: auto !important;
}

.app-snackbar .v-snackbar__content {
  font-weight: 500;
}

/* Bright snackbar colors for both themes */
.app-snackbar .v-snackbar__wrapper[class*='bg-success'] {
  background-color: #22c55e !important;
}

.app-snackbar .v-snackbar__wrapper[class*='bg-error'] {
  background-color: #ef4444 !important;
}

.app-snackbar .v-snackbar__wrapper[class*='bg-warning'] {
  background-color: #f59e0b !important;
}

.app-snackbar .v-snackbar__wrapper[class*='bg-info'] {
  background-color: #3b82f6 !important;
}
</style>
