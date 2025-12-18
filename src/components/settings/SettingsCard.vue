<script setup lang="ts">
/**
 * Settings card wrapper component
 * Provides consistent card layout for settings sections
 */

interface Props {
  icon: string
  title: string
  variant?: 'default' | 'danger'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <v-card
    class="settings-card"
    :class="{ 'settings-card--danger': variant === 'danger' }"
    elevation="0"
  >
    <v-card-title
      class="settings-card__title"
      :class="{ 'text-error': variant === 'danger' }"
    >
      <v-icon
        :icon="icon"
        class="mr-3"
        size="22"
      />
      {{ title }}
    </v-card-title>

    <v-divider class="mx-4" />

    <v-card-text class="settings-card__content">
      <slot />
    </v-card-text>

    <template v-if="$slots.actions">
      <v-divider class="mx-4" />
      <v-card-actions class="settings-card__actions">
        <slot name="actions" />
      </v-card-actions>
    </template>
  </v-card>
</template>

<style scoped>
.settings-card {
  margin-bottom: 24px;
  border-radius: 16px !important;
  border: 1px solid rgba(var(--v-border-color), 0.08);
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.settings-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.settings-card__title {
  font-size: 1rem;
  font-weight: 600;
  padding: 20px 24px;
  display: flex;
  align-items: center;
}

.settings-card__content {
  padding: 20px 24px;
}

.settings-card__actions {
  padding: 16px 24px;
}

.settings-card--danger {
  border: 1px solid rgba(var(--v-theme-error), 0.3);
  background: rgba(var(--v-theme-error), 0.02);
}

.settings-card--danger:hover {
  border-color: rgba(var(--v-theme-error), 0.5);
}
</style>
