<script setup lang="ts">
/**
 * Chat behavior settings section component
 * Toggle switches for chat preferences
 */

import { computed } from 'vue'

import { useUserStore } from '@/stores/user'

import SettingsCard from './SettingsCard.vue'

const userStore = useUserStore()

// Writable computed for two-way binding (silent auto-save)
const sendOnEnter = computed({
  get: () => userStore.preferences.sendOnEnter,
  set: value => {
    userStore.updatePreferences({ sendOnEnter: value })
  },
})

const showTimestamps = computed({
  get: () => userStore.preferences.showTimestamps,
  set: value => {
    userStore.updatePreferences({ showTimestamps: value })
  },
})
</script>

<template>
  <SettingsCard
    icon="mdi-chat-processing"
    :title="$t('settings.behavior.title')"
  >
    <div class="setting-toggle">
      <div class="setting-toggle__content">
        <div class="setting-toggle__label">{{ $t('settings.behavior.sendOnEnter') }}</div>
        <div class="setting-toggle__hint">{{ $t('settings.behavior.sendOnEnterHint') }}</div>
      </div>
      <v-switch
        v-model="sendOnEnter"
        hide-details
        color="primary"
        density="compact"
      />
    </div>

    <div class="setting-toggle">
      <div class="setting-toggle__content">
        <div class="setting-toggle__label">{{ $t('settings.behavior.showTimestamps') }}</div>
      </div>
      <v-switch
        v-model="showTimestamps"
        hide-details
        color="primary"
        density="compact"
      />
    </div>
  </SettingsCard>
</template>

<style scoped>
.setting-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.setting-toggle__content {
  flex: 1;
  min-width: 0;
}

.setting-toggle__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.setting-toggle__hint {
  font-size: 0.8125rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-top: 2px;
}
</style>
