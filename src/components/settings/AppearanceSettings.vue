<script setup lang="ts">
/**
 * Appearance settings section component
 * Theme configuration
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
  { title: t('settings.appearance.themeLight'), value: 'light' },
  { title: t('settings.appearance.themeDark'), value: 'dark' },
  { title: t('settings.appearance.themeSystem'), value: 'system' },
])
</script>

<template>
  <SettingsCard
    icon="mdi-palette"
    :title="$t('settings.appearance.title')"
  >
    <v-select
      v-model="theme"
      :items="themeOptions"
      :label="$t('settings.appearance.theme')"
      variant="outlined"
    />
  </SettingsCard>
</template>
