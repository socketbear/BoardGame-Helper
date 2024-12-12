export default function useUtils() {
  function getUniqueId(length = 16): string {
    return crypto.randomUUID().replace(/-/g, '').slice(0, length)
  }

  return { getUniqueId }
}
