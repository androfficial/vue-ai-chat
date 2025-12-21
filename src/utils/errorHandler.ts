/**
 * Global error handling utilities
 * Catches unhandled errors to prevent app crashes
 */

import type { App, ComponentPublicInstance } from 'vue'

/**
 * i18n instance interface (minimal for error handler)
 */
interface I18nLike {
  global: {
    t: (key: string) => string
  }
}

/**
 * Error handler configuration options
 */
interface ErrorHandlerOptions {
  /** Vue i18n instance for localized error messages */
  i18n: I18nLike
  /** Whether to log errors to console (default: true in development) */
  logToConsole?: boolean
  /** Custom error reporting callback (e.g., for Sentry, LogRocket) */
  onError?: (error: unknown, context?: string) => void
}

/**
 * Show a global error toast notification
 * Uses vanilla JS to ensure it works even when Vue/Vuetify fails
 */
function showGlobalErrorToast(message: string): void {
  // Remove existing snackbar if present
  const existingSnackbar = document.getElementById('global-error-snackbar')
  if (existingSnackbar) {
    existingSnackbar.remove()
  }

  const snackbar = document.createElement('div')
  snackbar.id = 'global-error-snackbar'
  snackbar.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #d32f2f;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 9999;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    max-width: 90vw;
    text-align: center;
  `
  snackbar.textContent = message

  // Add close button
  const closeBtn = document.createElement('button')
  closeBtn.textContent = '×'
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    margin-left: 12px;
    cursor: pointer;
    padding: 0 4px;
    vertical-align: middle;
  `
  closeBtn.onclick = () => snackbar.remove()
  snackbar.appendChild(closeBtn)

  document.body.appendChild(snackbar)

  // Auto-remove after 5 seconds
  setTimeout(() => snackbar.remove(), 5000)
}

/**
 * Setup global error handlers for Vue app
 * Should be called before app.mount()
 */
export function setupGlobalErrorHandler(app: App, options: ErrorHandlerOptions): void {
  const { i18n, logToConsole = import.meta.env.DEV, onError } = options

  const getErrorMessage = () => i18n.global.t('errors.globalError')

  /**
   * Vue error handler
   * Catches errors from: component renders, watchers, lifecycle hooks,
   * component event handlers, and setup() function
   */
  app.config.errorHandler = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string,
  ) => {
    if (logToConsole) {
      console.error('[Vue Error]', err)
      console.error('Component:', instance?.$options?.name || 'Anonymous')
      console.error('Info:', info)
    }

    onError?.(err, `Vue: ${info}`)
    showGlobalErrorToast(getErrorMessage())
  }

  /**
   * Vue warning handler (development only)
   */
  if (import.meta.env.DEV) {
    app.config.warnHandler = (msg: string, instance: ComponentPublicInstance | null) => {
      console.warn('[Vue Warning]', msg)
      if (instance) {
        console.warn('Component:', instance.$options?.name || 'Anonymous')
      }
    }
  }
}

/**
 * Setup global window error handlers
 * Catches unhandled promise rejections and global JS errors
 */
export function setupWindowErrorHandlers(options: ErrorHandlerOptions): void {
  const { i18n, logToConsole = import.meta.env.DEV, onError } = options

  const getErrorMessage = () => i18n.global.t('errors.globalError')

  /**
   * Unhandled promise rejection handler
   */
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    if (logToConsole) {
      console.error('[Unhandled Promise Rejection]', event.reason)
    }

    // Prevent default browser behavior
    event.preventDefault()

    onError?.(event.reason, 'Promise Rejection')
    showGlobalErrorToast(getErrorMessage())
  })

  /**
   * Global error handler for uncaught exceptions
   */
  window.addEventListener('error', (event: ErrorEvent) => {
    // Ignore ResizeObserver errors (common and usually harmless)
    if (event.message?.includes('ResizeObserver')) {
      return
    }

    if (logToConsole) {
      console.error('[Global Error]', event.error || event.message)
    }

    onError?.(event.error, 'Global Error')
    showGlobalErrorToast(getErrorMessage())
  })
}
