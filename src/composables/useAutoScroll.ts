import type { Ref } from 'vue'

import { nextTick, onMounted, ref, watch } from 'vue'

export interface UseAutoScrollOptions {
  smooth?: boolean
  threshold?: number
}

export interface UseAutoScrollReturn {
  containerRef: Ref<HTMLElement | undefined>
  handleScroll: () => void
  isAtBottom: Ref<boolean>
  scrollToBottom: () => void
}

export function useAutoScroll(options: UseAutoScrollOptions = {}): UseAutoScrollReturn {
  const { smooth: _smooth = true, threshold = 100 } = options

  const containerRef = ref<HTMLElement>()
  const isAtBottom = ref(true)

  function handleScroll() {
    if (!containerRef.value) return

    const { clientHeight, scrollHeight, scrollTop } = containerRef.value
    isAtBottom.value = scrollHeight - scrollTop - clientHeight < threshold
  }

  function scrollToBottom() {
    if (containerRef.value) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (containerRef.value) {
            containerRef.value.scrollTop = containerRef.value.scrollHeight
            isAtBottom.value = true
          }
        })
      })
    }
  }

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
