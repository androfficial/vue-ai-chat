<script setup lang="ts">
/**
 * API settings section component
 * Handles API key, model selection, and configuration
 * All settings auto-save immediately on change (silent)
 */

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { CEREBRAS_MODELS, testApiConnection } from '@/services/api/cerebras'
import { useApiStore } from '@/stores/api'

import SettingsCard from './SettingsCard.vue'

const { t } = useI18n()
const apiStore = useApiStore()

// Writable computed for two-way binding (silent auto-save)
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

// Connection test state
const testingConnection = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

// Model options
const modelOptions = CEREBRAS_MODELS.map(m => ({
  title: m.name,
  value: m.id,
}))

// Methods
async function handleTestConnection() {
  if (!apiKey.value.trim()) {
    testResult.value = {
      message: t('settings.api.apiKeyPlaceholder'),
      success: false,
    }
    return
  }

  testingConnection.value = true
  testResult.value = null

  const result = await testApiConnection()

  testingConnection.value = false

  if (result.success) {
    testResult.value = { message: t('settings.api.connectionSuccess'), success: true }
  } else {
    testResult.value = {
      message: result.error ?? t('settings.api.connectionFailed'),
      success: false,
    }
  }
}
</script>

<template>
  <SettingsCard
    icon="mdi-key"
    :title="$t('settings.api.title')"
  >
    <v-text-field
      v-model="apiKey"
      :label="$t('settings.api.apiKey')"
      type="password"
      variant="outlined"
      :placeholder="$t('settings.api.apiKeyPlaceholder')"
      :hint="$t('settings.api.apiKeyHint')"
      persistent-hint
      class="mb-4 api-key-input"
      clearable
    />

    <v-select
      v-model="selectedModel"
      :items="modelOptions"
      :label="$t('settings.api.model')"
      variant="outlined"
    />

    <!-- Connection Test Result -->
    <v-alert
      v-if="testResult"
      :type="testResult.success ? 'success' : 'error'"
      class="mb-4"
      closable
      @click:close="testResult = null"
    >
      {{ testResult.message }}
    </v-alert>

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
.api-key-input :deep(.v-field__clearable) {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.api-key-input:hover :deep(.v-field__clearable) {
  opacity: 1;
}
</style>
