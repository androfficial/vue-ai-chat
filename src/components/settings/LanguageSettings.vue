<script setup lang="ts">
/**
 * Language settings section component
 */

import { computed } from 'vue'

import { useUserStore } from '@/stores/user'

import SettingsCard from './SettingsCard.vue'

const userStore = useUserStore()

// Writable computed for two-way binding (silent auto-save)
const locale = computed({
  get: () => userStore.preferences.locale,
  set: value => {
    userStore.setLocale(value)
  },
})

// Static options - no need for reactivity
const localeOptions = [
  { title: 'English', value: 'en' },
  { title: 'Українська', value: 'uk' },
]
</script>

<template>
  <SettingsCard
    icon="mdi-translate"
    :title="$t('settings.language.title')"
  >
    <v-select
      v-model="locale"
      :items="localeOptions"
      :label="$t('settings.language.interfaceLanguage')"
      variant="outlined"
    />
  </SettingsCard>
</template>
