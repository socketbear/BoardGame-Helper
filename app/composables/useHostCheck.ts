import { computed } from 'vue'

export function useHostCheck() {
  const isLocalhost = computed(() => {
    if (typeof window === 'undefined')
      return false
    return window.location.hostname === 'localhost'
  })

  return {
    isLocalhost,
  }
}
