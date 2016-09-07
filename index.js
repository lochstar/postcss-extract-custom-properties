// dependencies
var pcss = require('postcss');

// converts property-name to propertyName
function dashedToCamel(str) {
    return str.replace(/-([a-z])/g, function (m, w) {
        return w.toUpperCase();
    });
}

// plugin
module.exports = pcss.plugin('postcss-extract-custom-properties', function () {

    function plugin(css, result) {
        var vars = {};

        // resolve custom properties (css variables)
        css.walkDecls(function (decl) {
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
                result.warn('Ignored short-hand property', {
                    node: decl,
                    word: varName
                });
                return;
            }

            // Skip if var() is inside a mixin function
            if (varName.indexOf('(') >= 0) {
                result.warn('Ignored invalid variable name', {
                    node: decl,
                    word: varName
                });
                return;
            }

            // varName exists in object
            if (vars[varNameCamel]) {
                // Create array if it does not exist
                if (!vars[varNameCamel][propertyName]) {
                    vars[varNameCamel][propertyName] = [];
                }

                // Avoid duplicating vars
                if (vars[varNameCamel][propertyName]
                    .indexOf(selectorName) === -1) {
                    vars[varNameCamel][propertyName].push(selectorName);
                }

            // Create new property
            } else {
                vars[varNameCamel] = {
                    [propertyName]: [selectorName]
                };
            }
        });

        result.contents = vars;
    }

    return plugin;
});
