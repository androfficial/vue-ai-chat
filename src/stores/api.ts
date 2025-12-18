/**
 * API configuration store
 * Manages Cerebras AI API settings
 */

import type { ApiConfig } from '@/types/api'

import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { DEFAULT_API_CONFIG } from '@/types/api'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage'

export const useApiStore = defineStore('api', () => {
  // State
  const config = ref<ApiConfig>(loadConfig())

  // Load config from localStorage
  function loadConfig(): ApiConfig {
    const stored = getStorageItem<Partial<ApiConfig>>(STORAGE_KEYS.API_CONFIG)
    return {
      ...DEFAULT_API_CONFIG,
      apiKey: stored?.apiKey ?? '',
      ...stored,
    }
  }

  // Persist config to localStorage
  watch(
    config,
    newConfig => {
      setStorageItem(STORAGE_KEYS.API_CONFIG, newConfig)
    },
    { deep: true },
  )

  // Getters
  const hasApiKey = computed(() => (config.value.apiKey ?? '').length > 0)
  const isConfigured = computed(() => hasApiKey.value)
  const apiKey = computed(() => config.value.apiKey ?? '')
  const model = computed(() => config.value.model)

  // Actions
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
    // Getters
    apiKey,

    // State
    config,
    hasApiKey,
    isConfigured,
    model,

    // Actions
    resetConfig,
    setApiKey,
    setModel,
    updateConfig,
  }
})
