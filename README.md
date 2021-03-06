# postcss-extract-custom-properties [![Build Status](https://travis-ci.org/lochstar/postcss-extract-custom-properties.png)](https://travis-ci.org/postcss/lochstar/postcss-extract-custom-properties)

[PostCSS] plugin to extract [CSS Custom Properties] information.

```json
{
  "variableName": {
    "css-property-name": ["#selector1", ".selector2", "..."]
  }
}
```

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

# Why?

To create a fallback for browsers that do not support [CSS Custom Properties].

Useful for dynamic theming. See [Dynamic Custom Properties](#dynamic-custom-properties).

# Usage

```js
// dependencies
const fs = require('fs');
const postcss = require('postcss');
const extractCustomProperties = require('postcss-extract-custom-properties');

// css to be processed
const css = fs.readFileSync('input.css', 'utf8');

// file path to write results
const output = './build/output.json';

// process css using postcss-extract-custom-properties
postcss()
  .use(extractCustomProperties)
  .process(css, { from: undefined })
  .then((result) => {
    const data = result.contents;

    // Deal with warnings
    result.warnings().forEach((warn) => {
      console.warn(`${warn.text}: ${warn.word.toString()} (${warn.node.parent.selector})`)
    });

    // Write JSON string to file
    const string = JSON.stringify(data).replace(/ /g, '');
    fs.writeFileSync(output, string);
  });
```

## Constraints

- CSS Variables must not be used on a shortened property.

```css
.selector1 {
  border-color: var(--base-color);      // good
}

.selector2 {
  border: solid 1px var(--base-color);  // bad
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
const baseColorString = `
  a, .class2 li:first-child { color: @baseColor; }
  .class1 { background-color: @baseColor; }
`;

// Value to insert in place of placeholder
const newBaseColor = '#00CC00';

// Regex replace all occurances in string
const re = new RegExp('@baseColor', 'g');
const newBaseColorString = baseColorString.replace(re, newBaseColor);

// Style element to update
const baseColorStyleElem = document.getElementById('var-baseColor');

// Replace innerText value with updated CSS
baseColorStyleElem.innerText = newBaseColorString;
```

See [PostCSS] docs for examples for your environment.

[PostCSS]: https://github.com/postcss/postcss
[CSS Custom Properties]: https://www.w3.org/TR/css-variables/

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
