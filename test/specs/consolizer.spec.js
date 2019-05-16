const Consolizer = require('../../src/consolizer.js')
const Stylizer = require('../../src/stylizer.js')

describe('isValidLevelOption', () => {
  const isValidLevelOption = Consolizer.isValidLevelOption

  test('return true when string', () => {
    expect(isValidLevelOption('str')).toBe(true)
  })

  test('return true when null', () => {
    expect(isValidLevelOption(null)).toBe(true)
  })

  test('return true when valid array', () => {
    expect(isValidLevelOption(['err', 'str'])).toBe(true)
    expect(isValidLevelOption(['out', 'str'])).toBe(true)
  })

  test('return false', () => {
    expect(isValidLevelOption(['anotherKey', 'str'])).toBe(false)
    expect(isValidLevelOption(['str'])).toBe(false)
    expect(isValidLevelOption()).toBe(false)
  })
})

describe('checkOptions', () => {
  const checkOptions = Consolizer.checkOptions

  test('throw an error when it is not an object', () => {
    expect(() => checkOptions(null)).toThrowError(/options/)
    expect(() => checkOptions(true)).toThrowError(/options/)
    expect(() => checkOptions(['a'])).toThrowError(/options/)
  })

  describe('options.stylizer', () => {
    test('throw when it is not stylizer instance', () => {
      expect(() => checkOptions({ stylizer: null }))
        .toThrowError(/options\.stylizer/)

      expect(() => checkOptions({ stylizer: 'str' }))
        .toThrowError(/options\.stylizer/)

      expect(() => checkOptions({ stylizer: Stylizer }))
        .toThrowError(/options\.stylizer/)
    })

    test('work fine', () => {
      expect(() => checkOptions({}))
        .not
        .toThrowError()

      expect(() => checkOptions({ stylizer: new Stylizer() }))
        .not
        .toThrowError()
    })
  })

  describe('options.replace', () => {
    test('throw when it is not boolean', () => {
      expect(() => checkOptions({ replace: null }))
        .toThrowError(/options\.replace/)

      expect(() => checkOptions({ replace: 'str' }))
        .toThrowError(/options\.replace/)
    })

    test('work fine when "replace" is a boolean', () => {
      expect(() => checkOptions({ replace: true }))
        .not
        .toThrowError()

      expect(() => checkOptions({ replace: false }))
        .not
        .toThrowError()
    })
  })

  describe('options.stdout', () => {
    test('throw an error when it is not null or Stream', () => {
      expect(() => checkOptions({ stdout: false }))
        .toThrowError(/options\.stdout/)

      expect(() => checkOptions({ stdout: Promise }))
        .toThrowError(/options\.stdout/)
    })

    test('work fine when "stdout" is null', () => {
      expect(() => checkOptions({ stdout: null }))
        .not
        .toThrowError()
    })

    test('work fine when "stdout" is null', () => {
      expect(() => checkOptions({ stdout: process.stdout }))
        .not
        .toThrowError()
    })
  })

  describe('options.stderr', () => {
    test('throw an error when it is not null or Stream', () => {
      expect(() => checkOptions({ stderr: false }))
        .toThrowError(/options\.stderr/)

      expect(() => checkOptions({ stderr: Promise }))
        .toThrowError(/options\.stderr/)
    })

    test('work fine when "stderr" is null', () => {
      expect(() => checkOptions({ stderr: null }))
        .not
        .toThrowError()
    })

    test('work fine when "stderr" is null', () => {
      expect(() => checkOptions({ stderr: process.stderr }))
        .not
        .toThrowError()
    })
  })

  describe('options.levels', () => {
    test('throw an error when is not a plain object', () => {
      expect(() => checkOptions({ levels: null }))
        .toThrowError(/options\.levels/)

      expect(() => checkOptions({ levels: false }))
        .toThrowError(/options\.levels/)

      expect(() => checkOptions({ levels: ['a', 'b'] }))
        .toThrowError(/options\.levels/)
    })

    test('throw an error when the level options are not valids', () => {
      expect(() => checkOptions({ levels: { log: Promise } }))
        .toThrowError(/"err" or "out"/)

      expect(() => checkOptions({ levels: { log: ['str'] } }))
        .toThrowError(/"err" or "out"/)

      expect(() => checkOptions({ levels: { log: ['ers', 'str'] } }))
        .toThrowError(/"err" or "out"/)
    })

    test('work fine with valid options object', () => {
      expect(() => checkOptions({ levels: { log: 'str', warn: 'str' } }))
        .not
        .toThrowError()

      expect(() => checkOptions({ levels: { log: ['out', 'str'] } }))
        .not
        .toThrowError()

      expect(() => checkOptions({ levels: { log: ['err', 'str'], warn: ['err', 'str'] } }))
        .not
        .toThrowError()
    })
  })
})

