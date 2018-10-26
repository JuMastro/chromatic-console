const common = {}

/**
 * Check if value is an object.
 * This is not really an object type check, it's not accept Array as object.
 * @param {any} value - Presumed object.
 * @return {boolean}
 */
common.isObject = (value) => {
  return typeof value === 'object' && !Array.isArray(value)
}

/**
 * Pseudo merge two object.
 * Warning: Not deep merging for Arrays.
 * In the case where the reference is type object and the assignable is equal to true,
 * then the merge will not be done,
 * this in order to be able to preserve the values contained in the properties of the object.
 * @param {object} reference - Reference object.
 * @param {object} assignable - Assignable object.
 * @returns {object} Merged object.
 */
common.mergeObject = (reference, assignable) => {
  for (const ref in reference) {
    if (assignable.hasOwnProperty(ref)) {
      if (common.isObject(reference[ref]) && common.isObject(assignable[ref])) {
        reference[ref] = common.mergeObject(reference[ref], assignable[ref])
      } else if (Array.isArray(reference[ref]) && Array.isArray(assignable[ref])) {
        assignable[ref].forEach((item) => {
          if (!reference[ref].includes(item)) {
            reference[ref].push(item)
          }
        })
      } else if (typeof reference[ref] !== 'object' || assignable[ref] !== true) {
        reference[ref] = assignable[ref]
      }
    }
  }

  return reference
}

/**
 * Order object properties (return copy).
 * @param {object} obj - Object needed to be ordered.
 * @returns {object} Ordered copy.
 */
common.orderObject = (obj) => {
  const ordered = {}

  Object.keys(obj).sort().forEach((key) => {
    ordered[key] = obj[key]
  })

  return ordered
}

/**
 * Copy object.
 * Warning: Get references for Arrays.
 * @param {object} obj - Object needed to be copy.
 * @returns {object} Copy of object parameter.
 */
common.copyObject = (obj) => {
  const clone = {}

  for (const prop in obj) {
    if (common.isObject(obj[prop])) {
      clone[prop] = common.copyObject(obj[prop])
    } else {
      clone[prop] = obj[prop]
    }
  }

  return clone
}

/**
 * Check if array contains an other type than string.
 * @param {Array} array - Array needed to be check.
 * @returns {boolean}
 */
common.isArrayOfStrings = (array) => {
  for (const cell of array) {
    if (typeof cell !== 'string') {
      return false
    }
  }

  return true
}

/**
 * Concatenate consecutive strings in a array.
 * @param {Array} array - Array needed to group strings.
 * @returns {Array}
 */
common.groupStringsOfArray = (array) => {
  return array.map((item, index) => {
    if (typeof item === 'string') {
      while (typeof array[index + 1] === 'string') {
        item += array.splice(index + 1, 1)
      }
    }
    return item
  })
}

/**
 * To capitalize string.
 * @param {string} str - The string needed to be capitalized.
 * @returns {string} Capitalized string
 */
common.capitalize = (str = '') => {
  return `${str.charAt(0).toUpperCase()}${str.slice(1, str.length)}`
}

module.exports = common
