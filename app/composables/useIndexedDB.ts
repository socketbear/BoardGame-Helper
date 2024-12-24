export function useIndexedDB(dbName: string, version = 1) {
  const db = ref<IDBDatabase | null>(null)

  function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        db.value = request.result
        resolve(request.result)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('boardGameData')) {
          db.createObjectStore('boardGameData', { keyPath: 'id' })
        }
      }
    })
  }

  async function getValue(storeName: string, key: string): Promise<any> {
    if (!db.value)
      await openDB()

    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async function setValue(storeName: string, key: string, value: any): Promise<void> {
    if (!db.value)
      await openDB()

    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put({ id: key, value })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  return {
    openDB,
    getValue,
    setValue,
  }
}
