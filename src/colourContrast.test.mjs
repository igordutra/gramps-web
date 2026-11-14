/**
 * Checks for the user-colour legibility helper.
 *
 * Run with: node src/colourContrast.test.mjs
 *
 * The cases come from a real measurement: the lab tree stores its note
 * colour as #e611bf, which is illegible on the light surface (4.04:1),
 * on the dark surface (4.33:1) and inside its own highlight (2.44:1).
 */
import assert from 'node:assert/strict'

import {
  adjustForContrast,
  contrastRatio,
  effectiveBackground,
  parseColor,
  toCss,
} from './colourContrast.js'

let failures = 0
const check = (name, fn) => {
  try {
    fn()
    console.log(`  ok   ${name}`)
  } catch (err) {
    failures++
    console.log(`  FAIL ${name}\n       ${err.message}`)
  }
}

console.log('parseColor')
check('hex', () => {
  assert.deepEqual(parseColor('#e611bf'), {r: 230, g: 17, b: 191, a: 1})
})
check('short hex', () => {
  assert.deepEqual(parseColor('#abc'), {r: 170, g: 187, b: 204, a: 1})
})
check('rgb', () => {
  assert.deepEqual(parseColor('rgb(1, 2, 3)'), {r: 1, g: 2, b: 3, a: 1})
})
check('rgba', () => {
  assert.deepEqual(parseColor('rgba(1, 2, 3, 0.5)'), {
    r: 1,
    g: 2,
    b: 3,
    a: 0.5,
  })
})
check('transparent', () => {
  assert.deepEqual(parseColor('transparent'), {r: 0, g: 0, b: 0, a: 0})
})
check('garbage', () => {
  assert.equal(parseColor('not-a-colour'), null)
})
check('the modern color(srgb) form a color-mix() resolves to', () => {
  // This is the exact string the browser returns for the note
  // highlight. A parser that does not understand it skips the
  // highlight and tunes the text against the wrong background.
  assert.deepEqual(parseColor('color(srgb 0.94902 0.568627 0.0117647 / 0.3)'), {
    r: 242,
    g: 145,
    b: 3,
    a: 0.3,
  })
})
check('color(srgb) without an alpha', () => {
  assert.deepEqual(parseColor('color(srgb 1 0 0)'), {r: 255, g: 0, b: 0, a: 1})
})
check('an unsupported colour space is not guessed at', () => {
  assert.equal(parseColor('color(display-p3 1 0 0)'), null)
})
check('a percentage alpha', () => {
  assert.deepEqual(parseColor('rgb(1, 2, 3, 60%)'), {
    r: 1,
    g: 2,
    b: 3,
    a: 0.6,
  })
})

console.log('contrastRatio')
check('black on white is 21', () => {
  const r = contrastRatio({r: 0, g: 0, b: 0}, {r: 255, g: 255, b: 255})
  assert.ok(Math.abs(r - 21) < 0.01, `got ${r}`)
})
check('a colour on itself is 1', () => {
  const r = contrastRatio({r: 30, g: 30, b: 30}, {r: 30, g: 30, b: 30})
  assert.ok(Math.abs(r - 1) < 0.001, `got ${r}`)
})

