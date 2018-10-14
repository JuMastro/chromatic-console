'use strict'

const constants = require('./constants.js')
const colorsMap = require('./maps/colors.json')
const formatsMap = require('./maps/formats.json')
const common = require('./common.js')

class Styles {
  /**
   * Class constructor.
   * @param {object} [options={}] - Styles options.
   */
  constructor (options = {}) {
    return this._init(options)
  }

  /**
   * Get stylizer object.
   * @param {object} options - Styles options.
   * @returns {function} At end get an object who's include list of stylizer functions.
   */
  _init (options) {
    options = common.mergeObject(this._getDefaultOptions(), options)

    const styles = this._buildStylesObject(options)
      .map((type) => common.orderObject(type))

    const [
      formats,
      colors,
      backgrounds
    ] = this._buildStylesFunctions(...styles)

    return this._buildExternal(options, formats, colors, backgrounds)
  }

  /**
   * Get default styles options.
   * @returns {object} Styles options
   */
  _getDefaultOptions () {
    return {
      flat: true,
      complete: false,
      include: false
    }
  }

  /**
   * Build style object.
   * @param {object} options - Styles options.
   * @returns {Array<object>} An array contains (formats, colors, backgrounds)
   */
  _buildStylesObject (options) {
    let iterator = common.copyObject(colorsMap)

    if (!options.complete) {
      iterator = {}
      const allowed = [].concat(constants.BASE, options.include || [])

      Object.keys(colorsMap)
        .filter((name) => allowed.includes(name.toLowerCase()))
        .forEach((color) => { iterator[color] = colorsMap[color] })
    }

    const formats = this._loadFormats()
    const colors = this._loadColors(iterator)
    const backgrounds = this._switchToBackgroundsType(common.copyObject(colors))

    return [formats, colors, backgrounds]
  }

  /**
   * Load formats object.
   * @returns {object}
   */
  _loadFormats () {
    let formats = {}

    for (let format in formatsMap) {
      formats[format.toLowerCase()] = `${constants.TAG}${formatsMap[format]}m`
    }

    return formats
  }

  /**
   * Load colors object.
   * @param {object} iterator - List of needed colors.
   * @returns {object}
   */
  _loadColors (iterator) {
    let colors = {}

    for (let color in iterator) {
      let rgb = Object.entries(colorsMap[color])
        .map((item) => item.pop())
        .join(';')

      colors[color.toLowerCase()] = `${constants.TAG}${constants.TYPES['fg']};${rgb}m`
    }

    return colors
  }

  /**
   * Switch colors to backgrounds object styles.
   * @param {object} list - Colors object.
   * @returns {object} Updated copy of colors.
   */
  _switchToBackgroundsType (list) {
    let updated = {}

    for (let item in list) {
      updated[`${item}`] = list[item].replace('38;2', '48;2')
    }

    return updated
  }

  /**
   * Build styles functions.
   * @param {object} formats - Formats strings styles.
   * @param {object} colors - Colors strings styles.
   * @param {object} backgrounds - Backgrounds strings styles.
   * @returns {Array<object>} An array contains (formats, colors, backgrounds)
   */
  _buildStylesFunctions (formats, colors, backgrounds) {
    const types = { formats, colors, backgrounds }
    const stylizer = common.copyObject(types)

    for (let type in stylizer) {
      for (let item in stylizer[type]) {
        stylizer[type][item] = this._stylizedFunction(types, type, item)
      }
    }

    return Object.entries(stylizer).map((item) => item.pop())
  }

  /**
   * Builds the method called by the user to apply a style.
   * @param {object} types - List of availables types (formats, colors, backgrounds).
   * @param {string} type - Current type from types.
   * @param {string} item - Current item from types[type].
   * @return {function} Function called by users to apply style.
   */
  _stylizedFunction (types, type, item) {
    return function () {
      let list = []
      let keys = Object.keys(arguments)
      let updated
      let last

      for (let i = 0; i < keys.length; ++i) {
        if (typeof arguments[keys[i]] === 'string') {
          updated = [arguments[keys[i]]]

          if (typeof arguments[keys[i - 1]] !== 'string' || item === last) {
            updated.unshift(types[type][item])
          }

          if (typeof arguments[keys[i + 1]] !== 'string') {
            updated.push(constants.CLOSER)
          }

          updated = updated.join('')
        } else {
          updated = arguments[keys[i]]
        }

        last = item
        list.push(updated)
      }

      return common.isArrayOfStrings(list) ? list.join('') : common.groupStringsOfArray(list)
    }
  }

  /**
   * Build external stylizer object.
   * @param {object} options - Styles options.
   * @param {object} formats - Formats object functions.
   * @param {object} colors - Colors object functions.
   * @param {object} backgrounds - Backgrounds object functions.
   * @returns {object} Builded object.
   */
  _buildExternal (options, formats, colors, backgrounds) {
    if (!options.flat) {
      return Object.assign({}, { formats, colors, backgrounds })
    }

    let flatifyBackgrounds = {}

    for (let background in backgrounds) {
      flatifyBackgrounds[`bg${background}`] = backgrounds[background]
    }

    return Object.assign({}, formats, colors, flatifyBackgrounds)
  }
}

module.exports = (options) => new Styles(options)
