'use strict'

/* global describe it */
/* eslint no-unused-expressions: 0 */

const expect = require('chai').expect

describe('Test common.js', function () {
  const common = require('../../../lib/common.js')

  it('isObject', function () {
    expect(common.isObject({ hello: 'world' })).to.be.true
    expect(common.isObject(['hello', { world: ':)' }])).to.be.false
    expect(common.isObject('HelloWorld')).to.be.false
  })

  it('mergeObject', function () {
    const reference = {
      name: 'reference',
      test: 'NotRedefined',
      categories: {
        list: {
          items: {
            colors: ['red', 'blue'],
            backgrounds: ['green', 'yellow']
          }
        }
      },
      truetest: {
        opts: false,
        rewrite: false
      }
    }

    const assignable = {
      name: 'assignable',
      categories: {
        list: {
          items: {
            colors: ['purple', 'blue'],
            backgrounds: true
          }
        }
      },
      truetest: true,
      supplement: 'NotNeedIt'
    }

    const response = {
      name: 'assignable',
      test: 'NotRedefined',
      categories: {
        list: {
          items: {
            colors: ['red', 'blue', 'purple'],
            backgrounds: ['green', 'yellow']
          }
        }
      },
      truetest: {
        opts: false,
        rewrite: false
      }
    }

    const merged = common.mergeObject(reference, assignable)
    expect(merged).deep.equal(response)
  })

  it('orderObject', function () {
    const test = {
      e: '',
      l: '',
      o: '',
      n: '',
      m: '',
      u: '',
      s: '',
      k: ''
    }

    const response = {
      e: '',
      k: '',
      l: '',
      m: '',
      n: '',
      o: '',
      s: '',
      u: ''
    }

    const ordered = common.orderObject(test)
    expect(ordered).to.be.deep.equal(response)
  })

  it('copyObject', function () {
    const obj = {
      name: 'example',
      deep: {
        list: {
          valid: true
        }
      }
    }

    const copy = common.copyObject(obj)

    expect(copy).to.be.deep.equal(obj)

    copy.name = 'copy'
    copy.deep.list.valid = false

    expect(obj.name === 'example').to.be.true
    expect(obj.deep.list.valid).to.be.true
  })

  it('isArrayOfStrings', function () {
    expect(common.isArrayOfStrings(['a', 'b'])).to.be.true
    expect(common.isArrayOfStrings([true, 'a', 'b'])).to.be.false
    expect(common.isArrayOfStrings(['a', true, 'b'])).to.be.false
    expect(common.isArrayOfStrings(['a', 'b', 42])).to.be.false
  })

  it('groupStringsOfArray', function () {
    const simple = ['a', 'b', 'c']
    const mixed = ['a', 'b', 42, 'c', 'd']
    const simpleTest = common.groupStringsOfArray(simple)
    const mixedTest = common.groupStringsOfArray(mixed)

    expect(simpleTest[0]).to.be.equal('abc')
    expect(mixedTest[0]).to.be.equal('ab')
    expect(mixedTest[2]).to.be.equal('cd')
  })
})
