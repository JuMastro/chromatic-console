/* global describe it */
/* eslint no-unused-expressions: 0 */

const expect = require('chai').expect

describe('Test console.js', function () {
  const styles = require('../../../lib/restyles.js')()
  const Console = require('../../../lib/reconsole.js')

  const isFunction = (item) => typeof item === 'function'

  it('Default call is valid', function () {
    const app = Console({}, styles)

    for (let item in app) {
      expect(isFunction(app[item])).is.true
    }
  })

  it('Call with `external=false` parameter is valid', function () {
    const app = Console({ external: false }, styles)
    expect(Object.keys(app).length).is.equal(0)
  })
})
