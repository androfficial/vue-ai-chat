/**
 * Auto-scroll composable
 * Automatically scrolls to bottom when new content is added
 *
 * @example
 * const { containerRef, isAtBottom, scrollToBottom } = useAutoScroll()
 */

import type { Ref } from 'vue'

import { nextTick, onMounted, ref, watch } from 'vue'

export interface UseAutoScrollOptions {
  /** Enable smooth scroll behavior (default: true) */
  smooth?: boolean
  /** Threshold in pixels to consider "at bottom" (default: 100) */
  threshold?: number
}

export interface UseAutoScrollReturn {
  /** Ref to bind to scroll container */
  containerRef: Ref<HTMLElement | undefined>
  /** Handles scroll event - bind to @scroll */
  handleScroll: () => void
  /** Whether user is at bottom of scroll */
  isAtBottom: Ref<boolean>
  /** Scrolls container to bottom */
  scrollToBottom: () => void
}

/**
 * Creates auto-scroll behavior for a container
 * @param options - Configuration options
 */
export function useAutoScroll(options: UseAutoScrollOptions = {}): UseAutoScrollReturn {
  const { smooth: _smooth = true, threshold = 100 } = options

  const containerRef = ref<HTMLElement>()
  const isAtBottom = ref(true)

  function handleScroll() {
    if (!containerRef.value) return

    const { clientHeight, scrollHeight, scrollTop } = containerRef.value
    // Consider "at bottom" if within threshold of the bottom
    isAtBottom.value = scrollHeight - scrollTop - clientHeight < threshold
  }

  function scrollToBottom() {
    if (containerRef.value) {
      // Use double requestAnimationFrame to ensure DOM is fully updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (containerRef.value) {
            containerRef.value.scrollTop = containerRef.value.scrollHeight
            // Update isAtBottom after scrolling
            isAtBottom.value = true
          }
        })
      })
    }
  }

  // Scroll to bottom on mount
  onMounted(() => {
    scrollToBottom()
  })

  return {
    containerRef,
    handleScroll,
    isAtBottom,
    scrollToBottom,
  }
}

/**
 * Watches a dependency and auto-scrolls when it changes
 * @param dependency - Reactive dependency to watch
 * @param isAtBottom - Whether user is currently at bottom
 * @param scrollToBottom - Function to scroll to bottom
 */
export function useAutoScrollOnChange<T>(
  dependency: Ref<T> | (() => T),
  isAtBottom: Ref<boolean>,
  scrollToBottom: () => void,
): void {
  watch(dependency, async () => {
    if (isAtBottom.value) {
      await nextTick()
      scrollToBottom()
    }
  })
}
