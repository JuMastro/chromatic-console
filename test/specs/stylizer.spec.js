const Stylizer = require('../../src/stylizer.js')

describe('isRgbArray', () => {
  const isRgbArray = Stylizer.isRgbArray

  test('return true', () => {
    expect(isRgbArray([0, 0, 0])).toBe(true)
    expect(isRgbArray([144, 144, 144])).toBe(true)
    expect(isRgbArray([255, 255, 255])).toBe(true)
  })

  test('return false', () => {
    expect(isRgbArray([])).toBe(false)
    expect(isRgbArray(['a', 'b', 'c'])).toBe(false)
    expect(isRgbArray('[42, 42, 42]')).toBe(false)
    expect(isRgbArray([42, 42])).toBe(false)
    expect(isRgbArray([42, 42, 42, 42])).toBe(false)
  })
})

describe('checkOptions valid options fine', () => {
  const checkOptions = Stylizer.checkOptions

  test('throw when options is not a plain object', () => {
    expect(() => checkOptions(null)).toThrowError(/options/)
    expect(() => checkOptions(true)).toThrowError(/options/)
    expect(() => checkOptions(['a'])).toThrowError(/options/)
  })

  describe('options.adds', () => {
    test('throw when is not an object', () => {
      expect(() => checkOptions({ adds: null }))
        .toThrowError(/options\.adds/)

      expect(() => checkOptions({ adds: [] }))
        .toThrowError(/options\.adds/)
    })

    test('throw when is not a valid added color', () => {
      expect(() => checkOptions({ adds: { test: '50, 50, 50' } }))
        .toThrowError(/The "options\.adds" RGB/)

      expect(() => checkOptions({ adds: { test: [50, 50, 260] } }))
        .toThrowError(/The "options\.adds" RGB/)

      expect(() => checkOptions({ adds: { test: [-1, 50, 0] } }))
        .toThrowError(/The "options\.adds" RGB/)

      expect(() => checkOptions({ adds: { test: [] } }))
        .toThrowError(/The "options\.adds" RGB/)

      expect(() => checkOptions({ adds: { test: true } }))
        .toThrowError(/The "options\.adds" RGB/)
    })

    test('work fine', () => {
      expect(() => checkOptions({ adds: {} }))
        .not
        .toThrowError()

      expect(() => checkOptions({ adds: { a: [50, 50, 0], b: [250, 210, 250] } }))
        .not
        .toThrowError()
    })
  })
})

