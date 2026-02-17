/* eslint-env jest */
const fs = require('fs')
const path = require('path')
const { flatten } = require('../webpack/translations-loader')

const translationsDir = path.join(__dirname, '../src/translations')
const enTranslations = JSON.parse(fs.readFileSync(path.join(translationsDir, 'en.json'), 'utf8'))
const enKeys = Object.keys(flatten(enTranslations)).sort()

const translationFiles = fs.readdirSync(translationsDir).filter(f => f.endsWith('.json') && f !== 'en.json')

describe('Translations', () => {
  test.each(translationFiles)('%s has valid JSON', (file) => {
    const content = fs.readFileSync(path.join(translationsDir, file), 'utf8')
    expect(() => JSON.parse(content)).not.toThrow()
  })

  test.each(translationFiles)('%s has the same keys as en.json', (file) => {
    const content = JSON.parse(fs.readFileSync(path.join(translationsDir, file), 'utf8'))
    const keys = Object.keys(flatten(content)).sort()
    expect(keys).toEqual(enKeys)
  })
})
