describe('Test common.js', () => {
  const common = require('../../../lib/common.js')

  test('isObject', () => {
    expect(common.isObject({ hello: 'world' })).toBe(true)
    expect(common.isObject(['hello', { world: ':)' }])).toBe(false)
    expect(common.isObject('HelloWorld')).toBe(false)
  })

  test('mergeObject', () => {
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
    expect(merged).toEqual(response)
  })

  test('orderObject', () => {
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
    expect(ordered).toEqual(response)
  })

  test('copyObject', () => {
    const obj = {
      name: 'example',
      deep: {
        list: {
          valid: true
        }
      }
    }

    const copy = common.copyObject(obj)
    expect(copy).toEqual(obj)

    copy.name = 'copy'
    copy.deep.list.valid = false
    expect(obj.name === 'example').toBe(true)
    expect(obj.deep.list.valid).toBe(true)
  })

  test('isArrayOfStrings', () => {
    expect(common.isArrayOfStrings(['a', 'b'])).toBe(true)
    expect(common.isArrayOfStrings([true, 'a', 'b'])).toBe(false)
    expect(common.isArrayOfStrings(['a', { a: 'ok' }, 'b'])).toBe(false)
    expect(common.isArrayOfStrings(['a', 'b', 42])).toBe(false)
  })

  test('groupStringsOfArray', () => {
    const simple = ['a', 'b', 'c']
    const simpleTest = common.groupStringsOfArray(simple)
    expect(simpleTest[0]).toEqual('abc')

    const mixed = ['a', 'b', 42, 'c', 'd']
    const mixedTest = common.groupStringsOfArray(mixed)
    expect(mixedTest[0]).toEqual('ab')
    expect(mixedTest[2]).toEqual('cd')
  })

  test('capitalize', () => {
    expect(common.capitalize('test')).toEqual('Test')
    expect(common.capitalize('test test')).toEqual('Test test')
    expect(common.capitalize()).toEqual('')
  })
})
