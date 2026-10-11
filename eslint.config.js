const neostandard = require('neostandard')
const globals = require('globals')

module.exports = [
  { ignores: ['dist/**', 'coverage/**'] },
  ...neostandard(),
  {
    files: ['src/**/*.js', 'spec/**/*.js'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } }
    }
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser, ZAFClient: 'readonly' }
    }
  },
  {
    files: ['spec/**/*.js', 'jest/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.jest }
    }
  }
]
