<h1 align="center">
  <p>chromatic-console</p>
</h1>

<p align="center">🌈 Make your node dev logs rainbow... :)</p>

<p align="center">
  <a alt="Build Status" href="https://travis-ci.com/JuMastro/chromatic-console">
    <img src="https://img.shields.io/travis/JuMastro/chromatic-console.svg?longCache=true">
  </a>
  <a alt="Npm version" href="https://www.npmjs.com/package/chromatic-console?activeTab=versions">
    <img src="https://img.shields.io/npm/v/chromatic-console.svg?longCache=true&logo=npm">
  </a>
  <a alt="Node requierement version" href="https://github.com/JuMastro/chromatic-console/blob/master/package.json">
    <img src="https://img.shields.io/node/v/chromatic-console.svg?longCache=true">
  </a>
  <a alt="Dependencies" href="https://github.com/JuMastro/chromatic-console/blob/master/package.json">
    <img src="https://img.shields.io/david/JuMastro/chromatic-console.svg?longCache=true">
  </a>
  <a alt="Test Coverage" href="https://codeclimate.com/github/JuMastro/chromatic-console/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/37437a701dbb9584f5e4/test_coverage">
  </a>
  <a alt="Maintainability" href="https://codeclimate.com/github/JuMastro/chromatic-console/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/37437a701dbb9584f5e4/maintainability">
  </a>
</p>

<h5 align="center"><p>DEVELOPMENT ONLY</p></h5>

## Getting Started

Install with [`npm`](https://www.npmjs.com/):
```
npm install -D chromatic-console
```
The minimum version of Node to use chromatic-console is `v12.0.0`.

## Examples
```javascript
const Chromatic = require('chromatic-console')

// With default options
const chromatic = new Chromatic({
  adds: {},
  stylizer: null,
  replace: false,
  stdout: null,
  stderr: null,
  levels: {
    error: ['err', 'red'],
    warn: ['out', 'bright.yellow'],
    info: ['out', 'bright'],
    log: null, // stdout by default
    debug: null
  }
})

// Create your own colors
const chromatic = new Chromatic({
  adds: { custom: [140, 70, 200] },
  levels: {
    custom: ['out', 'bright.custom']
  }
})

chromatic.log('HelloWorld')
chromatic.bright('HelloWorld')
chromatic.custom('HelloWorld')
```

## Options

#### The `Chromatic` options object is a wrap of `Stylizer` & `Consilizer` options.

### `Stylizer` options:

Stylizer constructor argument is an object that may contains:
  - `adds`: An object that may include new colors.

### `Consolizer` options:

Consolizer constructor argument is an object that may contains:
  - `stylizer`: A custom stylizer to provide (default: null).
  - `replace`: A state to define if it's replace the global console (default: false).
  - `stdout`: A Stream to send std outputs (default: process.stdout).
  - `stderr`: A Stream to send err outputs (default: process.stderr).
  - `levels`: An object that represent the provided levels to consolizer.
    - `error`: The error def (default: ['err', red]).
    - `warn`: The warn def (default: ['out', 'bright.yellow']).
    - `info`: The info def (default: ['out', 'bright']).
    - `log`: The log def (default: null).
    - `debug`: The debug def (default: null).

## API

### Chromatic

Chromatic inherit builded methods from Consolizer to logs object, levels and multiple styles.

### Stylizer

  - `addColor(name, [rgb])` Add a color to the instance.
  - `removeColor(name)` Remove a color from the instance.
  - `pipe(...styles)` Create a custom style from a pipe of styles.
  - `createInspector(opts)` Create a custom object inspector.
  - `createSet(raw, flat)` Create set of usables from Stylizer. If `raw` options is true, the return is a string formatable style, else is a function that wrap the style.
  - `stylize(...items)` Apply style to a list of items.
  - `stylizeObject(obj)` Apply a inspected style to an object.

### Consolizer

- `buildLogsMethods()` Create a logs methods for the stylizer registered styles.
- `logObject(obj)` Log an object with the inspector format.
- `getConsoleMethods() Return a instance logs std methods. 

## More examples

```javascript
const chromatic = new Chromatic()

chromatic.yellow('I m yellow')

chromatic.bgyellow('I have a yellow background')

chromatic.bright('I m bright')

chromatic.log('By default I m stdout')

chromatic.error('By default I m red stderr')

chromatic.logObject(aDeepObject)
```

Create pipe style
```javascript
const chromatic = new Chromatic({ adds: { custom: [0, 150, 0] } })
const stylizer = chromatic.getStylizer() // => get chromatic._stylizer
const styles = stylizer.styles
const custom = stylizer.pipe([
  styles.modifiers.bright,
  styles.foregrounds.custom
])

chromatic.log(custom('HelloWorld'))
```

Full custom
```javascript
const stylizer = new Chromatic.Stylizer({
  adds: {
    custom1: [150, 70, 200]
  }
})

// Other way to add color.
stylizer.addColor('custom2', [200, 0, 100])

const chromatic = new Chromatic({ stylizer })

chromatic.log('HelloWorld')
chromatic.bright('HelloWorld')
chromatic.custom1('HelloWorld')
chromatic.custom2('HelloWorld')
```

## Styles

### Formats

- bright
- dim
- underline
- blink
- hidden

### Default colors

- black
- blue
- cyan
- green
- orange
- purple
- red
- white
- yellow

## Dev dependencies

- [Jest](https://github.com/facebook/jest) Delightful JavaScript Testing.
- [Eslint](https://github.com/eslint/eslint) Javascript linter.
