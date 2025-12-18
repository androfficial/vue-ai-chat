<script setup lang="ts">
/**
 * Settings page component
 * User preferences and API configuration
 */

import { useRouter } from 'vue-router'

import ApiSettings from '@/components/settings/ApiSettings.vue'
import AppearanceSettings from '@/components/settings/AppearanceSettings.vue'
import DangerZoneSettings from '@/components/settings/DangerZoneSettings.vue'
import LanguageSettings from '@/components/settings/LanguageSettings.vue'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-page__content">
      <!-- Header -->
      <div class="settings-header">
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          size="42"
          class="settings-header__back"
          :aria-label="$t('common.goBack')"
          @click="goBack"
        />
        <h1 class="settings-header__title">{{ $t('settings.title') }}</h1>
      </div>

      <!-- Settings Sections - Each is isolated for better render performance -->
      <ApiSettings />
      <AppearanceSettings />
      <LanguageSettings />
      <DangerZoneSettings />
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  width: 100%;
  min-height: fit-content;
  padding: 32px 24px 48px;
  display: flex;
  justify-content: center;
}

.settings-page__content {
  width: 100%;
  max-width: 600px;
}

.settings-header {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  gap: 8px;
}

.settings-header__back {
  margin-left: -8px;
}

.settings-header__title {
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
</style>
