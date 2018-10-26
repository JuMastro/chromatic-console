module.exports = {
  notify: true,
  verbose: true,
  rootDir: '../',
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'html', 'text'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
