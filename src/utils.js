/**
 * Check if arg is plain object.
 * @param {any} arg
 * @returns {boolean}
 */
function isPlainObject (arg) {
  return typeof arg === 'object' && !Array.isArray(arg) && arg !== null
}

module.exports = {
  isPlainObject
}
