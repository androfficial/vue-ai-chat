import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    // Reset toast state
    const { hide } = useToast()
    hide()
  })

  it('should show toast with string message', async () => {
    const { isVisible, message, show, type } = useToast()

    show('Hello World')

    // Initially hidden, then visible after timeout
    expect(isVisible.value).toBe(false)

    vi.advanceTimersByTime(50)
    expect(isVisible.value).toBe(true)
    expect(message.value).toBe('Hello World')
    expect(type.value).toBe('success')
  })

  it('should show toast with options object', async () => {
    const { isVisible, message, show, timeout, type } = useToast()

    show({
      message: 'Error occurred',
      timeout: 5000,
      type: 'error',
    })

    vi.advanceTimersByTime(50)

    expect(isVisible.value).toBe(true)
    expect(message.value).toBe('Error occurred')
    expect(type.value).toBe('error')
    expect(timeout.value).toBe(5000)
  })

  it('should hide toast', () => {
    const { hide, isVisible, show } = useToast()

    show('Test')
    vi.advanceTimersByTime(50)
    expect(isVisible.value).toBe(true)

    hide()
    expect(isVisible.value).toBe(false)
  })

  it('should show success toast', () => {
    const { message, success, type } = useToast()

    success('Operation successful')

    vi.advanceTimersByTime(50)
    expect(message.value).toBe('Operation successful')
    expect(type.value).toBe('success')
  })

  it('should show error toast', () => {
    const { error, message, timeout, type } = useToast()

    error('Something went wrong')

    vi.advanceTimersByTime(50)
    expect(message.value).toBe('Something went wrong')
    expect(type.value).toBe('error')
    expect(timeout.value).toBe(3000) // Error has longer timeout
  })

  it('should show info toast', () => {
    const { info, message, type } = useToast()

    info('FYI message')

    vi.advanceTimersByTime(50)
    expect(message.value).toBe('FYI message')
    expect(type.value).toBe('info')
  })

  it('should use default values for partial options', () => {
    const { show, timeout, type } = useToast()

    show({ message: 'Test' })

    vi.advanceTimersByTime(50)
    expect(type.value).toBe('success')
    expect(timeout.value).toBe(2000)
  })

  it('should share state between multiple useToast calls', () => {
    const toast1 = useToast()
    const toast2 = useToast()

    toast1.show('Shared message')
    vi.advanceTimersByTime(50)

    expect(toast2.message.value).toBe('Shared message')
    expect(toast2.isVisible.value).toBe(true)
  })
})
