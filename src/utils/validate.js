export function isIP (string) {
  return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(string)
}

export function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

export function isNumber (num) {
  return typeof num === 'number' && !Number.isNaN(num)
}
