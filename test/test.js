/* eslint-disable */

import fs from 'fs';
import postcss from 'postcss';
import test    from 'ava';
import plugin from '../src/index.js';

function run(t, input, output, opts = { }) {
  return postcss([ plugin(opts) ]).process(input)
    .then(function(result) {
      var actual = JSON.parse(fs.readFileSync(opts.output, 'utf8'));
      t.deepEqual(actual, output);
      t.deepEqual(result.warnings().length, 0);
    });
}

test('outputs json data', t => {
  var css = fs.readFileSync('./sample.css', 'utf8');

  // Expected output from sample.css
  var result = {
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
  };
  return run(t, css, result, { output: './output.json' });
});
