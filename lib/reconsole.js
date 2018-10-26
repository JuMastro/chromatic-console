const { mergeObject } = require('./common.js')

const app = {}
const initial = {}

/**
 * Init console, rewriting and/or seeding.
 * @param {object} [options={}] - Console options.
 * @param {object} styles - Styles object contains list of style transformation.
 * @returns {object}
 */
app.init = (options = {}, styles) => {
  options = mergeObject(app.getDefaultOptions(), options)

  for (const fn in options.details) {
    if (typeof initial[fn] === 'undefined') {
      initial[fn] = console[fn].bind(console)
    }
  }

  const created = app.getNewConsole(options.details, styles)

  if (options.seed) {
    app.seedConsole(created)
  }

  return options.external ? created : {}
}

/**
 * Retreive default reconsole lib configuration.
 * @returns {object} Default options.
 */
app.getDefaultOptions = () => {
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
 * Create new console from initial.
 * @param {object} details - Details configuration for colors rewriting.
 * @param {object} styles - Styles object contains list of style transformations.
 * @returns {object} New console with stylized logs methods.
 */
app.getNewConsole = (details, styles) => {
  const rewritedConsole = {}
  const colors = typeof styles.colors !== 'undefined' ? styles.colors : styles

  for (const type in details) {
    if (details[type]) {
      rewritedConsole[type] = function () {
        const msg = colors[details[type]](...arguments)

        if (Array.isArray(msg)) {
          initial[type](...msg)
        } else {
          initial[type](msg)
        }
      }
    }
  }

  return rewritedConsole
}

/**
 * Seed initial console with new functions with stylized logs.
 * @param {object} list - Object contains a list of new console methods.
 * @returns {void}
 */
app.seedConsole = (list) => {
  for (const item in list) {
    console[item] = function () {
      list[item](...arguments)
    }
  }
}

module.exports = app.init
