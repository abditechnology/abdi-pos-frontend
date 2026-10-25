import { ref } from 'vue'

const toasts = ref([])
let toastCounter = 0

/**
 * Composable for triggering reactive toast alerts across the application.
 */
export function useToast() {
  const show = ({
    title = '',
    message = '',
    type = 'info',
    duration = 4000
  }) => {
    const id = ++toastCounter
    const toast = {
      id,
      title,
      message,
      type,
      duration,
      createdAt: Date.now()
    }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const success = (message, title = 'Berhasil') => {
    return show({ title, message, type: 'success' })
  }

  const error = (message, title = 'Terjadi Kesalahan') => {
    return show({ title, message, type: 'error', duration: 5000 })
  }

  const warning = (message, title = 'Perhatian') => {
    return show({ title, message, type: 'warning' })
  }

  const info = (message, title = 'Informasi') => {
    return show({ title, message, type: 'info' })
  }

  const remove = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    toasts.value = []
  }

  return {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    remove,
    clearAll
  }
}
