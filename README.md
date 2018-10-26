<h1 align="center">
  <p>chromatic-console</p>
</h1>

<p align="center">🌈 Make your node dev logs rainbow... :)</p>

<p align="center">
  <a href="https://github.com/JuMastro/chromatic-console" alt="Latest Release">
    <img src="https://img.shields.io/github/release/JuMastro/chromatic-console.svg">
  </a>
  <a alt="Build Status" href="https://travis-ci.com/JuMastro/chromatic-console">
    <img src="https://img.shields.io/travis/JuMastro/chromatic-console.svg">
  </a>
  <a alt="Dev Dependencies" href="https://github.com/JuMastro/chromatic-console/blob/master/package.json">
    <img src="https://img.shields.io/david/dev/JuMastro/chromatic-console.svg">
  </a>
  <a alt="Test Coverage" href="https://codeclimate.com/github/JuMastro/chromatic-console/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/b63a61e64de2592f5512/test_coverage">
  </a>
  <a alt="Maintainability" href="https://codeclimate.com/github/JuMastro/chromatic-console/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/b63a61e64de2592f5512/maintainability">
  </a>
</p>

<h5 align="center">
  <p>DEVELOPMENT ONLY</p>
</h5>

## Getting Started

Install with [`npm`](https://www.npmjs.com/):
```
npm install -D chromatic-console
```
The minimum version of Node to use chromatic-console is `v8.0.0`.

This is what a basic use of the lib could look like, note that in the example below, the configuration present in the call is the equivalent of the default configuration.

```javascript
const chromatic = require('chromatic-console')

const chromatic = Chromatic({
  reload: false,
  styles: {
    flat: true,
    complete: false,
    include: false
  },
  console: {
    external: true,
    seed: true,
    details: {
      log: null,
      info: 'cyan',
      warn: 'yellow',
      error: 'red'
    }
  }
})

// Say `Hello red world` with red color
console.log(chromatic.red('Hello red world'))
chromatic.error('Hello red World')
console.error('Hello red world')

// Say `Error` with red & bright
console.log(chromatic.bright(chromatic.red('Error')))
chromatic.error(chromatic.bright('Error'))
console.error(chromatic.bright('Error'))

// For multi arguments includes other(s) type(s) than string, use deconstruct syntax.
console.log(...chromatic.red('str', { obj: true }, 'str'))
```

## Options

Chromatic take as parameter an object that can include:

- `reload [Boolean]` - an option to reload the components while Chromatic is called.

- `styles [Object]` - the part of the configuration dedicated for styles updates.

  - `flat [Boolean]` - when `true` it return flat stylizer object function, else functions are stored on properties `formats`, `colors` and `backgrounds`.

  - `complete [Boolean]` - when `true` it return a complete colors list from ~256 xterm colors.

  - `include [null|Array]` - an option to load specifics colors by name in case of `complete` is not `true`.

- `console [Object]` - the part of the configuration dedicated for console updates.

  - `external [Boolean]` - when `true`, output include an updated copy of console methods.

  - `seed [Boolean]` - when `true`, it rewrite the original console methods with updated methods.

  - `details [Object]` - list of selected styles for new logs messages (use name of color from `maps/colors.json`).

    - `log [null|String]` - when not `null` it change the colors of ouputs strings from `log` function.

    - `info [null|String]` - when not `null` it change the colors of ouputs strings from `info` function.

    - `warn [null|String]` - when not `null` it change the colors of ouputs strings from `warn` function.

    - `error [null|String]` - when not `null` it change the colors of ouputs strings from `error` function.

## API

### Formats

- `reset` - Reset style to default.

- `bright` - Make bold.

- `dim` - Make dim.

- `underline` - Make underline.

- `blink` - Make blink. (WIP)

- `reverse` - Reverse background and foreground colors.

- `hidden` - Make hidden.

### Colors & Backgrounds

A list of 256 colors (xterm) are available.
To access it just load the `chromatic` module and know the name of the color you need.

```javascript
chromatic.red('I am red.')
```

For backgrounds colors, add `bg` before the color name

```javascript
chromatic.bgblue('I have a blue background.')
```

If you have change the default parameters to choose `false` for 
the option `styles.flat` then go first by the type of transformations you are looking for.

```javascript
chromatic.backgrounds.yellow('I have a yellow background.')
```

See all colors [here](https://github.com/JuMastro/chromatic-console/blob/master/lib/maps/colors.json).

## Dev dependencies

- [Jest](https://github.com/mochajs/mocha) Delightful JavaScript Testing.
- [Eslint](https://github.com/eslint/eslint) Javascript linter.
