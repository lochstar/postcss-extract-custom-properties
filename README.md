# postcss-extract-custom-properties [![Build Status](https://travis-ci.org/lochstar/postcss-extract-custom-properties.png)](https://travis-ci.org/postcss/lochstar/postcss-extract-custom-properties)

[PostCSS] plugin to extract [CSS Custom Properties] information.

```json
{
  "variableName": {
    "css-property-name": ["#selector1", ".selector2", "..."]
  }
}
```

# Why?
To create a fallback for browsers that do not support [CSS Custom Properties].

Useful for dynamic themeing. See [Dynamic Custom Properties](dynamic-custom-properties).

# Installation
```console
npm install postcss-extract-custom-properties --save-dev
```

 Parses `input.css`:
 
```css
a {
  color: var(--base-color);
}

.class1 {
  background-color: var(--base-color);
  font-size: var(--size-h1);
}

.class2 li:first-child {
  color: var(--base-color);
  border-color: var(--accent-color);
}
```

in to `output.json`

```json
{
  "baseColor": {
    "color": ["a", ".class2 li:first-child"],
    "background-color": [".class1"]
  },
  "sizeH1": {
    "font-size": [".class1"]
  },
  "accentColor": {
    "border-color": [".class2 li:first-child"]
  }
}
```

# Usage
```js
// dependencies
var fs = require('fs');
var postcss = require('postcss');
var extractCustomProperties = require('postcss-extract-custom-properties');

// css to be processed
var css = fs.readFileSync('input.css', 'utf8');

// process css using postcss-extract-custom-properties
postcss([extractCustomProperties({ output: './css-variables.json', minify: true })])
  .process(css)
  .then(function(result) {
    var data = JSON.parse(result.json);
    var totalVars = Object.keys(data).length;

    console.log(`${totalVars} extracted: [${Object.keys(data)}]`);
    console.log(`Saved to: ${opts.output}`);
  });
```

### Options

#### `output`

Default: `'./property-selectors.json'`

File to write JSON output to.

#### `minify`

Default: `false`

Minifies the JSON output.

```js
postcss([extractCustomProperties({ minify: true })])
  .process(css)
```

## Constraints

- CSS Variables must not be used on a shortened property.

```css
.selector1 {
  border-color: val(--base-color);      // good
}

.selector2 {
  border: solid 1px val(--base-color);  // bad
}
```

# Dynamic Custom Properties
For browsers that do not support [CSS Custom Properties] and the `:root` selector.

Parse `output.json` in to `<style>` elements for each variable.

```html
<style id="var-baseColor">
  a, .class2 li:first-child { color: @baseColor; }
  .class1 { background-color: @baseColor; }
</style>

<style id="var-sizeH1">
  .class1 { font-size: @sizeH1; }
</style>

<style id="var-accentColor">
  .class2 li:first-child { border-color: @accentColor; }
</style>
```

Replace the variable placeholders (`@baseColor`, `@sizeH1` and `@accentColor` in the example above).

Now we can target all selectors that reference these variables.

To change the variable, we can replace the value programatically.

``` js
// Reference to CSS sring created from JSON
var baseColorString = `
  a, .class2 li:first-child { color: @baseColor; }
  .class1 { background-color: @baseColor; }
`;

// Value to insert in place of placeholder
var newBaseColor = '#00CC00';

// Regex replace all occurances in string
var re = new RegExp('@baseColor', 'g'); 
var newBaseColorString = baseColorString.replace(re, newBaseColor);

// Style eleemnt to update
var baseColorStyleElem = document.getElementById('var-baseColor');

// Replace innerHTML value with updated CSS
baseColorStyleElem.innerHTML = newBaseColorString;
```

See [PostCSS] docs for examples for your environment.

[PostCSS]: https://github.com/postcss/postcss
[CSS Custom Properties]: https://www.w3.org/TR/css-variables/
