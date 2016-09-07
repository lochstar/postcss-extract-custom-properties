import fs from 'fs';
import postcss from 'postcss';
import test    from 'ava';
import plugin from '../index.js';

function run(t, input, output, warnings = 0) {
    return postcss([ plugin() ]).process(input)
        .then(function (result) {
            t.deepEqual(output, result.contents);
            t.deepEqual(result.warnings().length, warnings);
        });
}

test('extracts custom properties from css', t => {
    var css = fs.readFileSync('./input.css', 'utf8');
    var result = fs.readFileSync('./output.json', 'utf8');
    return run(t, css, JSON.parse(result));
});

test('does not duplicate selectors', t => {
    var css1 = fs.readFileSync('./input.css', 'utf8');
    var css2 = fs.readFileSync('./input2.css', 'utf8');
    var combined = css1 + css2;

    // Expected output from input.css & input2.css
    var result = {
        dashedColor: {
            'color': ['a'],
            'background-color': ['.class2:after']
        },
        dividerColor: {
            'border-color': ['code'],
            'color': ['.class3']
        },
        baseColor: {
            'color': ['.class1'],
            'border-color': ['.class1']
        },
        sizeH1: {
            'font-size': ['.class1']
        },
        camelColor: {
            color: ['.class2', '.class4:not(:first-child)', '.classCamel']
        }
    };
    return run(t, combined, result);
});

test('ignores invalid properties', t => {
    var css = `
        .invalid { border: 1px solid var(--base-color); }
        .valid1 { border-color: var(--base-color); }
        .valid2 { border-color: var(--base-color); }
        .invalid2 { color: contrast(var(--base-color)); }
    `;
    var result = {
        baseColor: {
            'border-color': ['.valid1', '.valid2']
        }
    };
    return run(t, css, result, 2);  // 2 warnings
});
