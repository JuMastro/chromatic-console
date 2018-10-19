const constants = require('./constants.js')
const colorsMap = require('./maps/colors.json')
const formatsMap = require('./maps/formats.json')
const common = require('./common.js')

/**
 * Class Restyle
 * To build and export a stylizer module (List of functions in object).
 */
class Restyles {
  /**
   * Get stylizer object.
   * @param {object} [options={}] - Styles options.
   * @returns {function} At end get an object who's include list of stylizer functions.
   */
  init (options = {}) {
    options = common.mergeObject(this._getDefaultOptions(), options)

    const buildedStyles = this._buildStylesObject(options)
    const styles = buildedStyles.map((type) => common.orderObject(type))
    const [formats, colors, backgrounds] = this._buildStylesFunctions(...styles)

    return this._buildExternal(options, formats, colors, backgrounds)
  }

  /**
   * Get default styles options.
   * @returns {object} Default styles options
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

      allowed.map((item) => {
        const capitalizedStyle = common.capitalize(item)

        if (typeof colorsMap[capitalizedStyle] !== 'undefined') {
          iterator[capitalizedStyle] = colorsMap[capitalizedStyle]
        }
      })
    }

    const formats = this._loadFormats()
    const colors = this._loadColors(iterator)
    const backgrounds = this._switchToBackgrounds(common.copyObject(colors))

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
    const type = constants.TYPES['fg']

    let colors = {}

    for (let color in iterator) {
      const rgb = Object.entries(colorsMap[color])
        .map((item) => item.pop())
        .join(';')

      colors[color.toLowerCase()] = `${constants.TAG}${type};${rgb}m`
    }

    return colors
  }

  /**
   * Switch colors to backgrounds object styles.
   * @param {object} list - Colors object.
   * @returns {object} Updated copy of colors.
   */
  _switchToBackgrounds (list) {
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
    const applyStyle = this._applyStyleToArgument

    return function () {
      const argumentsKeys = Object.keys(arguments)
      const list = []

      let last = null

      argumentsKeys.forEach((key, index) => {
        list.push(applyStyle(
          arguments,
          argumentsKeys,
          index,
          types,
          type,
          item,
          last
        ))
      })

      return common.isArrayOfStrings(list)
        ? list.join('')
        : common.groupStringsOfArray(list)
    }
  }

  /**
   * Apply style on stylized functions arguments.
   * @param {Arguments} parentArguments - Parent function `aguments`.
   * @param {Array} argumentsKeys - Keys of arguments of parent function.
   * @param {number} keysIndex - Index from iteration of parent arguments keys.
   * @param {object} types - List of availables types (formats, colors, backgrounds).
   * @param {string} type - Current type from `types`.
   * @param {string} item - Current item from `types[type]`.
   * @param {string} last - Last selected item name.

   */
  _applyStyleToArgument (parentArguments, argumentsKeys, keysIndex, types, type, item, last) {
    if (typeof parentArguments[argumentsKeys[keysIndex]] !== 'string') {
      return parentArguments[argumentsKeys[keysIndex]]
    }

    const updated = [parentArguments[argumentsKeys[keysIndex]]]
    const pastIndexType = typeof parentArguments[argumentsKeys[keysIndex - 1]]
    const nextIndexType = typeof parentArguments[argumentsKeys[keysIndex + 1]]

    if (pastIndexType !== 'string' || item !== last) {
      updated.unshift(types[type][item])
    }

    if (nextIndexType !== 'string') {
      updated.push(constants.CLOSER)
    }

    last = item

    return updated.join('')
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

const restyles = new Restyles()

module.exports = (options) => restyles.init(options)
