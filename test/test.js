/* eslint-disable */

import fs from 'fs';
import postcss from 'postcss';
import test    from 'ava';
import plugin from '../index.js';

function run(t, input, output, opts = { }) {
  return postcss([ plugin(opts) ]).process(input)
    .then(function(result) {
      t.deepEqual(output, result.json);
      t.deepEqual(result.warnings().length, 0);
    });
}

test('outputs json data', t => {
  var css = fs.readFileSync('./sample.css', 'utf8');

  // Expected output from sample.css
  // Indentation is important
  var result = `{
  "dashedColor": {
    "color": [
      "a"
    ],
    "background-color": [
      ".class2:after"
    ]
  },
  "dividerColor": {
    "border-color": [
      "code"
    ],
    "color": [
      ".class3"
    ]
  },
  "baseColor": {
    "color": [
      ".class1"
    ]
  },
  "sizeH1": {
    "font-size": [
      ".class1"
    ]
  },
  "camelColor": {
    "color": [
      ".class2",
      ".class4:not(:first-child)",
      ".classCamel"
    ]
  }
}`;

  return run(t, css, result, { output: './output.json' });
});

test('outputs minified json data', t => {
  var css = fs.readFileSync('./sample.css', 'utf8');

  // Expected output from sample.css
  var result = `{"dashedColor":{"color":["a"],"background-color":[".class2:after"]},"dividerColor":{"border-color":["code"],"color":[".class3"]},"baseColor":{"color":[".class1"]},"sizeH1":{"font-size":[".class1"]},"camelColor":{"color":[".class2",".class4:not(:first-child)",".classCamel"]}}`;
  return run(t, css, result, { output: './output-min.json', minify: true });
});

test('handle multiple inputs', t => {
  var css1 = fs.readFileSync('./sample.css', 'utf8');
  var css2 = fs.readFileSync('./sample2.css', 'utf8');

  // Expected output from sample.css & sample2.css
  // Indentation is important
  var result = `{
  "dashedColor": {
    "color": [
      "a"
    ],
    "background-color": [
      ".class2:after"
    ]
  },
  "dividerColor": {
    "border-color": [
      "code"
    ],
    "color": [
      ".class3"
    ]
  },
  "baseColor": {
    "color": [
      ".class1"
    ],
    "border-color": [
      ",.class1"
    ]
  },
  "sizeH1": {
    "font-size": [
      ".class1"
    ]
  },
  "camelColor": {
    "color": [
      ".class2",
      ".class4:not(:first-child)",
      ".classCamel"
    ]
  }
}`;
  return run(t, [css1, css2], result, { output: './output-multiple.json' });
});

test('ignore invalid property', t => {
  var css = '.class1 { border: 1px solid var(--base-color); }';
  var result = '{}';
  return run(t, css, result, { output: './test4-min.json', minify: true });
});
