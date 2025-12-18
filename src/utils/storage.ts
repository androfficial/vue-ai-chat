/**
 * Storage keys for localStorage
 */
export const STORAGE_KEYS = {
  API_CONFIG: 'ai-chat:api-config',
  CHATS: 'ai-chat:chats',
  USER_PREFERENCES: 'ai-chat:preferences',
} as const

/**
 * Type for storage keys
 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/**
 * Safely gets an item from localStorage
 * @param key - Storage key
 * @returns Parsed value or null if not found/invalid
 */
export function getStorageItem<T>(key: StorageKey): T | null {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return null
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error reading from localStorage [${key}]:`, error)
    return null
  }
}

/**
 * Safely sets an item in localStorage
 * @param key - Storage key
 * @param value - Value to store
 * @returns Success status
 */
export function setStorageItem<T>(key: StorageKey, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error writing to localStorage [${key}]:`, error)
    return false
  }
}

/**
 * Removes an item from localStorage
 * @param key - Storage key
 */
export function removeStorageItem(key: StorageKey): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage [${key}]:`, error)
  }
}

/**
 * Clears all app-related items from localStorage
 */
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeStorageItem(key)
  })
}

/**
 * Gets the approximate size of stored data in bytes
 */
export function getStorageSize(): number {
  let totalSize = 0

  Object.values(STORAGE_KEYS).forEach(key => {
    const item = localStorage.getItem(key)
    if (item) {
      totalSize += item.length * 2 // UTF-16 encoding
    }
  })

  return totalSize
}

/**
 * Formats storage size for display
 * @param bytes - Size in bytes
 */
export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
