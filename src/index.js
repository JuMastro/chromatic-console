const Stylizer = require('./stylizer.js')
const Consolizer = require('./consolizer.js')
const { prepareOptions } = require('./utils.js')

module.exports = exports = class Chromatic {
  /**
   * @param {object} options - Chromatic options object
   */
  constructor (options = {}) {
    const opts = prepareOptions(options, { adds: {} })
    const stylizer = opts.stylizer || new Stylizer({ adds: opts.adds })

    Object.defineProperties(this, {
      _consolizer: { value: new Consolizer({ ...opts, stylizer }) },
      _styliser: { value: stylizer }
    })

    Object.assign(
      this,
      this._consolizer.buildLogsMethods(),
      this._consolizer.getConsoleMethods()
    )
  }

  /**
   * Get the Consolizer instance.
   * @returns {Consolizer}
   */
  getConsolizer () {
    return this._consolizer
  }

  /**
   * Get the Stylizer instance.
   * @returns {Stylizer}
   */
  getStylizer () {
    return this._styliser
  }
}

exports.Stylizer = Stylizer
exports.Consolizer = Consolizer
