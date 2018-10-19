const TAG = '\x1b['
const CLOSER = '\x1b[0m'

const TYPES = {
  fg: '38;2',
  bg: '48;2'
}

const BASE = [
  'black',
  'blue',
  'cyan',
  'green',
  'red',
  'white',
  'yellow'
]

module.exports = {
  TAG,
  CLOSER,
  TYPES,
  BASE
}
