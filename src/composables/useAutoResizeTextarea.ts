import type { Ref } from 'vue'

import { nextTick, onMounted, watch } from 'vue'

export interface UseAutoResizeTextareaOptions {
  maxHeight?: number
  minHeight?: number
}

export interface UseAutoResizeTextareaReturn {
  resetHeight: () => void
  textareaRef: Ref<HTMLTextAreaElement | undefined>
}

export function useAutoResizeTextarea(
  content: Ref<string>,
  textareaRef: Ref<HTMLTextAreaElement | undefined>,
  wrapperRef: Ref<HTMLDivElement | undefined>,
  options: UseAutoResizeTextareaOptions = {},
): UseAutoResizeTextareaReturn {
  const { maxHeight = 200, minHeight = 40 } = options

  onMounted(() => {
    nextTick(() => {
      resize(false)
    })
  })

  watch(content, () => {
    resize(true)
  })

  function resize(animate = true) {
    if (!textareaRef.value || !wrapperRef.value) return

    const textarea = textareaRef.value
    const wrapper = wrapperRef.value

    const currentHeight = wrapper.offsetHeight

    textarea.style.height = 'auto'

    const scrollHeight = textarea.scrollHeight
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)

    textarea.style.height = `${newHeight}px`

    if (animate && currentHeight !== newHeight) {
      wrapper.style.transition = 'none'
      wrapper.style.height = `${currentHeight}px`

      void wrapper.offsetHeight

      wrapper.style.transition = 'height 0.12s ease-out'
      wrapper.style.height = `${newHeight}px`
    } else {
      wrapper.style.transition = 'none'
      wrapper.style.height = `${newHeight}px`
    }

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
