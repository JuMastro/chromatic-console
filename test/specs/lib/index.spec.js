describe('Test lib entry point', () => {
  const Chromatic = require('../../../lib/index.js')

  test('chromatic({ styles: { include: ["purple"] } }) -> is valid.', () => {
    const chromatic = Chromatic({ styles: { include: ['purple'] } })
    expect(chromatic).toHaveProperty('red')
    expect(chromatic).toHaveProperty('bgred')
    expect(chromatic).toHaveProperty('purple')
    expect(chromatic).toHaveProperty('bgpurple')
  })

  test('chromatic() -> get stored instance -> is valid.', () => {
    const chromatic = Chromatic()
    expect(chromatic).toHaveProperty('purple')
    expect(chromatic).toHaveProperty('bgpurple')
  })

  test('chromatic({ reload: true }) -> get new instance -> is valid.', () => {
    const chromatic = Chromatic({ reload: true })
    expect(chromatic).not.toHaveProperty('purple')
    expect(chromatic).not.toHaveProperty('bgpurple')
  })
})
