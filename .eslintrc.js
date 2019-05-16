module.exports = {
  root: true,
  extends: 'standard',
  plugins: [
    'standard',
    'promise'
  ],
  rules: {
    'no-control-regex': 0,
    'no-global-assign': 0
  },
  env: {
    node: true,
    jest: true
  }
}
