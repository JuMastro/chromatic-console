const { mergeObject } = require('./common.js')

/**
 * Class Reconsole
 * The class will build new console log methods from the initial console.
 * It also can seed the initial console with created console methods.
 */
class Reconsole {
  constructor () {
    this.styles = {}
    this.initial = {}
    this.created = {}
  }

  /**
   * Init console part, to load log's functions.
   * @param {object} [options={}] - Console options.
   * @param {object} [styles={}] - Styles object.
   * @returns {object}
   */
  init (options = {}, styles) {
    options = mergeObject(this._getDefaultOptions(), options)
    this.styles = styles
    this.created = this._getNewConsole(options.details)

    if (options.seed) {
      this._seedConsole(this.created)
    }

    return options.external ? this.created : {}
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
    const self = this

    const colors = typeof this.styles.colors !== 'undefined'
      ? this.styles.colors
      : this.styles

    let rewritedConsole = {}

    for (let type in details) {
      if (details[type]) {
        this.initial[type] = console[type].bind(console)

        rewritedConsole[type] = function () {
          const msg = colors[details[type]](...arguments)

          if (Array.isArray(msg)) {
            self.initial[type](...msg)
          } else {
            self.initial[type](msg)
          }
        }
      }
    }

    return rewritedConsole
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

const reconsole = new Reconsole()

module.exports = (options, styles) => reconsole.init(options, styles)
