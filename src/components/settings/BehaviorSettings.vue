<script setup lang="ts">
/**
 * Chat behavior settings section component
 */

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useToast } from '@/composables'
import { useUserStore } from '@/stores/user'

import SettingsCard from './SettingsCard.vue'

const { t } = useI18n()
const userStore = useUserStore()
const toast = useToast()

// Writable computed for two-way binding with toast
const sendOnEnter = computed({
  get: () => userStore.preferences.sendOnEnter,
  set: value => {
    userStore.updatePreferences({ sendOnEnter: value })
    toast.success(t('settings.saved'))
  },
})

const showTimestamps = computed({
  get: () => userStore.preferences.showTimestamps,
  set: value => {
    userStore.updatePreferences({ showTimestamps: value })
    toast.success(t('settings.saved'))
  },
})
</script>

<template>
  <SettingsCard
    icon="mdi-chat-processing"
    :title="$t('settings.behavior.title')"
  >
    <v-switch
      v-model="sendOnEnter"
      :label="$t('settings.behavior.sendOnEnter')"
      :hint="$t('settings.behavior.sendOnEnterHint')"
      persistent-hint
      color="primary"
      class="mb-4"
    />

    <v-switch
      v-model="showTimestamps"
      :label="$t('settings.behavior.showTimestamps')"
      color="primary"
    />
  </SettingsCard>
</template>
