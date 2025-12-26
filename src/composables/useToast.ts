import { ref } from 'vue';

export interface ToastOptions {
  message: string;
  timeout?: number;
  type?: 'success' | 'error' | 'info' | 'warning';
}

// Global state for toast
const isVisible = ref(false);
const message = ref('');
const type = ref<'success' | 'error' | 'info' | 'warning'>('success');
const timeout = ref(2000);

export function useToast() {
  function show(options: ToastOptions | string) {
    if (typeof options === 'string') {
      message.value = options;
      type.value = 'success';
      timeout.value = 2000;
    } else {
      message.value = options.message;
      type.value = options.type ?? 'success';
      timeout.value = options.timeout ?? 2000;
    }

    isVisible.value = false;
    setTimeout(() => {
      isVisible.value = true;
    }, 50);
  }

  function hide() {
    isVisible.value = false;
  }

  function success(msg: string) {
    show({ message: msg, timeout: 2000, type: 'success' });
  }

  function error(msg: string) {
    show({ message: msg, timeout: 3000, type: 'error' });
  }

  function info(msg: string) {
    show({ message: msg, timeout: 2000, type: 'info' });
  }

  return {
    error,
    hide,
    info,
    isVisible,
    message,
    show,
    success,
    timeout,
    type,
  };
}

export type UseToastReturn = ReturnType<typeof useToast>;
