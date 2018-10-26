const constants = require('./constants.js')
const colorsMap = require('./maps/colors.json')
const formatsMap = require('./maps/formats.json')
const common = require('./common.js')

const app = {}

/**
 * Init & retreive stylizer object.
 * @param {object} [options={}] - Styles options.
 * @returns {object} Stylizer object list of restyling methods.
 */
app.init = (options = {}) => {
  options = common.mergeObject(app.getDefaultOptions(), options)

  const buildedStyles = app.buildStylesObject(options)
  const styles = buildedStyles.map((type) => common.orderObject(type))
  const [formats, colors, backgrounds] = app.buildStylesFunctions(...styles)

  return app.buildExternal(options, formats, colors, backgrounds)
}

/**
 * Get default styles options.
 * @returns {object} Default options
 */
app.getDefaultOptions = () => {
  return {
    flat: true,
    complete: false,
    include: false
  }
}

/**
 * Build styles object.
 * @param {object} options - Styles options.
 * @returns {Array<object>} An array contains (formats, colors, backgrounds)
 */
app.buildStylesObject = (options) => {
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

  const formats = app.loadFormats()
  const colors = app.loadColors(iterator)
  const backgrounds = app.switchToBackgrounds(common.copyObject(colors))

  return [formats, colors, backgrounds]
}

/**
 * Load formats styles object.
 * @returns {object}
 */
app.loadFormats = () => {
  const formats = {}

  for (const format in formatsMap) {
    formats[format.toLowerCase()] = `${constants.TAG}${formatsMap[format]}m`
  }

  return formats
}

/**
 * Load colors styles object.
 * @param {object} iterator - List of needed colors.
 * @returns {object}
 */
app.loadColors = (iterator) => {
  const type = constants.TYPES['fg']
  const colors = {}

  for (const color in iterator) {
    const rgb = Object.entries(colorsMap[color])
      .map((item) => item.pop())
      .join(';')

    colors[color.toLowerCase()] = `${constants.TAG}${type};${rgb}m`
  }

  return colors
}

/**
 * Switch colors to backgrounds object styles, replace 38;2 => 48;2 from string.
 * @param {object} colors - Colors object.
 * @returns {object} Updated copy of colors.
 */
app.switchToBackgrounds = (colors) => {
  const updated = {}

  for (const color in colors) {
    updated[`${color}`] = colors[color].replace('38;2', '48;2')
  }

  return updated
}

/**
 * Build stylizer functions.
 * @param {object} formats - Formats strings styles.
 * @param {object} colors - Colors strings styles.
 * @param {object} backgrounds - Backgrounds strings styles.
 * @returns {Array<object>} An array contains (formats, colors, backgrounds) object
 */
app.buildStylesFunctions = (formats, colors, backgrounds) => {
  const types = { formats, colors, backgrounds }
  const stylizer = common.copyObject(types)

  for (const type in stylizer) {
    for (const item in stylizer[type]) {
      stylizer[type][item] = app.stylizedFunction(types, type, item)
    }
  }

  return Object.entries(stylizer).map((item) => item.pop())
}

/**
 * Builds the function called by the user to apply a style.
 * @param {object} types - List of availables types (formats, colors, backgrounds).
 * @param {string} type - Current type from types.
 * @param {string} item - Current item from types[type].
 * @return {function} Function called by users to apply style.
 */
app.stylizedFunction = (types, type, item) => {
  return function () {
    return app.applyStyleToArguments(types, type, item, arguments)
  }
}

/**
 * Apply style on stylized functions arguments.
 * @param {object} types - List of availables types.
 * @param {string} type - Current type from types.
 * @param {string} item - Current item from types[type].
 */
app.applyStyleToArguments = (types, type, item, parentArguments) => {
  const list = []
  const argumentsKeys = Object.keys(parentArguments)

  argumentsKeys.forEach((value, index) => {
    if (typeof parentArguments[index] !== 'string') {
      return list.push(parentArguments[index])
    }

    const updated = [types[type][item], parentArguments[index]]

    if (typeof parentArguments[index + 1] !== 'string') {
      updated.push(constants.CLOSER)
    }

    list.push(updated.join(''))
  })

  return common.isArrayOfStrings(list)
    ? list.join('')
    : common.groupStringsOfArray(list)
}

/**
 * Build external stylizer object.
 * @param {object} options - Styles options.
 * @param {object} formats - Formats object functions.
 * @param {object} colors - Colors object functions.
 * @param {object} backgrounds - Backgrounds object functions.
 * @returns {object} Builded object.
 */
app.buildExternal = (options, formats, colors, backgrounds) => {
  if (!options.flat) {
    return Object.assign({}, { formats, colors, backgrounds })
  }

  const flatifyBackgrounds = {}

  for (const background in backgrounds) {
    flatifyBackgrounds[`bg${background}`] = backgrounds[background]
  }

  return Object.assign({}, formats, colors, flatifyBackgrounds)
}

module.exports = app.init
