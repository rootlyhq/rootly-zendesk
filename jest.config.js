module.exports = {
  verbose: true,
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  testEnvironment: 'jsdom',
  setupFiles: ['./jest/setup.js'],
  collectCoverage: true,
  globals: {
    ZAFClient: {
      init: () => {}
    }
  },
  moduleNameMapper: {
    'react-merge-refs': '<rootDir>/jest/mocks/react-merge-refs.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@zendeskgarden)/)'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/spec'
  ],
  roots: ['./spec']
}
