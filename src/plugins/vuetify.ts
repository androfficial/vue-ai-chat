/**
 * Vuetify plugin configuration
 * Custom themes inspired by ChatGPT but with original colors
 */

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import type { ThemeDefinition } from 'vuetify'

import { createVuetify } from 'vuetify'

/**
 * Custom light theme definition
 * Modern, clean design with improved contrast and consistency
 */
const lightTheme: ThemeDefinition = {
  colors: {
    // Core colors
    background: '#FFFFFF',
    'border-light': '#E2E8F0',
    'chat-assistant-bg': '#FFFFFF',
    // Custom colors for chat interface - improved contrast
    'chat-user-bg': '#F0F4F8',
    error: '#DC2626',
    info: '#2563EB',
    'input-bg': '#F5F7FA',
    'on-background': '#111827',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-surface': '#111827',
    primary: '#0D9668',
    'primary-darken-1': '#047857',
    secondary: '#4F46E5',
    'secondary-darken-1': '#4338CA',
    // Sidebar - improved visual hierarchy
    'sidebar-active': '#E0E7EF',
    'sidebar-bg': '#F8FAFC',

    'sidebar-hover': '#EEF2F6',
    success: '#16A34A',
    surface: '#F8FAFC',
    'surface-bright': '#FFFFFF',
    'surface-light': '#F1F5F9',
    'surface-variant': '#E2E8F0',
    // Additional UI colors
    'text-secondary': '#64748B',
    warning: '#D97706',
  },
  dark: false,
  variables: {
    'activated-opacity': 0.12,
    'border-color': '#CBD5E1',
    'border-opacity': 0.2,
    'disabled-opacity': 0.4,
    'dragged-opacity': 0.1,
    'focus-opacity': 0.12,
    'high-emphasis-opacity': 0.9,
    'hover-opacity': 0.06,
    'idle-opacity': 0.06,
    'medium-emphasis-opacity': 0.65,
    'pressed-opacity': 0.14,
    'selected-opacity': 0.1,
  },
}

/**
 * Custom dark theme definition
 * Modern dark mode with improved readability and visual hierarchy
 */
const darkTheme: ThemeDefinition = {
  colors: {
    // Core colors - VSCode inspired
    background: '#1A1A1A',
    'border-dark': '#3D3D3D',
    'chat-assistant-bg': '#1A1A1A',
    // Custom colors for chat interface - better contrast
    'chat-user-bg': '#262626',
    error: '#EF4444',
    info: '#3B82F6',
    'input-bg': '#262626',
    'on-background': '#E5E5E5',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-surface': '#E5E5E5',
    primary: '#10B981',
    'primary-darken-1': '#059669',
    secondary: '#818CF8',
    'secondary-darken-1': '#6366F1',
    // Sidebar - cleaner separation
    'sidebar-active': '#333333',
    'sidebar-bg': '#141414',

    'sidebar-hover': '#252525',
    success: '#22C55E',
    surface: '#262626',
    'surface-bright': '#333333',
    'surface-light': '#2D2D2D',
    'surface-variant': '#3D3D3D',
    // Additional UI colors
    'text-secondary': '#A3A3A3',
    warning: '#F59E0B',
  },
  dark: true,
  variables: {
    'activated-opacity': 0.15,
    'border-color': '#404040',
    'border-opacity': 0.15,
    'disabled-opacity': 0.4,
    'dragged-opacity': 0.1,
    'focus-opacity': 0.15,
    'high-emphasis-opacity': 0.9,
    'hover-opacity': 0.1,
    'idle-opacity': 0.12,
    'medium-emphasis-opacity': 0.65,
    'pressed-opacity': 0.15,
    'selected-opacity': 0.12,
  },
}

/**
 * Create and export Vuetify instance
 */
export default createVuetify({
  // Global component defaults
  defaults: {
    VBtn: {
      rounded: 'lg',
      variant: 'flat',
    },
    VCard: {
      elevation: 0,
      rounded: 'lg',
    },
    VList: {
      density: 'comfortable',
    },
    VListItem: {
      rounded: 'lg',
    },
    VNavigationDrawer: {
      elevation: 0,
    },
    VTextarea: {
      variant: 'outlined',
    },
    VTextField: {
      variant: 'outlined',
    },
  },

  // Icon configuration
  icons: {
    defaultSet: 'mdi',
  },

  // Theme configuration
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: darkTheme,
      light: lightTheme,
    },
    variations: {
      colors: ['primary', 'secondary', 'error', 'info', 'success', 'warning'],
      darken: 2,
      lighten: 2,
    },
  },
})
