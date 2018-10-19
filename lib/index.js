const Restyles = require('./restyles.js')
const Reconsole = require('./reconsole.js')

let chromaticInstance = null

const _init = Symbol('init')

/**
 * Class Chromatic
 * This class is lib wrapper, it's used to retrieve styles and work with the console.
 */
class Chromatic {
  /**
   * Class contructor.
   * @param {object} [options={}] - Lib options.
   */
  constructor (options = {}) {
    chromaticInstance = this

    const stylesMethods = Restyles(options.styles)
    const consoleMethods = Reconsole(options.console, stylesMethods)
    const methods = Object.assign(consoleMethods, stylesMethods)

    for (let method in methods) {
      this[method] = methods[method]
    }
  }

  /**
   * Static private method used to get Chromatic instance.
   * @param {object} [options={}] - Lib options.
   * @returns {Chromatic}
   */
  static [_init] (options = {}) {
    return chromaticInstance instanceof Chromatic && !options.reload
      ? chromaticInstance
      : new Chromatic(options)
  }
}

module.exports = (options) => Chromatic[_init](options)