describe('Constrolizer', () => {
  test('constructor()', () => {
    expect(() => new Consolizer())
      .not
      .toThrowError()

    expect(() => new Consolizer({ stylizer: new Stylizer() }))
      .not
      .toThrowError()
  })

  test('_build() populate usables done', () => {
    const consolizer = new Consolizer()
    this.usables = null

    consolizer._build()

    expect(Object.keys(consolizer.usables).length)
      .toBe(Object.keys(consolizer.levels).length)
  })

  test('_prepareLevel() return formated level method definitions', () => {
    const consolizer = new Consolizer()

    expect(consolizer._prepareLevel(['log', null]).flat().slice(0, 2))
      .toEqual(['log', 'out'])

    expect(consolizer._prepareLevel(['log', 'green']).flat().slice(0, 2))
      .toEqual(['log', 'out'])

    expect(consolizer._prepareLevel(['log', ['err', 'green']]).flat().slice(0, 2))
      .toEqual(['log', 'err'])
  })

  describe('_prepareTagLevel()', () => {
    test('throw an error when the tag is not valid', () => {
      expect(() => new Consolizer()._prepareTagLevel('bright.rainbowColor'))
        .toThrowError(/rainbowColor/)
    })

    test('work fine', () => {
      expect(() => new Consolizer()._prepareTagLevel('bright.yellow'))
        .not
        .toThrowError()
    })
  })

  test('_mountLevel() mount method fine', () => {
    const consolizer = new Consolizer()
    const [level, mounted] = consolizer._mountLevel(['level', ['out', 'style']])
    expect(level).toBe('level')
    expect(mounted).toBeInstanceOf(Function)
  })

  test('_applyToConsole() apply method to console fine', () => {
    const consolizer = new Consolizer()
    consolizer._applyLevelToConsole(['error', function test () {}])
    expect(consolizer.error.name).toBe('test')
  })

  test('_createLogMethod() return function', () => {
    const consolizer = new Consolizer()

    expect(consolizer._createLogMethod('err', function test () {}))
      .toBeInstanceOf(Function)
  })

  test('buildLogsMethods() return valid object', () => {
    const consolizer = new Consolizer()
    const methods = consolizer.buildLogsMethods()

    Object.values(methods).forEach((method) => {
      expect(method).toBeInstanceOf(Function)
    })
  })

  test('getConsoleMethods() return valid object', () => {
    const consolizer = new Consolizer()
    const res = consolizer.getConsoleMethods()
    expect(res).toHaveProperty('logObject')
    Object.keys(consolizer.usables).forEach((key) => {
      expect(res[key]).toBe(consolizer.usables[key])
    })
  })

  test('logObject() not throw', () => {
    expect(() => {
      const consolizer = new Consolizer()
      consolizer.logObject({ deep: { obj: { done: true } } })
    }).not.toThrowError()
  })

  test('test builded methods', () => {
    const consolizer = new Consolizer()
    expect(() => consolizer.usables.error('TEST-LOG')).not.toThrowError()
  })

  test('test "replace" options work fine', () => {
    const consolizer = new Consolizer({ replace: true })
    expect(global.console).toBe(consolizer)
  })
})
