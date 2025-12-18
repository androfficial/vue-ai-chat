import type { SupportedLocale } from './theme'

/**
 * User preferences and settings
 */
export interface UserPreferences {
  /** Font size preference */
  fontSize: 'small' | 'medium' | 'large'
  /** Current language/locale */
  locale: SupportedLocale
  /** Whether to enable markdown rendering */
  markdownEnabled: boolean
  /** Whether to send message on Enter key */
  sendOnEnter: boolean
  /** Whether to show code line numbers */
  showLineNumbers: boolean
  /** Whether to show timestamps on messages */
  showTimestamps: boolean
  /** Whether to enable sound notifications */
  soundEnabled: boolean
  /** Current theme mode */
  theme: 'light' | 'dark' | 'system'
}

/**
 * Default user preferences
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  fontSize: 'medium',
  locale: 'en',
  markdownEnabled: true,
  sendOnEnter: true,
  showLineNumbers: true,
  showTimestamps: false,
  soundEnabled: false,
  theme: 'dark',
}

/**
 * User session information
 */
export interface UserSession {
  /** Current active chat ID */
  activeChatId: string | null
  /** Timestamp of last activity */
  lastActivity: number
  /** User preferences */
  preferences: UserPreferences
}
