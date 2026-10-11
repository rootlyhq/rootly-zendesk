const path = require('path')
const fs = require('fs')
const { Compilation, sources } = require('webpack')
const JS_INDENT = 2

const marketplaceKeys = [
  'name',
  'description',
  'short_description',
  'long_description',
  'installation_instructions',
  'parameters'
]

class TranslationsPlugin {
  constructor (options) {
    this.options = options
  }

  // Defines `apply` method in it's prototype.
  apply (compiler) {
    // Specifies webpack's event hook to attach itself.
    compiler.hooks.thisCompilation.tap('TranslationsPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: 'TranslationsPlugin', stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        () => {
          const files = fs.readdirSync(this.options.path).filter(f => f.endsWith('.json'))
          files.forEach(filename => {
            const { name, source } = buildMarketplaceTranslationFile(filename, this.options.path)
            compilation.emitAsset(name, new sources.RawSource(source))
          })
        }
      )
    })
  }
}

function buildMarketplaceTranslationFile (filename, filepath) {
  let translationsInput
  try {
    translationsInput = JSON.parse(fs.readFileSync(path.resolve(filepath, filename)))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  return {
    name: `translations/${filename}`,
    source: extractMarketplaceTranslation(translationsInput, filename)
  }
}

function extractMarketplaceTranslation (translations, filename) {
  const translationsOutput = {
    _warning: `AUTOMATICALLY GENERATED FROM $/src/translations/${filename} - DO NOT MODIFY THIS FILE DIRECTLY`,
    app: {}
  }

  marketplaceKeys.forEach(
    key => {
      if (translations.app[key]) translationsOutput.app[key] = translations.app[key]
    }
  )

  return JSON.stringify(translationsOutput, null, JS_INDENT)
}

module.exports = TranslationsPlugin
