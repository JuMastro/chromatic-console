/**
 * Check if arg is plain object.
 * @param {any} arg
 * @returns {boolean}
 */
function isPlainObject (arg) {
  return typeof arg === 'object' && !Array.isArray(arg) && arg !== null
}

/**
 * Check and prepare options object.
 * @param {object} options - The options object.
 * @param {object} reference - The reference options object.
 */
function prepareOptions (options, reference) {
  if (!isPlainObject(options)) {
    throw new TypeError('The "options" argument must be a plain object.')
  }

  return { ...reference, ...options }
}

module.exports = {
  isPlainObject,
  prepareOptions
}
