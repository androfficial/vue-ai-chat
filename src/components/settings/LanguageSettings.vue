<script setup lang="ts">
/**
 * Language settings component
 * Manages application locale
 */

import { computed } from 'vue'

import { useUserStore } from '@/stores/user'

import SettingsCard from './SettingsCard.vue'

const userStore = useUserStore()

const locale = computed({
  get: () => userStore.preferences.locale,
  set: value => {
    userStore.setLocale(value)
  },
})

const localeOptions = [
  { flag: '🇬🇧', title: 'English', value: 'en' },
  { flag: '🇺🇦', title: 'Українська', value: 'uk' },
]
</script>

<template>
  <SettingsCard
    icon="mdi-translate"
    :title="$t('settings.language.title')"
  >
    <v-radio-group
      v-model="locale"
      hide-details
      class="language-options"
    >
      <v-radio
        v-for="option in localeOptions"
        :key="option.value"
        :value="option.value"
        class="language-option"
      >
        <template #label>
          <div class="d-flex align-center ga-2">
            <span class="flag-emoji">{{ option.flag }}</span>
            <span>{{ option.title }}</span>
          </div>
        </template>
      </v-radio>
    </v-radio-group>
  </SettingsCard>
</template>

<style scoped>
.language-options {
  margin-top: -4px;
}

.language-option {
  margin-bottom: 4px;
}

.language-option:last-child {
  margin-bottom: 0;
}

.language-option :deep(.v-label) {
  opacity: 1;
}

.flag-emoji {
  font-size: 1.125rem;
  line-height: 1;
}
</style>
