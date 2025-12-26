<script setup lang="ts">
/**
 * Global toast notification component
 * Uses Vuetify v-snackbar for consistent styling
 */

import { computed } from 'vue';

import { useToast } from '@/composables';

const toast = useToast();

/**
 * Get icon based on toast type
 */
const toastIcon = computed(() => {
  const icons: Record<string, string> = {
    error: 'mdi-alert-circle',
    info: 'mdi-information',
    success: 'mdi-check-circle',
    warning: 'mdi-alert',
  };
  return icons[toast.type.value] ?? 'mdi-information';
});
</script>

<template>
  <v-snackbar
    v-model="toast.isVisible.value"
    :timeout="toast.timeout.value"
    :color="toast.type.value"
    location="top right"
    rounded="lg"
    variant="flat"
    class="app-toast"
  >
    <div class="d-flex align-center ga-2">
      <v-icon
        :icon="toastIcon"
        size="20"
      />
      <span>{{ toast.message.value }}</span>
    </div>
  </v-snackbar>
</template>

<style>
/* Toast positioning */
.app-toast {
  margin-top: 16px !important;
  margin-right: 16px !important;
}

.app-toast .v-snackbar__wrapper {
  min-width: auto !important;
}

.app-toast .v-snackbar__content {
  font-weight: 500;
}

/* Bright toast colors for both themes */
.app-toast .v-snackbar__wrapper[class*='bg-success'] {
  background-color: var(--color-success) !important;
}

.app-toast .v-snackbar__wrapper[class*='bg-error'] {
  background-color: var(--color-error) !important;
}

.app-toast .v-snackbar__wrapper[class*='bg-warning'] {
  background-color: var(--color-warning) !important;
}

.app-toast .v-snackbar__wrapper[class*='bg-info'] {
  background-color: var(--color-info) !important;
}
</style>
