describe('Test console.js', () => {
  const Styles = require('../../../lib/restyles.js')
  const Console = require('../../../lib/reconsole.js')
  const defaultStyles = Styles()
  const isFunction = (item) => typeof item === 'function'

  test('reconsole() -> is valid.', () => {
    const app = Console(undefined, defaultStyles)
    for (const item in app) {
      expect(isFunction(app[item])).toBe(true)
    }
  })

  test('reconsole({ flat: false }) -> not throw error.', () => {
    expect(() => {
      const app = Console({}, Styles({ flat: false }))
      expect(app).toHaveProperty('info')
      expect(app).toHaveProperty('warn')
      expect(app).toHaveProperty('error')
    }).not.toThrow()
  })

  test('reconsole({ seed: false }) -> not throw error.', () => {
    expect(() => {
      Console({ seed: false }, defaultStyles)
    }).not.toThrow()
  })

  test('reconsole({ external: false }) -> is valid.', function () {
    const app = Console({ external: false }, defaultStyles)
    const keysLength = Object.keys(app).length
    expect(keysLength).toEqual(0)
  })

  test('Test reconsole logs methods -> not throw error.', () => {
    expect(() => {
      const recons = Console(undefined, defaultStyles)
      recons.info('warn')
      console.info('multiple parameters types', { obj: true }, 'yet')
    }).not.toThrow()
  })
})
