const util = require('util')
const { isPlainObject, prepareOptions } = require('./utils.js')

const DEFAULT_OPTIONS = {
  flat: true,
  adds: {}
}

const HASH_MODIFIER = {
  bright: 1,
  dim: 2,
  underline: 4,
  blink: 5,
  hidden: 8
}

const HASH_COLORS = {
  black: [0, 0, 0],
  blue: [0, 0, 255],
  cyan: [0, 215, 175],
  green: [0, 255, 0],
  orange: [95, 95, 0],
  purple: [128, 0, 128],
  red: [255, 0, 0],
  white: [255, 255, 255],
  yellow: [255, 255, 0]
}

const VALID_TRANSFORMER_REGEX = /^\u001b\[((\d{2};\d{1};\d{1,3};\d{1,3};\d{1,3})|(\d{1}))m%s\u001b\[0m$/g

/**
 * Check if a colors as allowed format. ([r, g, b])
 * @param {Array<number>} rgb - The rgb values.
 * @returns {boolean}
 */
function isRgbArray (rgb) {
  return Array.isArray(rgb) &&
    rgb.length === 3 &&
    rgb.length === rgb.filter((v) => Number.isInteger(v) && v <= 255 & v >= 0).length
}

/**
 * Check the stylizer options object.
 * @param {object} options - Stylizer options object.
 * @returns {object}
 */
function checkOptions (options) {
  const opts = prepareOptions(options, DEFAULT_OPTIONS)

  if (!isPlainObject(opts.adds)) {
    throw new TypeError('The "options.adds" must be a plain object.')
  }

  for (const color of Object.values(opts.adds)) {
    if (!isRgbArray(color)) {
      throw new RangeError('The "options.adds" RGB values must be 3 integers between 0 and 255 as array.')
    }
  }

  return opts
}

/**
 * Class Stylizer.
 * Used to create & provide styles to items (strings or object).
 */
module.exports = class Stylizer {
  /**
   * @param {object} options - The options object.
   */
  constructor (options = {}) {
    const opts = checkOptions(options)

    this.adds = opts.adds
    this.styles = {
      modifiers: {},
      foregrounds: {},
      backgrounds: {}
    }
    this.inspect = this.createInspector()

    this._build()
  }

  /**
   * Internal method to build the instance.
   * It use to build transformers methods (modifiers + colors).
   * @returns {void}
   */
  _build () {
    Object.entries({ ...HASH_MODIFIER }).forEach(([name, modifier]) => {
      Object.assign(this.styles.modifiers, {
        [name]: this._formatModifier(modifier)
      })
    })

    Object.entries({ ...HASH_COLORS, ...this.adds }).forEach(([name, color]) => {
      this.addColor(name, color)
    })
  }

  /**
   * Internal to format a color.
   * @param {string} type - The colors type (fg, bg).
   * @param {Array<number>} rgb - The decomposed color as RGB.
   * @returns {string} String style formatted.
   */
  _formatColor (type, [red, green, blue]) {
    return this._formatModifier(`${type};${red};${green};${blue}`)
  }

  /**
   * Internal to format a modifier.
   * @param {string} type - The modifier type.
   * @returns {string} String style formatted.
   */
  _formatModifier (type) {
    return `\x1b[${type}m%s\x1b[0m`
  }

  /**
   * Apply a style pattern to a list of values.
   * @param {string} pattern - The style pattern to apply to the values.
   * @param  {...any} values - The values to apply the pattern.
   * @returns {string} Joined stylized list of value.
   */
  stylize (pattern, ...values) {
    return values
      .map((value) => util.format(pattern, value))
      .join('')
  }

  /**
   * Stylize an object using `util.inspect`
   * @param {object} object - The object to stylize.
   * @returns {string}
   */
  stylizeObject (object) {
    return this.inspect(object)
  }

  /**
   * Create an independant inspector based on util.inspect.
   * @param {object} options - The inspector options.
   * @returns {function} Independant inspector.
   */
  createInspector (options = {}) {
    if (!isPlainObject(options)) {
      throw new TypeError('The "options" argument must be a plain object.')
    }

    if (typeof options.depth === 'undefined') {
      options.depth = Infinity
    }

    if (typeof options.colors === 'undefined') {
      options.colors = true
    }

    const inspector = { ...util.inspect }

    if (isPlainObject(options.colors)) {
      Object.assign(inspector.colors, options.colors)
    }

    if (isPlainObject(options.styles)) {
      Object.assign(inspector.styles, options.styles)
    }

    return function (...args) {
      return args.map((arg) => util.inspect.call(inspector, arg, options)).join('')
    }
  }

  /**
   * Provide a new color to the Stylizer instance.
   * @param {string} name - The color name.
   * @param {Array<number>} color - The colors [R, G, B] values.
   * @param {boolean} redefine - The redefinition state.
   */
  addColor (name, color, redefine = false) {
    if (name in this.styles.foregrounds && !redefine) {
      throw new RangeError(`The "${name}" is already used to another color.`)
    }

    Object.assign(this.styles.foregrounds, {
      [name]: this._formatColor('38;2', color)
    })

    Object.assign(this.styles.backgrounds, {
      [name]: this._formatColor('48;2', color)
    })
  }

  /**
   * Remove a color by name.
   * @param {string} name - The color name.
   * @returns  {boolean}
   */
  removeColor (name) {
    if (!(name in this.styles.foregrounds)) {
      return false
    }

    delete this.styles.foregrounds[name]
    delete this.styles.backgrounds[name]

    return true
  }

  /**
   * Pipe a list of transformers to create uniq styles.
   * @param {Array<string>} transformers - List of transformers.
   * @returns {function}
   */
  pipe (transformers) {
    this.isValidTransformers(transformers)

    return this.stylize.bind(
      null,
      transformers.reduce((acc, next) => this.stylize(acc, next))
    )
  }

  /**
   * Check if list of transformers is valid.
   * @param {Array<string>} transformers - The transformers list
   */
  isValidTransformers (transformers) {
    if (!Array.isArray(transformers) || transformers.length < 1) {
      throw new Error(
        'The "transformers" argument must be an array with atleast 1 transformer.'
      )
    }

    transformers.forEach((transformer) => {
      if (!transformer.match(VALID_TRANSFORMER_REGEX)) {
        throw new Error(
          'The provided transformer is not valid, use addColor method to provide new colors. ' +
          `Received: "${transformer}".`
        )
      }
    })

    return true
  }

  /**
   * Create function set to stylize items.
   * @param {boolean} raw - The raw state.
   * @param {boolean} flat - The flat state.
   * @returns {object}
   */
  createSet (raw = false, flat = true) {
    if (typeof raw !== 'boolean') {
      throw new TypeError('The "raw" argument must be a boolean.')
    }

    if (typeof flat !== 'boolean') {
      throw new TypeError('The "flat" argument must be a boolean.')
    }

    const contentizer = raw
      ? (style) => style
      : (style) => this.stylize.bind(null, style)

    const set = Object.fromEntries(
      Object.entries(this.styles).map(([type, list]) => (
        [type, Object.fromEntries(
          Object.entries(list).map(([name, style]) => (
            [name, contentizer(style)]
          ))
        )]
      ))
    )

    if (flat) {
      return {
        ...set.modifiers,
        ...set.foregrounds,
        ...Object.fromEntries(
          Object.entries(set.backgrounds)
            .map(([name, style]) => [`bg${name}`, style])
        )
      }
    }

    return set
  }
}

Object.defineProperties(module.exports, {
  HASH_COLORS: { value: HASH_COLORS },
  HASH_MODIFIER: { value: HASH_MODIFIER },
  DEFAULT_OPTIONS: { value: DEFAULT_OPTIONS },
  checkOptions: { value: checkOptions },
  isRgbArray: { value: isRgbArray }
})
