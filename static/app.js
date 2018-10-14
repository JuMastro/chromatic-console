'use strict'

// Dev entrypoint

const options = {
  styles: {
    include: ['purple'],
    complete: false
  },
  console: {
    external: true
  }
}

console.time('styles')
const rainbow = require('../lib/index.js')(options)
console.log(rainbow.purple('ConsoleLogRainbow PurpleMessage'))
console.info('ConsoleInfo CyanMessage')
rainbow.error('RainbowError RedMessage')
console.timeEnd('styles')
