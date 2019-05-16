const Chromatic = require('../../src/index.js')
const Consolizer = require('../../src/consolizer.js')
const Stylizer = require('../../src/stylizer.js')

describe('Chromatic', () => {
  test('constructor', () => {
    expect(() => new Chromatic()).not.toThrowError()
  })

  test('getConsolizer()', () => {
    const chromatic = new Chromatic()
    expect(chromatic.getConsolizer()).toBeInstanceOf(Consolizer)
  })

  test('getStylizer()', () => {
    const chromatic = new Chromatic()
    expect(chromatic.getStylizer()).toBeInstanceOf(Stylizer)
  })

  test('common method should not throw', () => {
    const chromatic = new Chromatic()
    const stylizer = chromatic.getStylizer()
    const hidder = (value) => stylizer.stylize(
      stylizer.styles.modifiers.hidden,
      value
    )

    expect(() => {
      chromatic.bright(hidder('Hello'))
      chromatic.underline(hidder('Hello'))
      chromatic.yellow(hidder('Hello'))
      chromatic.black(hidder('Hello'))
    }).not.toThrowError()
  })
})
