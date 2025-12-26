/**
 * Typed injection keys for provide/inject pattern
 * Using Symbol-based InjectionKey for type safety
 * @see https://vuejs.org/guide/typescript/composition-api.html#typing-provide-inject
 */

import type { InjectionKey } from 'vue'

/**
 * Injection key for toggling the sidebar drawer
 */
export const TOGGLE_SIDEBAR_KEY: InjectionKey<() => void> = Symbol('toggleSidebar')

/**
 * Injection key for checking if the viewport is mobile
 */
export const IS_MOBILE_KEY: InjectionKey<() => boolean> = Symbol('isMobile')
