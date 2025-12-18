<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  variant?: 'default' | 'danger'
}

withDefaults(defineProps<Props>(), {
  icon: undefined,
  variant: 'default',
})
</script>

<template>
  <section
    class="settings-section"
    :class="{ 'settings-section--danger': variant === 'danger' }"
  >
    <header class="settings-section__header">
      <v-icon
        v-if="icon"
        :icon="icon"
        :class="{ 'text-error': variant === 'danger' }"
        size="20"
      />
      <h2
        class="settings-section__title"
        :class="{ 'text-error': variant === 'danger' }"
      >
        {{ title }}
      </h2>
    </header>

    <div class="settings-section__content">
      <slot />
    </div>

    <div
      v-if="$slots.actions"
      class="settings-section__actions"
    >
      <slot name="actions" />
    </div>
  </section>
</template>

<style scoped>
.settings-section {
  padding: 20px 0;
  border-bottom: 1px solid var(--border-subtle);
}

.settings-section:last-child {
  border-bottom: none;
}

.settings-section__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.settings-section__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.settings-section__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.settings-section__actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.settings-section--danger {
  padding-top: 24px;
  margin-top: 8px;
  border-bottom: none;
}

.settings-section--danger .settings-section__header {
  color: rgb(var(--v-theme-error));
}
</style>
