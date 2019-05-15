const utils = require('../../src/utils.js')

describe('isPlainObject()', () => {
  test('done', () => {
    expect(utils.isPlainObject({})).toBe(true)
    expect(utils.isPlainObject({ test: true })).toBe(true)
  })

  test('fail', () => {
    expect(utils.isPlainObject()).toBe(false)
    expect(utils.isPlainObject([])).toBe(false)
    expect(utils.isPlainObject(null)).toBe(false)
  })
})

describe('prepareOptions()', () => {
  test('done', () => {
    expect(utils.prepareOptions({ a: null }))
      .toEqual({ a: null })

    expect(utils.prepareOptions({ a: 'ok', c: 'ok' }, { a: null, b: 'ok' }))
      .toEqual({ a: 'ok', b: 'ok', c: 'ok' })
  })

  test('fail', () => {
    expect(() => utils.prepareOptions())
      .toThrowError('The "options" argument must be a plain object.')

    expect(() => utils.prepareOptions([]))
      .toThrowError('The "options" argument must be a plain object.')
  })
})
