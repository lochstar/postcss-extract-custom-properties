# postcss-extract-custom-properties

[PostCSS] plugin to extract [CSS Custom Properties] information.

```json
{
  "variableName": {
    "css-property-name": ["#selector1", ".selector2", "..."]
  }
}
```

# Turns this
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

# In to this
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
To create a fallback for browsers that do not support [CSS Custom Properties]. Useful for dynamic themeing.

# Example
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

Replace the variable placeholders (`@baseColor`, `@sizeH1` and `@accentColor`).

Now we can target all selectors that references this variable.

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

// Target style eleemnt
var baseColorStyleElem = document.getElementById('var-baseColor');

// Replace innerHTML value with updated CSS
baseColorStyleElem.innerHTML = newBaseColorString;
```

## Usage
```js
var extractCustomProperties = require('postcss-extract-custom-properties');

postcss([
  extractCustomProperties({
    output: './your-output.json'
  })
])
```

See [PostCSS] docs for examples for your environment.

[PostCSS]: https://github.com/postcss/postcss
[CSS Custom Properties]: https://www.w3.org/TR/css-variables/
