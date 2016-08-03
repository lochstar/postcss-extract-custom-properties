/* eslint-disable */

var postcss = require('postcss');
var path = require('path');
var fs = require('fs');

function dashedToCamel(str) {
  return strCamel = str.replace(/-([a-z])/g, function (m, w) {
    return w.toUpperCase();
  });
}

module.exports = postcss.plugin('postcss-extract-custom-properties', function(opts) {
    opts = opts || {};

    // Default output file
    if (!opts.output) {
      opts.output = './property-selectors.json';
    }

    function plugin(css, result) {
      var selectors = {};

      // resolve custom properties (css variables)
      css.walkDecls(function(decl) {
        var value = decl.value;

        // Skip values that don’t contain css var functions
        if (!value || value.indexOf('var(') === -1) {
          return;
        }

        // CSS selector name (.class1, #container2, etc.)
        var selectorName = decl.parent.selector;

        // CSS property name (border-color, font-size, etc.)
        var propertyName = decl.prop;

        // Extract variable name & convert to camelCase
        // e.g. --base-color -> baseColor
        var varName = value.replace('var(--', '').replace(')', '');
        var varNameCamel = dashedToCamel(varName);

        // Skip if var() is not on a short-hand selector
        if (varNameCamel.indexOf(' ') >= 0) {
          console.log(`Ignoring: ${selectorName}: ${varName}`);
          return;
        }

        // varName exists in object
        if (selectors[varNameCamel]) {
          // Create array if it does not exist
          if (!selectors[varNameCamel][propertyName]) {
            selectors[varNameCamel][propertyName] = [];
          }

          // Avoid duplicate selectors
          if (selectors[varNameCamel][propertyName].indexOf(selectorName) === -1) {
            selectors[varNameCamel][propertyName].push(selectorName);
          }
  
        // Create new property
        } else {
          selectors[varNameCamel] = {
            [propertyName]: [selectorName]
          };
        }
      });

      // Format output JSON
      if (opts.minify) {
        result.json = JSON.stringify(selectors).replace(/ /g, '');
      } else {
        result.json = JSON.stringify(selectors, null, '  ');
      }

      // Write JSON file
      fs.writeFileSync(opts.output, result.json);
    }

  return plugin;
});
