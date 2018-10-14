'use strict'

/* global describe it */
/* eslint no-unused-expressions: 0 */

const expect = require('chai').expect
const formatsMap = require('../../../lib/maps/formats.json')
const colorsMap = require('../../../lib/maps/colors.json')

const defaultFormats = Object.keys(formatsMap).map((key) => key.toLowerCase()).sort()
const defaultColors = ['black', 'blue', 'cyan', 'green', 'red', 'white', 'yellow']
const completeColors = Object.entries(colorsMap).map((item) => item.shift().toLowerCase())

const flatifyBackgroyndsKeys = function (backgrounds) {
  let flatify = []

  for (let background of backgrounds) {
    flatify.push(`bg${background}`)
  }

  return flatify
}

describe('Test styles.js', function () {
  const Styles = require('../../../lib/styles.js')

  it('Default call is valid', function () {
    const reference = [].concat(
      defaultFormats,
      defaultColors,
      flatifyBackgroyndsKeys(defaultColors)
    )

    expect(Object.keys(Styles())).to.be.deep.equal(reference)
  })

  it('Call with `flat=false` parameter is valid', function () {
    const reference = [defaultFormats, defaultColors, defaultColors]
    const styles = Styles({ flat: false })
    const stylesKeys = Object.entries(styles).map((item) => Object.keys(item.pop()))
    expect(stylesKeys).to.be.deep.equal(reference)
  })

  it('Call with `complete=true` parameter is valid', function () {
    const reference = [].concat(
      defaultFormats,
      completeColors,
      flatifyBackgroyndsKeys(completeColors)
    )

    expect(Object.keys(Styles({ complete: true }))).to.be.deep.equal(reference)
  })

  it('Call with `include=["purple"]` parameter is valid', function () {
    const styles = Styles({ include: ['purple'] })
    expect(styles).to.haveOwnProperty('purple')
    expect(styles).to.haveOwnProperty('bgpurple')
  })

  it('Call with `flat=false, complete=true` parameters are valids', function () {
    const reference = [defaultFormats, completeColors, completeColors]
    const styles = Styles({ flat: false, complete: true })
    const stylesKeys = Object.entries(styles).map((item) => Object.keys(item.pop()))
    expect(stylesKeys).to.be.deep.equal(reference)
  })

  it('Stylizer function work fine', function () {
    const styles = Styles()
    const red = styles.red('red')
    const redConcat = styles.red('red', 'red')
    const redObj = styles.red({ test: 'a' })
    const redMixed = styles.red('str', { obj: true }, 'is-done')

    expect(typeof red === 'string').to.be.true
    expect(typeof redConcat === 'string').to.be.true
    expect(typeof redObj === 'object').to.be.true
    expect(typeof redMixed === 'object').to.be.true
    expect(redMixed.length === 3).to.be.true
  })

  it('Stylizer functions return valid responses', function () {
    const styles = Styles()
    const simple = styles.red('simple')
    const double = styles.red('hello', 'world')
    const multi = styles.bright(double, 'onlyBright')

    expect(simple).to.be.equal('\u001b[38;2;255;0;0msimple\u001b[0m')
    expect(double).to.be.equal('\u001b[38;2;255;0;0mhello\u001b[38;2;255;0;0mworld\u001b[0m')
    expect(multi).to.be.equal('\u001b[1m\u001b[38;2;255;0;0mhello\u001b[38;2;255;0;0mworld\u001b[0m\u001b[1monlyBright\u001b[0m')
  })
})
