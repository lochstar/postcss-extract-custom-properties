const fs = require('fs')
const path = require('path')
const postcss = require('postcss')
const plugin = require('../index.js')

async function run (input, output, opts, warnings = 0) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.contents).toEqual(output)
  expect(result.warnings()).toHaveLength(warnings)
}

it('extracts custom properties from css', async () => {
  let css = fs.readFileSync(path.resolve(__dirname, './input.css'), 'utf8')
  let result = fs.readFileSync(path.resolve(__dirname, './output.json'), 'utf8')
  await run(css, JSON.parse(result))
})

it('does not duplicate selectors', async () => {
  let css1 = fs.readFileSync(path.resolve(__dirname, './input.css'), 'utf8')
  let css2 = fs.readFileSync(path.resolve(__dirname, './input2.css'), 'utf8')
  let combined = css1 + css2

  // Expected output from input.css & input2.css
  let result = {
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
  }
  await run(combined, result)
})

test('ignores invalid properties', async () => {
  let css = `
    .invalid { border: 1px solid var(--base-color); }
    .valid1 { border-color: var(--base-color); }
    .valid2 { border-color: var(--base-color); }
    .invalid2 { color: contrast(var(--base-color)); }
    @keyframes colourAnimation {
        from { fill: var(--dark-base-color) }
        50% { fill: var(--light-base-color) }
        to { fill: var(--base-color) }
    }
  `

  let result = {
    baseColor: {
      'border-color': ['.valid1', '.valid2']
    }
  }
  await run(css, result, {}, 5) // 5 warnings
})
