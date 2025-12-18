<script setup lang="ts">
/**
 * Appearance settings section component
 * Theme configuration with radio button group
 */

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUserStore } from '@/stores/user'

import SettingsCard from './SettingsCard.vue'

const { t } = useI18n()
const userStore = useUserStore()

// Writable computed for two-way binding (silent auto-save)
const theme = computed({
  get: () => userStore.preferences.theme,
  set: value => {
    userStore.setTheme(value)
  },
})

// Options with reactivity for translations
const themeOptions = computed(() => [
  {
    icon: 'mdi-white-balance-sunny',
    title: t('settings.appearance.themeLight'),
    value: 'light',
  },
  {
    icon: 'mdi-weather-night',
    title: t('settings.appearance.themeDark'),
    value: 'dark',
  },
  {
    icon: 'mdi-laptop',
    title: t('settings.appearance.themeSystem'),
    value: 'system',
  },
])
</script>

<template>
  <SettingsCard
    icon="mdi-palette"
    :title="$t('settings.appearance.title')"
  >
    <v-radio-group
      v-model="theme"
      hide-details
      class="theme-options"
    >
      <v-radio
        v-for="option in themeOptions"
        :key="option.value"
        :value="option.value"
        class="theme-option"
      >
        <template #label>
          <div class="d-flex align-center ga-2">
            <v-icon
              :icon="option.icon"
              size="18"
            />
            <span>{{ option.title }}</span>
          </div>
        </template>
      </v-radio>
    </v-radio-group>
  </SettingsCard>
</template>

<style scoped>
.theme-options {
  margin-top: -4px;
}

.theme-option {
  margin-bottom: 4px;
}

.theme-option:last-child {
  margin-bottom: 0;
}

.theme-option :deep(.v-label) {
  opacity: 1;
}
</style>
