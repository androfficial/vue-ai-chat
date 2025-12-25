import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { DEFAULT_API_CONFIG } from '@/types/api'

import { useApiStore } from '../api'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    clear: () => {
      store = {}
    },
    getItem: (key: string) => store[key] || null,
    removeItem: (key: string) => {
      delete store[key]
    },
    setItem: (key: string, value: string) => {
      store[key] = value
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useApiStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
  })

  describe('state initialization', () => {
    it('should initialize with default config', () => {
      const store = useApiStore()

      expect(store.config.baseUrl).toBe(DEFAULT_API_CONFIG.baseUrl)
      expect(store.config.model).toBe(DEFAULT_API_CONFIG.model)
      expect(store.config.temperature).toBe(DEFAULT_API_CONFIG.temperature)
      expect(store.config.maxTokens).toBe(DEFAULT_API_CONFIG.maxTokens)
      expect(store.config.topP).toBe(DEFAULT_API_CONFIG.topP)
      expect(store.config.apiKey).toBe('')
    })

    it('should have hasApiKey computed as false when empty', () => {
      const store = useApiStore()
      expect(store.hasApiKey).toBe(false)
    })

    it('should have isConfigured computed as false when no API key', () => {
      const store = useApiStore()
      expect(store.isConfigured).toBe(false)
    })
  })

  describe('setApiKey', () => {
    it('should set API key', () => {
      const store = useApiStore()
      store.setApiKey('test-api-key-12345')

      expect(store.config.apiKey).toBe('test-api-key-12345')
      expect(store.hasApiKey).toBe(true)
      expect(store.isConfigured).toBe(true)
    })

    it('should update apiKey computed property', () => {
      const store = useApiStore()
      store.setApiKey('my-key')

      expect(store.apiKey).toBe('my-key')
    })
  })

  describe('setModel', () => {
    it('should set model', () => {
      const store = useApiStore()
      store.setModel('llama3.1-8b')

      expect(store.config.model).toBe('llama3.1-8b')
      expect(store.model).toBe('llama3.1-8b')
    })
  })

  describe('updateConfig', () => {
    it('should update single config property', () => {
      const store = useApiStore()
      store.updateConfig({ temperature: 0.9 })

      expect(store.config.temperature).toBe(0.9)
    })

    it('should update multiple config properties', () => {
      const store = useApiStore()
      store.updateConfig({
        maxTokens: 2048,
        temperature: 0.5,
        topP: 0.95,
      })

      expect(store.config.temperature).toBe(0.5)
      expect(store.config.maxTokens).toBe(2048)
      expect(store.config.topP).toBe(0.95)
    })

    it('should preserve other config values', () => {
      const store = useApiStore()
      store.setApiKey('my-key')
      store.updateConfig({ temperature: 0.8 })

      expect(store.config.apiKey).toBe('my-key')
      expect(store.config.model).toBe(DEFAULT_API_CONFIG.model)
    })
  })

  describe('resetConfig', () => {
    it('should reset config to defaults', () => {
      const store = useApiStore()
      store.setApiKey('test-key')
      store.setModel('llama3.1-8b')
      store.updateConfig({ maxTokens: 1024, temperature: 0.9 })

      store.resetConfig()

      expect(store.config.apiKey).toBe('')
      expect(store.config.model).toBe(DEFAULT_API_CONFIG.model)
      expect(store.config.temperature).toBe(DEFAULT_API_CONFIG.temperature)
      expect(store.config.maxTokens).toBe(DEFAULT_API_CONFIG.maxTokens)
    })

    it('should update hasApiKey to false after reset', () => {
      const store = useApiStore()
      store.setApiKey('test-key')
      expect(store.hasApiKey).toBe(true)

      store.resetConfig()
      expect(store.hasApiKey).toBe(false)
    })
  })

  describe('persistence', () => {
    it('should persist config to localStorage on change', async () => {
      const store = useApiStore()
      store.setApiKey('persisted-key')

      // Wait for Vue's watch to trigger
      await flushPromises()

      const stored = JSON.parse(localStorageMock.getItem('ai-chat:api-config') || '{}')
      expect(stored.apiKey).toBe('persisted-key')
    })

    it('should load config from localStorage on init', () => {
      localStorageMock.setItem(
        'ai-chat:api-config',
        JSON.stringify({
          apiKey: 'stored-key',
          model: 'llama3.1-8b',
          temperature: 0.5,
        }),
      )

      // Create new store instance
      setActivePinia(createPinia())
      const store = useApiStore()

      expect(store.config.apiKey).toBe('stored-key')
      expect(store.config.model).toBe('llama3.1-8b')
      expect(store.config.temperature).toBe(0.5)
    })
  })
})
