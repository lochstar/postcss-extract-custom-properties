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
    if (!opts.output) {
      opts.output = './property-selectors.json';
    }

    function plugin(css, result) {
      var selectors = {};

      // resolve custom properties (css variables)
      css.walkDecls(function(decl) {
        var value = decl.value;

        // skip values that don’t contain css var functions
        if (!value || value.indexOf('var(') === -1) {
          return;
        }

        // Extract variable name & convert to camelCase
        // e.g. --base-color -> baseColor
        var varName = value.replace('var(--', '').replace(')', '');
        var varNameCamel = dashedToCamel(varName);

        // Create object
        // TODO: tidy this up
        if (selectors[varNameCamel]) {
          // Create empty array if needed
          if (!selectors[varNameCamel][decl.prop]) {
            selectors[varNameCamel][decl.prop] = [];
          }
          selectors[varNameCamel][decl.prop].push(decl.parent.selector);
        // Create new property
        } else {
          selectors[varNameCamel] = {
            [decl.prop]: [decl.parent.selector]
          };
        }
      });

      // Write output JSON
      result.json = JSON.stringify(selectors, null, '  ');
      fs.writeFileSync(opts.output, result.json);
    }

  return plugin;
});
