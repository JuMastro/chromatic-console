const { Console } = require('console')
const Stream = require('stream')
const Stylizer = require('./stylizer.js')
const { isPlainObject, prepareOptions } = require('./utils.js')

const DEFAULT_OPTIONS = {
  stylizer: null,
  replace: false,
  stdout: null,
  stderr: null,
  levels: {
    error: ['err', 'red'],
    warn: ['out', 'bright.yellow'],
    info: ['out', 'bright'],
    log: null,
    debug: null
  }
}

/**
 * Check if provided level has correct format.
 * @param {any} level - Tested level.
 * @returns {boolean}
 */
function isValidLevelOption (level) {
  return level === null || typeof level === 'string' ||
    (Array.isArray(level) && level.length === 2 && ['err', 'out'].includes(level[0]))
}

/**
 * Check the stylizer options object.
 * @param {object} options - Consolizer options object.
 * @returns {object}
 */
function checkOptions (options) {
  const opts = prepareOptions(options, {
    ...DEFAULT_OPTIONS,
    stylizer: new Stylizer()
  })

  if (!(opts.stylizer instanceof Stylizer)) {
    throw new TypeError(
      'The "options.stylizer" argument must be a Stylizer instance.'
    )
  }

  if (typeof opts.replace !== 'boolean') {
    throw new TypeError('The "options.replace" argument must be a boolean.')
  }

  if (opts.stdout !== null && !(opts.stdout instanceof Stream)) {
    throw new TypeError(
      'The "options.stdout" argument must be null or Stream.'
    )
  }

  if (opts.stderr !== null && !(opts.stderr instanceof Stream)) {
    throw new TypeError(
      'The "options.stderr" argument must be null or Stream.'
    )
  }

  if (!isPlainObject(opts.levels)) {
    throw new TypeError('The "options.levels" argument must be a plain object.')
  }

  for (const level of Object.values(opts.levels)) {
    if (!isValidLevelOption(level)) {
      throw new TypeError(
        'The provided "options.levels" items must be strings or arrays,' +
        'with "err" or "out" as first argument.'
      )
    }
  }

  return opts
}

/**
 * Class Consolizer
 * Used to improve colors for messages.
 */
module.exports = class Consolizer extends Console {
  /**
   * @param {object} options - The options object.
   */
  constructor (options = {}) {
    const opts = checkOptions(options)
    opts.stdout = opts.stdout || process.stdout
    opts.stderr = opts.stderr || process.stderr

    super(opts)

    this.stylizer = opts.stylizer
    this.replace = opts.replace
    this.stdout = opts.stdout
    this.stderr = opts.stderr
    this.levels = opts.levels
    this.styles = null

    this._build()
  }

  /**
   * Internal method to build the instance.
   * It use to build styles and usables methods.
   * @returns {void}
   */
  _build () {
    this.styles = this.stylizer.createSet(true)
    this.usables = Object.fromEntries(
      Object.entries(this.levels)
        .map(this._prepareLevel.bind(this))
        .map(this._mountLevel.bind(this))
        .map(this._applyLevelToConsole.bind(this))
    )

    if (this.replace) {
      console = this
    }
  }

  /**
   * Private method to prepare a unit level.
   * @param {Array} param0 - An array that contain [level, style].
   * @returns {Array} [level, [stream, style]]
   */
  _prepareLevel ([level, style]) {
    if (!style) {
      return [
        level,
        ['out', this.stylizer.stylize.bind(null, '%s')]
      ]
    }

    let stream = 'out'

    if (Array.isArray(style)) {
      [stream, style] = style
    }

    return [
      level,
      [stream, this.stylizer.pipe(this._prepareTagLevel(style))]
    ]
  }

  /**
   * Private method to prepare a style tags for a level.
   * @param {string} style - The style tag list, separated by dot.
   * @returns {Array<string>} A list of valids tags.
   */
  _prepareTagLevel (style) {
    return style.split('.').map((tag) => {
      if (!(tag in this.styles)) {
        throw new RangeError(`The "${tag}" is not found on styles.`)
      }

      return this.styles[tag]
    })
  }

  /**
   * Private method to mount a level to as method.
   * @param {Array} param0 - An array that represent a level to mount. ([level, [stream, style]])
   * @returns {Array} [level, method]
   */
  _mountLevel ([level, [stream, style]]) {
    return [
      level,
      this._createLogMethod(stream, style)
    ]
  }

  /**
   * Private methode to replace a console method to the current context.
   * @param {Array} param0 - An array that represent a level method to replace to the context. ([level, method])
   * @returns {Array} [level, method]
   */
  _applyLevelToConsole ([level, method]) {
    this[level] = method
    return [level, method]
  }

  /**
   * Private method to create a log method that depend on "this" instance.
   * @param {string} stream - The stdio type "err" or "log".
   * @param {function} style - A builded style function.
   * @returns {function} A log function that wrap the style transformation.
   */
  _createLogMethod (stream, style) {
    const type = stream === 'err' ? 'error' : 'log'
    const initial = this[type].bind(this)
    return (...args) => initial(style(...args))
  }

  /**
   * Build log method for each registered styles.
   */
  buildLogsMethods () {
    return Object.fromEntries(
      Object.entries(this.stylizer.createSet(false, true))
        .map(([name, style]) => (
          [name, this._createLogMethod('out', style)]
        ))
    )
  }
}

Object.defineProperties(module.exports, {
  DEFAULT_OPTIONS: { value: DEFAULT_OPTIONS },
  checkOptions: { value: checkOptions },
  isValidLevelOption: { value: isValidLevelOption }
})
