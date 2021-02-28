export function getLocalStorage (key) {
  try {
    const value = localStorage.getItem(key)

    return JSON.parse(value)
  } catch {
    return null
  }
}

export function setLocalStorage (key, value) {
  try {
    const storeString = JSON.stringify(value)

    localStorage.setItem(key, storeString)
  } catch {} // eslint-disable-line no-empty
}

export const LOCAL_STORAGE_KEY = {
  API_SETTINGS: 'API_SETTINGS'
}
