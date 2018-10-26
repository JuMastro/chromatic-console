const Styles = require('../../../lib/restyles.js')
const formatsMap = require('../../../lib/maps/formats.json')
const colorsMap = require('../../../lib/maps/colors.json')

const styles = Styles()

function flatifyBackgroundsKeys (backgrounds) {
  return [].concat(backgrounds).map((background) => `bg${background}`)
}

const colors = [
  'black',
  'blue',
  'cyan',
  'green',
  'red',
  'white',
  'yellow'
]

const formats = Object.keys(formatsMap)
  .map((key) => key.toLowerCase())
  .sort()

const completeColors = Object.entries(colorsMap)
  .map((item) => item.shift().toLowerCase())

const flatBackgrounds = flatifyBackgroundsKeys(colors)
const flatCompleteBackgrounds = flatifyBackgroundsKeys(completeColors)

describe('Test `styles.js` construction.', () => {
  test('styles() -> is valid.', () => {
    const expected = [].concat(formats, colors, flatBackgrounds)
    const stylesKeys = Object.keys(Styles())
    expect(expected).toEqual(stylesKeys)
  })

  test('styles({ flat: false }) -> is valid.', () => {
    const expected = [formats, colors, colors]
    const styles = Styles({ flat: false })
    const stylesKeys = Object.entries(styles).map((item) => Object.keys(item.pop()))
    expect(expected).toEqual(stylesKeys)
  })

  test('styles({ complete: true }) -> is valid.', () => {
    const expected = [].concat(formats, completeColors, flatCompleteBackgrounds)
    const styles = Styles({ complete: true })
    const stylesKeys = Object.keys(styles)
    expect(expected).toEqual(stylesKeys)
  })

  test('styles({ include:["purple"] }) -> is valid.', () => {
    const styles = Styles({ include: ['purple'] })
    expect(styles).toHaveProperty('purple')
    expect(styles).toHaveProperty('bgpurple')
  })

  test('styles({ include:["invalid"] }) -> is valid.', () => {
    const styles = Styles({ include: ['invalid'] })
    expect(styles).not.toHaveProperty('invalid')
    expect(styles).not.toHaveProperty('bginvalid')
  })

  test('styles({ flat: false, complete: true }) -> is valid.', () => {
    const expected = [formats, completeColors, completeColors]
    const styles = Styles({ flat: false, complete: true })
    const stylesKeys = Object.entries(styles).map((item) => Object.keys(item.pop()))
    expect(expected).toEqual(stylesKeys)
  })
})

describe('Test `styles.js` functions call.', () => {
  test('styles.red(string) -> is valid.', () => {
    const simple = styles.red('simple')
    const expected = '\u001b[38;2;255;0;0msimple\u001b[0m'
    expect(simple).toEqual(expected)
  })

  test('styles.red(...strings) -> is valid.', () => {
    const double = styles.red('hello', 'world')
    const expected = '\u001b[38;2;255;0;0mhello\u001b[38;2;255;0;0mworld\u001b[0m'
    expect(double).toEqual(expected)
  })

  test('styles.bright(styles.red(...strings), string) -> is valid.', () => {
    const multiple = styles.bright(styles.red('hello', 'world'), 'onlyBright')
    const expected = [
      '\u001b[1m\u001b[38;2;255;0;0mhello',
      '\u001b[38;2;255;0;0mworld\u001b[0m',
      '\u001b[1monlyBright\u001b[0m'
    ]
    expect(multiple).toEqual(expected.join(''))
  })

  test('styles.bright(styles.red(...mixed)) -> is valid.', () => {
    const entries = ['hello', { obj: true }, 'world']
    const multiple = styles.bright(...styles.red(...entries))
    const expected = [
      '\u001b[1m\u001b[38;2;255;0;0mhello\u001b[0m\u001b[0m',
      { obj: true },
      '\u001b[1m\u001b[38;2;255;0;0mworld\u001b[0m\u001b[0m'
    ]
    expect(multiple).toEqual(expected)
  })
})
