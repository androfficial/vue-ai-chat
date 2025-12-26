<script setup lang="ts">
/**
 * Root application component
 * Main layout with sidebar and router view
 */

import { provide, ref } from 'vue';
import { useDisplay } from 'vuetify';

import AppSidebar from '@/components/layout/AppSidebar.vue';
import AppToast from '@/components/layout/AppToast.vue';
import { useHead, useThemeManager } from '@/composables';
import { IS_MOBILE_KEY, TOGGLE_SIDEBAR_KEY } from '@/types';

// Initialize theme manager (handles theme switching and system preference)
useThemeManager();

// Manage document head (title, description, lang)
useHead();

const display = useDisplay();
const sidebarRef = ref<InstanceType<typeof AppSidebar> | null>(null);

// Provide typed functions to descendants via injection keys
provide(TOGGLE_SIDEBAR_KEY, () => sidebarRef.value?.toggleDrawer());
provide(IS_MOBILE_KEY, () => display.smAndDown.value);
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

    <!-- Global toast notifications -->
    <AppToast />
  </v-app>
</template>

<style>
/* App Layout Styles */
html,
body {
  height: 100%;
  overflow: hidden;
}

/* Main content area */
.v-main {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile */
  overflow: hidden;
}

#main-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
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
@media (width <= 960px) {
  .v-main {
    --v-layout-left: 0 !important;
    padding-left: 0 !important;
  }
}
</style>
