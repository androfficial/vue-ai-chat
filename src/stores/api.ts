import type { ApiConfig } from '@/types'

import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { DEFAULT_API_CONFIG } from '@/types/api'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage'

export const useApiStore = defineStore('api', () => {
  const config = ref<ApiConfig>(loadConfig())

  function loadConfig(): ApiConfig {
    const stored = getStorageItem<Partial<ApiConfig>>(STORAGE_KEYS.API_CONFIG)
    return {
      ...DEFAULT_API_CONFIG,
      apiKey: stored?.apiKey ?? '',
      ...stored,
    }
  }

  watch(
    config,
    newConfig => {
      setStorageItem(STORAGE_KEYS.API_CONFIG, newConfig)
    },
    { deep: true },
  )

  const hasApiKey = computed(() => (config.value.apiKey ?? '').length > 0)
  const isConfigured = computed(() => hasApiKey.value)
  const apiKey = computed(() => config.value.apiKey ?? '')
  const model = computed(() => config.value.model)

  function setApiKey(key: string) {
    config.value.apiKey = key
  }

  function setModel(modelName: string) {
    config.value.model = modelName
  }

  function updateConfig(updates: Partial<ApiConfig>) {
    config.value = { ...config.value, ...updates }
  }

  function resetConfig() {
    config.value = {
      ...DEFAULT_API_CONFIG,
      apiKey: '',
    }
  }

  return {
    apiKey,
    config,
    hasApiKey,
    isConfigured,
    model,
    resetConfig,
    setApiKey,
    setModel,
    updateConfig,
  }
})
