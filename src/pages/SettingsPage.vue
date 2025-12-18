<script setup lang="ts">
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
          size="40"
          class="settings-header__back"
          :aria-label="$t('common.goBack')"
          @click="goBack"
        />
        <h1 class="settings-header__title">{{ $t('settings.title') }}</h1>
      </div>

      <!-- Settings Sections -->
      <div class="settings-sections">
        <ApiSettings />
        <AppearanceSettings />
        <LanguageSettings />
        <DangerZoneSettings />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  width: 100%;
  min-height: 100%;
  padding: 24px 16px 48px;
  display: flex;
  justify-content: center;
  background-color: rgb(var(--v-theme-background));
}

@media (max-width: 600px) {
  .settings-page {
    padding: 16px 12px 32px;
  }
}

.settings-page__content {
  width: 100%;
  max-width: 560px;
}

.settings-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.settings-header__back {
  margin-left: -8px;
  color: rgb(var(--v-theme-text-secondary));
}

.settings-header__back:hover {
  color: rgb(var(--v-theme-on-surface));
  background-color: var(--border-subtle);
}

.settings-header__title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

@media (max-width: 600px) {
  .settings-header__title {
    font-size: 1.25rem;
  }
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
