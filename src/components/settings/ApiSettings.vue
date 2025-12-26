<script setup lang="ts">
/**
 * API settings component
 * Manages Cerebras API configuration
 */

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { testApiConnection } from '@/api'
import { useToast } from '@/composables'
import { useApiStore } from '@/stores/api'
import { CEREBRAS_MODELS } from '@/types'

import SettingsCard from './SettingsCard.vue'

const { t } = useI18n()
const apiStore = useApiStore()
const toast = useToast()

const apiKey = computed({
  get: () => apiStore.apiKey,
  set: value => {
    apiStore.setApiKey(value)
  },
})

const selectedModel = computed({
  get: () => apiStore.model,
  set: value => {
    apiStore.setModel(value)
  },
})

const testingConnection = ref(false)

async function handleTestConnection() {
  if (!apiKey.value.trim()) {
    toast.error(t('settings.api.apiKeyPlaceholder'))
    return
  }

  testingConnection.value = true

  const result = await testApiConnection()

  testingConnection.value = false

  if (result.success) {
    toast.success(t('settings.api.connectionSuccess'))
  } else {
    toast.error(result.error ?? t('settings.api.connectionFailed'))
  }
}
</script>

<template>
  <SettingsCard
    icon="mdi-key"
    :title="$t('settings.api.title')"
  >
    <div class="setting-row">
      <label class="setting-label">{{ $t('settings.api.apiKey') }}</label>
      <v-text-field
        v-model="apiKey"
        type="password"
        variant="outlined"
        density="default"
        :placeholder="$t('settings.api.apiKeyPlaceholder')"
        hide-details
        class="setting-input"
        clearable
      />
      <p class="setting-hint">{{ $t('settings.api.apiKeyHint') }}</p>
    </div>

    <div class="setting-row">
      <label class="setting-label">{{ $t('settings.api.model') }}</label>
      <v-radio-group
        v-model="selectedModel"
        hide-details
        class="model-options"
      >
        <v-radio
          v-for="model in CEREBRAS_MODELS"
          :key="model.id"
          :value="model.id"
          class="model-option"
        >
          <template #label>
            <span>{{ model.name }}</span>
          </template>
        </v-radio>
      </v-radio-group>
    </div>

    <template #actions>
      <v-btn
        variant="outlined"
        :loading="testingConnection"
        @click="handleTestConnection"
      >
        {{ $t('settings.api.testConnection') }}
      </v-btn>
    </template>
  </SettingsCard>
</template>

<style scoped>
.setting-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.setting-input {
  max-width: 100%;
}

.setting-input :deep(.v-field__clearable) {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.setting-input:hover :deep(.v-field__clearable) {
  opacity: 1;
}

.setting-hint {
  margin: 0;
  font-size: 0.8125rem;
  color: rgb(var(--v-theme-on-surface), 0.6);
}

.model-options {
  margin-top: -4px;
}

.model-option {
  margin-bottom: 4px;
}

.model-option:last-child {
  margin-bottom: 0;
}

.model-option :deep(.v-label) {
  opacity: 1;
}
</style>
