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
