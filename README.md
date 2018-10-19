# chromatic-console
Make your node devlogs rainbow... :)

> DEVELOPMENT ONLY

## Install

```
npm install -D chromatic-console 
```

## Examples
```javascript
const chromatic = require('chromatic-console')

// Default call look like this... Chromatic().
const chromatic = Chromatic({
  reload: false,
  console: {
    external: true,
    seed: true,
    details: {
      log: null,
      info: 'cyan',
      warn: 'yellow',
      error: 'red'
    }
  },
  styles: {
    flat: true,
    complete: false,
    include: false
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


`options.reload [boolean]` Option to reload the lib. All pseudo components are reloaded.

`options.styles [object]` Styles options.

`options.console [object]` Console options.

**styles**

`styles.flat [boolean]` Get styles functions on root of rainbow class.

`styles.complete [boolean]` Get styles from all x-term colors.

`styles.include [Array|null]` Add colors by name from map.

**console**

`console.external [boolean]` Get prints functions on lib object.

`console.seed [boolean]` Seed initial console with updated methods.

`console.details [object]` Details colors of updated methods.

**console.details**

`details.log [string|null]` Enable and change colors of console.log function.

`details.info [string|null]` Enable and change colors of console.info function.

`details.warn [string|null]` Enable and change colors of console.warn function.

`details.error [string|null]` Enable and change colors of console.error function.

## API

### Formats

`reset` Reset current openned styles.

`bright` Make bright.

`dim` Make dim.

`underline` Make underline.

`blink` Make blink. (WIP)

`reverse` Reverse background and foreground colors.

`hidden` Make hidden.

### Colors & Backgrounds

All 256 standards colors are registered from colors map.
To use it juste find her name and call it from `chromatic` module.

```javascript
chromatic['colorname']('Hello')
```

If you need to apply a background color and the `flat` option is true,
you must precede the name of the color with `bg`,
else if flat is false just call the color from `chromatic.backgrounds` object.

```javascript
# Flat
chromatic['bgcolorname']('Hello')

# No flat
chromatic.backgrounds['colorname']('Hello')
```

## Colors name

See all colors [here](https://github.com/JuMastro/chromatic-console/blob/master/lib/maps/colors.json).


## Requirements

```
Node >= 8.0.0
Npm  >= 6.0.0
```

## Dev dependencies

- [mocha](https://github.com/mochajs/mocha) Simple, flexible, fun javascript test framework.
- [chai](https://github.com/chaijs/chai) BDD / TDD assertion framework.
- [eslint](https://github.com/eslint/eslint) Javascript linter.
