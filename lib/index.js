'use strict'

const styles = require('./styles.js')
const appConsole = require('./console.js')

let instance = null

class Chromatic {
  /**
   * Class constructor.
   * @param {object} options - Lib options.
   */
  constructor (options = {}) {
    if (instance && !options.reload) {
      return instance
    }

    const stylesMethods = styles(options.styles)
    const consoleMethods = appConsole(options.console, stylesMethods)
    const methods = Object.assign(consoleMethods, stylesMethods)

    for (let method in methods) {
      this[method] = methods[method]
    }

    instance = this
  }
}

module.exports = (options) => new Chromatic(options)
