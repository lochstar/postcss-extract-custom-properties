// dependencies
const pcss = require('postcss')

// converts property-name to propertyName
function dashedToCamel (str) {
  return str.replace(/-([a-z])/g, (m, w) => {
    return w.toUpperCase()
  })
}

// ignore keyframe selectors
const ignoreSelectors = ['to', 'from']

// plugin
module.exports = pcss.plugin('postcss-extract-custom-properties', () => {
  function plugin (css, result) {
    let count = 0
    let vars = {}

    // resolve custom properties (css variables)
    css.walkDecls(decl => {
      let value = decl.value

      // Skip values that don’t contain css let functions
      if (!value || !value.includes('var(')) {
        return
      }

      // CSS selector name (.class1, #container2, etc.)
      let selectorName = decl.parent.selector

      // CSS property name (border-color, font-size, etc.)
      let propertyName = decl.prop

      // Extract variable name & convert to camelCase
      // e.g. --base-color -> baseColor
      let varName = value.replace('var(--', '').replace(')', '')
      let varNameCamel = dashedToCamel(varName)

      // Skip if var() is not on a short-hand selector
      if (varNameCamel.includes(' ')) {
        result.warn('Ignored short-hand property', {
          node: decl,
          word: varName
        })
        return
      }

      // Skip if var() is inside a mixin function
      if (varName.includes('(')) {
        result.warn('Ignored invalid variable name', {
          node: decl,
          word: varName
        })
        return
      }

      // Skip keyframes
      if (
        ignoreSelectors.includes(selectorName) ||
        selectorName.includes('%')
      ) {
        result.warn('Ignored variable in keyframe', {
          node: decl,
          word: varName
        })
        return
      }

      // varName exists in object
      if (vars[varNameCamel]) {
        // Create array if it does not exist
        if (!vars[varNameCamel][propertyName]) {
          vars[varNameCamel][propertyName] = []
        }

        // Avoid duplicating vars
        if (!vars[varNameCamel][propertyName]
          .includes(selectorName)) {
          vars[varNameCamel][propertyName].push(selectorName)
        }

        // Create new property
      } else {
        vars[varNameCamel] = {
          [propertyName]: [selectorName]
        }
      }

      // Incremenet selector count
      count++
    })

    result.contents = vars
    result.messages.push({
      type: 'selector-count',
      plugin: 'postcss-extract-custom-properties',
      count
    })
  }

  return plugin
})