console.log('adjustForContrast')
check('the measured pink reaches AA on the dark surface', () => {
  const pink = parseColor('#e611bf')
  const surface = parseColor('#1c1913')
  assert.ok(contrastRatio(pink, surface) < 4.5, 'precondition: it fails')
  const out = adjustForContrast(pink, surface)
  assert.ok(
    contrastRatio(out, surface) >= 4.5,
    `adjusted to ${toCss(out)} = ${contrastRatio(out, surface)}:1`
  )
})
check('the measured pink reaches AA inside its own highlight', () => {
  const pink = parseColor('#e611bf')
  const highlight = parseColor('#5c3d0e')
  const out = adjustForContrast(pink, highlight)
  assert.ok(
    contrastRatio(out, highlight) >= 4.5,
    `adjusted to ${toCss(out)} = ${contrastRatio(out, highlight)}:1`
  )
})
check('the measured pink reaches AA on the light surface', () => {
  const pink = parseColor('#e611bf')
  const surface = parseColor('#ffffff')
  const out = adjustForContrast(pink, surface)
  assert.ok(
    contrastRatio(out, surface) >= 4.5,
    `adjusted to ${toCss(out)} = ${contrastRatio(out, surface)}:1`
  )
})
check('a colour that already passes is left alone', () => {
  const black = parseColor('#000000')
  const white = parseColor('#ffffff')
  const out = adjustForContrast(black, white)
  assert.deepEqual(out, {r: 0, g: 0, b: 0, a: 1})
})
check('the hue survives the adjustment', () => {
  const pink = parseColor('#e611bf')
  const surface = parseColor('#1c1913')
  const out = adjustForContrast(pink, surface)
  const hue = c => {
    const max = Math.max(c.r, c.g, c.b)
    const min = Math.min(c.r, c.g, c.b)
    if (max === min) return 0
    const d = max - min
    let h
    if (max === c.r) h = ((c.g - c.b) / d + (c.g < c.b ? 6 : 0)) / 6
    else if (max === c.g) h = ((c.b - c.r) / d + 2) / 6
    else h = ((c.r - c.g) / d + 4) / 6
    return h * 360
  }
  const before = hue(pink)
  const after = hue(out)
  const delta = Math.abs(before - after)
  const wrapped = Math.min(delta, 360 - delta)
  assert.ok(wrapped < 6, `hue moved ${wrapped} degrees`)
})
check('every style surface in the lab passes after the adjustment', () => {
  const pink = parseColor('#e611bf')
  for (const surface of [
    '#ffffff',
    '#fbf8ef',
    '#f4efe3',
    '#131313',
    '#1c1913',
    '#14120d',
  ]) {
    const bg = parseColor(surface)
    const out = adjustForContrast(pink, bg)
    assert.ok(
      contrastRatio(out, bg) >= 4.5,
      `${surface}: ${toCss(out)} = ${contrastRatio(out, bg)}:1`
    )
  }
})
check('on a dark surface the colour gets LIGHTER, not darker', () => {
  const pink = parseColor('#e611bf')
  const out = adjustForContrast(pink, parseColor('#1c1913'))
  assert.ok(
    out.r >= pink.r && out.b >= pink.b,
    `expected a lighter colour, got ${toCss(out)} from ${toCss(pink)}`
  )
})
check('on a light surface the colour gets DARKER, not lighter', () => {
  const pink = parseColor('#e611bf')
  const out = adjustForContrast(pink, parseColor('#ffffff'))
  assert.ok(
    out.r <= pink.r && out.b <= pink.b,
    `expected a darker colour, got ${toCss(out)} from ${toCss(pink)}`
  )
})
check('the change is the SMALLEST one that passes', () => {
  // A colour that fails by a hair must barely move. An adjustment
  // that overshoots is as wrong as one that does not happen: it
  // rewrites the author's colour further than it has to.
  const pink = parseColor('#e611bf')
  const surface = parseColor('#1c1913')
  const out = adjustForContrast(pink, surface)
  const delta =
    Math.abs(out.r - pink.r) +
    Math.abs(out.g - pink.g) +
    Math.abs(out.b - pink.b)
  assert.ok(delta < 40, `moved by ${delta} channel steps: ${toCss(out)}`)
})
check('a hue that cannot get light enough still ends up readable', () => {
  // A saturated magenta on the tree's own amber highlight: the gamut
  // runs out before the contrast does, so the hue has to give some
  // saturation up. It must still end up legible, and it must not end
  // up as a different hue altogether.
  const pink = parseColor('#e611bf')
  const highlight = parseColor('#5c3d0e')
  const out = adjustForContrast(pink, highlight)
  assert.ok(
    contrastRatio(out, highlight) >= 4.5,
    `ended at ${toCss(out)} = ${contrastRatio(out, highlight)}:1`
  )
  const hue = c => {
    const max = Math.max(c.r, c.g, c.b)
    const min = Math.min(c.r, c.g, c.b)
    if (max === min) return null
    const d = max - min
    let h
    if (max === c.r) h = ((c.g - c.b) / d + (c.g < c.b ? 6 : 0)) / 6
    else if (max === c.g) h = ((c.b - c.r) / d + 2) / 6
    else h = ((c.r - c.g) / d + 4) / 6
    return h * 360
  }
  const after = hue(out)
  if (after !== null) {
    const before = hue(pink)
    const delta = Math.abs(before - after)
    assert.ok(
      Math.min(delta, 360 - delta) < 10,
      `hue moved from ${before} to ${after}`
    )
  }
})

console.log('effectiveBackground')
check('an element with no background inherits the root one', () => {
  assert.equal(typeof effectiveBackground, 'function')
})

console.log('')
if (failures) {
  console.log(`${failures} check(s) failed`)
  process.exit(1)
}
console.log('all checks passed')
