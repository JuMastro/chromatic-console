let common = {}

/**
 * Check if value is an object.
 * This is not really an object type check, if an array is passed then the function will return false.
 * @param {any} value - Presumed object.
 * @return {boolean}
 */
common.isObject = function (value) {
  return typeof value === 'object' && !Array.isArray(value)
}

/**
 * Merge two object and take as `reference` parameter as base.
 * Warning: Not deep merging for Arrays.
 * In the case where the reference is of type object and that the assignable is equal to true,
 * then the merge will not be done,
 * this in order to be able to preserve the values contained in the properties of the object.
 * @param {object} reference - Reference object.
 * @param {object} assignable - Assignable object.
 * @returns {object} Merged object.

 */
common.mergeObject = function (reference, assignable) {
  for (let ref in reference) {
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
 * To order object properties (return copy).
 * @param {object} obj - Object needed to be ordered.
 * @returns {object} Ordered copy.
 */
common.orderObject = function (obj) {
  let ordered = {}

  Object.keys(obj).sort().forEach((key) => {
    ordered[key] = obj[key]
  })

  return ordered
}

/**
 * To copy a simple object.
 * Warning: Get references for Arrays.
 * @param {object} obj - Object needed to be copy.
 * @returns {object} Copy of object parameter.
 */
common.copyObject = function (obj) {
  let clone = {}

  for (let prop in obj) {
    if (common.isObject(obj[prop])) {
      clone[prop] = common.copyObject(obj[prop])
    } else {
      clone[prop] = obj[prop]
    }
  }

  return clone
}

/**
 * To check if array contains an other type than string.
 * @param {Array} array - Array needed to be check.
 * @returns {boolean}
 */
common.isArrayOfStrings = function (array) {
  for (let cell of array) {
    if (typeof cell !== 'string') {
      return false
    }
  }

  return true
}

/**
 * To concatenate consecutive strings in a array.
 * @param {Array} array - Array needed to group strings.
 * @returns {Array}
 */
common.groupStringsOfArray = function (array) {
  for (let i = 0; i < array.length; ++i) {
    if (typeof array[i] === 'string') {
      while (typeof array[i + 1] === 'string') {
        array[i] += array.splice(i + 1, 1)
      }
    }
  }

  return array
}

/**
 * To capitalize string.
 * @param {string} str - The string needed to be capitalized.
 * @returns {string} Capitalized string
 */
common.capitalize = function (str = '') {
  return `${str.charAt(0).toUpperCase()}${str.slice(1, str.length)}`
}

module.exports = common
