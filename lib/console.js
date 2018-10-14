'use strict'

const common = require('./common.js')

let initial = {}
let created = {}

class Console {
  /**
   * Class contructor.
   * @param {object} [options={}] - Console options.
   * @param {object} styles - Style object.
   */
  constructor (options = {}, styles) {
    return this._init(options, styles)
  }

  /**
   * Init console part, to load log's functions.
   * @param {object} options - Console options.
   * @param {object} styles - Styles object.
   * @returns {object}
   */
  _init (options, styles) {
    this.styles = styles
    options = common.mergeObject(this._getDefaultOptions(), options)
    created = this._getNewConsole(options.details)

    if (options.seed) {
      this._seedConsole(created)
    }

    return options.external ? created : {}
  }

  /**
   * Get default console options.
   * @returns {object} Console options
   */
  _getDefaultOptions () {
    return {
      seed: true,
      external: true,
      details: {
        log: null,
        info: 'cyan',
        warn: 'yellow',
        error: 'red'
      }
    }
  }

  /**
   * Create new console function from initial console methods.
   * @param {object} details - Options details for log's colors.
   * @returns {object}
   */
  _getNewConsole (details) {
    let newConsole = {}

    const colors = typeof this.styles.colors !== 'undefined'
      ? this.styles.colors
      : this.styles

    for (let type in details) {
      if (details[type]) {
        initial[type] = console[type].bind(console)

        newConsole[type] = function () {
          const msg = colors[details[type]](...arguments)

          if (Array.isArray(msg)) {
            initial[type](...msg)
          } else {
            initial[type](msg)
          }
        }
      }
    }

    return newConsole
  }

  /**
   * Seed initial `console` with new methods.
   * @param {object} list - List of methods to overide.
   * @returns {void}
   */
  _seedConsole (list) {
    for (let item in list) {
      console[item] = function () {
        list[item](...arguments)
      }
    }
  }
}

module.exports = (options, styles) => new Console(options, styles)
