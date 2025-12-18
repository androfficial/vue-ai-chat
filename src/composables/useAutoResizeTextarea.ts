/**
 * Auto-resize textarea composable
 * Automatically adjusts textarea height based on content with smooth animation
 * Uses a wrapper element for animation to prevent text from moving
 *
 * @example
 * const { resetHeight } = useAutoResizeTextarea(message, textareaRef, wrapperRef, { maxHeight: 200 })
 */

import type { Ref } from 'vue'

import { nextTick, onMounted, watch } from 'vue'

export interface UseAutoResizeTextareaOptions {
  /** Maximum height in pixels (default: 200) */
  maxHeight?: number
  /** Minimum height in pixels (default: 40) */
  minHeight?: number
}

export interface UseAutoResizeTextareaReturn {
  /** Resets textarea height to auto/minimum */
  resetHeight: () => void
  /** Ref to bind to textarea element */
  textareaRef: Ref<HTMLTextAreaElement | undefined>
}

/**
 * Creates an auto-resizing textarea behavior with smooth animation on wrapper
 * @param content - Reactive ref of textarea content
 * @param textareaRef - Ref to textarea element
 * @param wrapperRef - Ref to wrapper element for animation
 * @param options - Configuration options
 */
export function useAutoResizeTextarea(
  content: Ref<string>,
  textareaRef: Ref<HTMLTextAreaElement | undefined>,
  wrapperRef: Ref<HTMLDivElement | undefined>,
  options: UseAutoResizeTextareaOptions = {},
): UseAutoResizeTextareaReturn {
  const { maxHeight = 200, minHeight = 40 } = options

  // Set initial height on mount
  onMounted(() => {
    nextTick(() => {
      resize(false)
    })
  })

  // Resize on content change
  watch(content, () => {
    resize(true)
  })

  function resize(animate = true) {
    if (!textareaRef.value || !wrapperRef.value) return

    const textarea = textareaRef.value
    const wrapper = wrapperRef.value

    // Store current wrapper height before measurement
    const currentHeight = wrapper.offsetHeight

    // Set textarea height to auto to get accurate scrollHeight
    textarea.style.height = 'auto'

    // Measure content height
    const scrollHeight = textarea.scrollHeight
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)

    // Set textarea to full height (no animation on textarea itself)
    textarea.style.height = `${newHeight}px`

    // Animate wrapper height
    if (animate && currentHeight !== newHeight) {
      wrapper.style.transition = 'none'
      wrapper.style.height = `${currentHeight}px`

      // Force reflow
      void wrapper.offsetHeight

      wrapper.style.transition = 'height 0.12s ease-out'
      wrapper.style.height = `${newHeight}px`
    } else {
      wrapper.style.transition = 'none'
      wrapper.style.height = `${newHeight}px`
    }

    // Set overflow based on content
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden'
  }

  function resetHeight() {
    nextTick(() => {
      if (textareaRef.value && wrapperRef.value) {
        textareaRef.value.style.height = `${minHeight}px`
        textareaRef.value.style.overflowY = 'hidden'
        wrapperRef.value.style.transition = 'height 0.15s ease-out'
        wrapperRef.value.style.height = `${minHeight}px`
      }
    })
  }

  return {
    resetHeight,
    textareaRef,
  }
}
