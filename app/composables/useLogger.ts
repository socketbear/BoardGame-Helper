import { useHostCheck } from '~/composables/useHostCheck'

export function useLogger() {
  const { isLocalhost } = useHostCheck()

  function info(...args: unknown[]) {
    if (!isLocalhost.value)
      return

    /* eslint-disable no-console */
    console.log('%c[dev]', 'color: blue; font-weight: bold;', ...args)
  }

  return {
    info,
  }
}
