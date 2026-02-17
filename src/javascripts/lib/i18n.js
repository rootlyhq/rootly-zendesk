import TranslationsLoader from '../../../webpack/translations-loader'

let translations = {}

function t (key, vars = {}) {
  let txt = translations[key]
  Object.keys(vars).forEach((k) => {
    txt = txt.replace(`%{${k}}`, vars[k])
  })
  return txt
}

function loadTranslations (locale) {
  const loaded = require(`../../translations/${locale.split('-')[0]}.json`)
  translations = TranslationsLoader.flatten(loaded)
}

export default { t, loadTranslations }