describe('Stylizer', () => {
  test('constructor work fine', () => {
    expect(() => new Stylizer())
      .not
      .toThrowError()

    expect(() => new Stylizer({ flat: false, adds: { a: [0, 0, 15] } }))
      .not
      .toThrowError()
  })

  test('_build() populate styles done', () => {
    const stylizer = new Stylizer()
    stylizer.styles = { modifiers: {}, foregrounds: {}, backgrounds: {} }
    stylizer._build()

    expect(Object.keys(stylizer.styles.modifiers).length).toBeGreaterThan(0)
    expect(Object.keys(stylizer.styles.foregrounds).length).toBeGreaterThan(0)
    expect(Object.keys(stylizer.styles.backgrounds).length).toBeGreaterThan(0)
  })

  test('_formatColor() return valid string response', () => {
    const stylizer = new Stylizer()

    expect(stylizer._formatColor('type', ['red', 'green', 'blue']))
      .toBe('\x1b[type;red;green;bluem%s\x1b[0m')
  })

  test('_formatModifier() return valid string response', () => {
    const stylizer = new Stylizer()

    expect(stylizer._formatModifier('modifier'))
      .toBe('\x1b[modifierm%s\x1b[0m')
  })

  test('stylize() return valid string response', () => {
    const stylizer = new Stylizer()

    const fakePattern = 'START%sEND'
    expect(stylizer.stylize(fakePattern, '---'))
      .toBe('START---END')
  })

  test('stylizeObject() not throw', () => {
    const stylizer = new Stylizer()

    expect(() => stylizer.stylizeObject({ obj: true }))
      .not
      .toThrowError()

    expect(() => stylizer.stylizeObject([{ obj: true }]))
      .not
      .toThrowError()
  })

  describe('createInspector()', () => {
    test('throw an Error when is argument is not an object', () => {
      const stylizer = new Stylizer()

      expect(() => stylizer.createInspector('test'))
        .toThrowError('The "options" argument')
    })

    test('work fine with defined depth', () => {
      const stylizer = new Stylizer()

      expect(() => stylizer.createInspector({ depth: 5 }))
        .not
        .toThrowError()
    })

    test('work fine with defined colors', () => {
      const stylizer = new Stylizer()

      expect(() => stylizer.createInspector({ colors: { tr: [39, 36] } }))
        .not
        .toThrowError()
    })

    test('work fine with defined styles', () => {
      const stylizer = new Stylizer()

      expect(() => stylizer.createInspector({
        colors: { tr: [39, 36] },
        styles: { add: 'tr' }
      }))
        .not
        .toThrowError()
    })
  })

  describe('addColor()', () => {
    const stylizer = new Stylizer()

    test('work fine and add new color', () => {
      expect(stylizer.styles.foregrounds.added).toBe(undefined)
      expect(stylizer.styles.backgrounds.added).toBe(undefined)

      stylizer.addColor('added', [42, 42, 42])

      expect(stylizer.styles.foregrounds.added)
        .toBe('\u001b[38;2;42;42;42m%s\u001b[0m')

      expect(stylizer.styles.backgrounds.added)
        .toBe('\u001b[48;2;42;42;42m%s\u001b[0m')
    })

    test('work fine and add new color with redefine option', () => {
      expect(() => {
        stylizer.addColor('added', [45, 45, 45], true)

        expect(stylizer.styles.foregrounds.added)
          .toBe('\u001b[38;2;45;45;45m%s\u001b[0m')

        expect(stylizer.styles.backgrounds.added)
          .toBe('\u001b[48;2;45;45;45m%s\u001b[0m')
      }).not.toThrowError()
    })

    test('throw an Error name already used', () => {
      expect(() => stylizer.addColor('added'))
        .toThrowError('is already used')
    })
  })

  describe('removeColor()', () => {
    test('work fine and return true when the color exist', () => {
      const stylizer = new Stylizer()
      stylizer.addColor('added', [42, 42, 42])
      const state = stylizer.removeColor('added')
      expect(state).toBe(true)

      expect(stylizer.styles.foregrounds)
        .not
        .toHaveProperty('added')

      expect(stylizer.styles.backgrounds)
        .not
        .toHaveProperty('added')
    })

    test('work fine and return false when color not found', () => {
      const stylizer = new Stylizer()
      const state = stylizer.removeColor('INEXISTANT_COLOR')
      expect(state).toBe(false)
    })
  })

  describe('pipe()', () => {
    test('work fine and return custom transformer', () => {
      const stylizer = new Stylizer()
      const bright = stylizer.styles.modifiers.bright
      const underline = stylizer.styles.modifiers.underline
      const yellow = stylizer.styles.foregrounds.yellow
      const brightUnderlinedYellow = [bright, underline, yellow]

      expect(() => {
        const custom = stylizer.pipe(brightUnderlinedYellow)
        expect(custom).toBeInstanceOf(Function)
        expect(custom('EXAMPLE'))
          .toBe('\x1b[1m\x1b[4m\x1b[38;2;255;255;0mEXAMPLE\x1b[0m\x1b[0m\x1b[0m')
      }).not.toThrowError()
    })
  })

  describe('isValidTransformers()', () => {
    test('throw when transformers argument is not an array', () => {
      const stylizer = new Stylizer()

      expect(() => stylizer.isValidTransformers({ obj: true }))
        .toThrowError('must be an array')
    })

    test('throw when transformers argument array is too short', () => {
      const stylizer = new Stylizer()

      expect(() => stylizer.isValidTransformers([]))
        .toThrowError('atleast 1 transformer')
    })

    test('throw when transformers argument are not valids', () => {
      const stylizer = new Stylizer()
      const invalid = 'IS_NOT_VALID_TRANSFORMER'
      const transformers = [
        stylizer.styles.modifiers.bright,
        stylizer.styles.modifiers.underline,
        invalid
      ]

      expect(() => stylizer.isValidTransformers(transformers))
        .toThrowError(`Received: "${invalid}"`)
    })
  })

  describe('createSet()', () => {
    const stylizer = new Stylizer()

    test('throw an Error when raw is not a boolean', () => {
      expect(() => stylizer.createSet(null, false))
        .toThrowError('The "raw" argument must be a boolean.')
    })

    test('throw an Error when flat is not a boolean', () => {
      expect(() => stylizer.createSet(false, null))
        .toThrowError('The "flat" argument must be a boolean.')
    })

    test('work fine as default', () => {
      const set = stylizer.createSet()
      expect(set).not.toHaveProperty('modifiers')
      expect(set).not.toHaveProperty('foregrounds')
      expect(set).not.toHaveProperty('backgrounds')
      expect(Object.keys(set).length).toBeGreaterThan(3)
    })

    test('work fine as no flat', () => {
      const set = stylizer.createSet(false, false)
      expect(set).toHaveProperty('modifiers')
      expect(set).toHaveProperty('foregrounds')
      expect(set).toHaveProperty('backgrounds')
      expect(Object.keys(set).length).toBe(3)
    })

    test('work fine with raw', () => {
      const set = stylizer.createSet(true, true)
      expect(typeof set.bright).toBe('string')
    })

    test('work fine with no-raw', () => {
      const set = stylizer.createSet(false, true)
      expect(typeof set.bright).toBe('function')
    })
  })
})
