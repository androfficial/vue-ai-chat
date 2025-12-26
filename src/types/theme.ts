/**
 * Supported theme modes
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Supported locales/languages
 */
export type SupportedLocale = 'en' | 'uk';

/**
 * Theme color palette
 */
export interface ThemeColors {
  /** Background color */
  background: string;
  /** Error color */
  error: string;
  /** Info color */
  info: string;
  /** Primary brand color */
  primary: string;
  /** Secondary accent color */
  secondary: string;
  /** Success color */
  success: string;
  /** Surface/card background color */
  surface: string;
  /** Primary text color */
  textPrimary: string;
  /** Secondary text color */
  textSecondary: string;
  /** Warning color */
  warning: string;
}

/**
 * Light theme colors (ChatGPT-inspired but original)
 */
export const LIGHT_THEME_COLORS: ThemeColors = {
  background: '#FFFFFF',
  error: '#EF4444',
  info: '#3B82F6',
  primary: '#10A37F',
  secondary: '#6366F1',
  success: '#22C55E',
  surface: '#F7F7F8',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  warning: '#F59E0B',
};

/**
 * Dark theme colors (ChatGPT-inspired but original)
 */
export const DARK_THEME_COLORS: ThemeColors = {
  background: '#212121',
  error: '#F87171',
  info: '#60A5FA',
  primary: '#10A37F',
  secondary: '#818CF8',
  success: '#4ADE80',
  surface: '#2F2F2F',
  textPrimary: '#ECECEC',
  textSecondary: '#9CA3AF',
  warning: '#FBBF24',
};

/**
 * Sidebar colors
 */
export interface SidebarColors {
  /** Sidebar item active/selected background */
  activeBackground: string;
  /** Sidebar background */
  background: string;
  /** Sidebar item hover background */
  hoverBackground: string;
  /** Sidebar icon color */
  icon: string;
  /** Sidebar text color */
  text: string;
}

/**
 * Light theme sidebar colors
 */
export const LIGHT_SIDEBAR_COLORS: SidebarColors = {
  activeBackground: '#ECECEC',
  background: '#F9F9F9',
  hoverBackground: '#F0F0F0',
  icon: '#6B7280',
  text: '#1A1A1A',
};

/**
 * Dark theme sidebar colors
 */
export const DARK_SIDEBAR_COLORS: SidebarColors = {
  activeBackground: '#3A3A3A',
  background: '#171717',
  hoverBackground: '#2A2A2A',
  icon: '#9CA3AF',
  text: '#ECECEC',
};
