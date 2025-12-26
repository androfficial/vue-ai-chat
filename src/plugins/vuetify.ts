/**
 * Vuetify plugin configuration
 * Modern, premium theme design for AI chat interfaces
 * Inspired by Claude, ChatGPT, and contemporary design systems
 */

import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import type { ThemeDefinition } from 'vuetify';

import { createVuetify } from 'vuetify';

/**
 * Light theme - Clean, airy, and professional
 * Uses subtle warm undertones for comfort during extended use
 */
const lightTheme: ThemeDefinition = {
  colors: {
    // Core backgrounds - subtle warm tint for reduced eye strain
    background: '#FAFAFA',
    'border-light': '#E5E7EB',
    'chat-assistant-bg': '#FAFAFA',
    'chat-user-bg': '#F3F4F6',
    // Semantic colors - softer, more balanced
    error: '#DC2626',
    info: '#2563EB',
    // Input and interactive surfaces
    'input-bg': '#FFFFFF',
    // Text colors - optimized contrast ratios
    'on-background': '#1F2937',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-surface': '#1F2937',
    // Primary - refined teal/emerald
    primary: '#0D9488',
    'primary-darken-1': '#0F766E',
    // Secondary - muted indigo
    secondary: '#6366F1',
    'secondary-darken-1': '#4F46E5',
    // Sidebar - clear hierarchy with subtle depth
    'sidebar-active': '#E5E7EB',
    'sidebar-bg': '#F9FAFB',
    'sidebar-hover': '#F3F4F6',
    success: '#059669',
    // Surfaces - layered system
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#F9FAFB',
    'surface-variant': '#F3F4F6',
    // Supporting colors
    'text-secondary': '#6B7280',
    warning: '#D97706',
  },
  dark: false,
  variables: {
    'activated-opacity': 0.1,
    'border-color': '#E5E7EB',
    'border-opacity': 1,
    'disabled-opacity': 0.38,
    'dragged-opacity': 0.08,
    'focus-opacity': 0.1,
    'high-emphasis-opacity': 0.87,
    'hover-opacity': 0.04,
    'idle-opacity': 0.04,
    'medium-emphasis-opacity': 0.6,
    'pressed-opacity': 0.1,
    'selected-opacity': 0.08,
  },
};

/**
 * Dark theme - Deep, sophisticated, and easy on the eyes
 * Uses true dark values with careful contrast management
 */
const darkTheme: ThemeDefinition = {
  colors: {
    // Core backgrounds - deep, neutral dark
    background: '#0F0F0F',
    'border-dark': '#2E2E2E',
    'chat-assistant-bg': '#0F0F0F',
    'chat-user-bg': '#1A1A1A',
    // Semantic colors - vibrant but not harsh
    error: '#F87171',
    info: '#60A5FA',
    // Input and interactive surfaces
    'input-bg': '#1A1A1A',
    // Text colors - reduced brightness for comfort
    'on-background': '#E5E5E5',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-surface': '#E5E5E5',
    // Primary - softer teal, less eye-catching
    primary: '#0D9488',
    'primary-darken-1': '#0F766E',
    // Secondary - soft violet
    secondary: '#A5B4FC',
    'secondary-darken-1': '#818CF8',
    // Sidebar - softer, less contrast with main area
    'sidebar-active': '#262626',
    'sidebar-bg': '#141414',
    'sidebar-hover': '#1F1F1F',
    success: '#34D399',
    // Surfaces - clear layer distinction
    surface: '#171717',
    'surface-bright': '#262626',
    'surface-light': '#1F1F1F',
    'surface-variant': '#2E2E2E',
    // Supporting colors
    'text-secondary': '#A3A3A3',
    warning: '#FBBF24',
  },
  dark: true,
  variables: {
    'activated-opacity': 0.12,
    'border-color': '#2E2E2E',
    'border-opacity': 1,
    'disabled-opacity': 0.38,
    'dragged-opacity': 0.08,
    'focus-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'hover-opacity': 0.08,
    'idle-opacity': 0.1,
    'medium-emphasis-opacity': 0.6,
    'pressed-opacity': 0.12,
    'selected-opacity': 0.12,
  },
};

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
});
