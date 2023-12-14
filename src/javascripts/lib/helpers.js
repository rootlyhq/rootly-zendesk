const version = require('../../../package.json').version

export function escapeSpecialChars (str) {
  if (typeof str !== 'string') throw new TypeError('escapeSpecialChars function expects input in type String')

  const escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }

  return str.replace(/[&<>"'`=]/g, function (m) { return escape[m] })
}
/**
 * {
 *   name: 'test app',
 *   author: {
 *     title: 'the author',
 *     value: 'mr programmer'
 *   },
 *   app: {
 *     instructions: 'install',
 *     steps: {
 *       click: 'this button'
 *     }
 *   }
 * }
 *
 * becomes
 *
 * {
 *   name: 'test app',
 *   author: 'mr programmer',
 *   app.instructions: 'install',
 *   app.steps.click: 'this button'
 * }
 */
/* eslint-disable array-callback-return */
function translationFlatten (object, currentKeys = []) {
  const res = {}

  Object.keys(object).map(
    key => {
      const value = object[key]

      if (typeof value === 'object') {
        if (value.title && value.value) {
          const flattenedKey = [...currentKeys, key].join('.')
          res[flattenedKey] = value.value
        } else {
          Object.assign(
            res,
            translationFlatten(value, [...currentKeys, key])
          )
        }
      } else {
        const flattenedKey = [...currentKeys, key].join('.')
        res[flattenedKey] = value
      }
    }
  )

  return res
}
/* eslint-enable array-callback-return */

export function debounce (fn, ms) {
  let timeout = null
  return (...args) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), ms)
  }
}
