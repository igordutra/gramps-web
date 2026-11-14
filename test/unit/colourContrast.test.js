import {describe, it, expect} from 'vitest'

import {
  adjustForContrast,
  contrastRatio,
  effectiveBackground,
  parseColor,
  toCss,
} from '../../src/colourContrast.js'

/*
 * The cases come from a real measurement: the lab tree stores its note
 * colour as #e611bf, which is illegible on the light surface (4.04:1),
 * on the dark surface (4.33:1) and inside its own highlight (2.44:1).
 */
describe('parseColor', () => {
  it('parses hex', () => {
    expect(parseColor('#e611bf')).toEqual({r: 230, g: 17, b: 191, a: 1})
  })

  it('parses short hex', () => {
    expect(parseColor('#abc')).toEqual({r: 170, g: 187, b: 204, a: 1})
  })

  it('parses rgb', () => {
    expect(parseColor('rgb(1, 2, 3)')).toEqual({r: 1, g: 2, b: 3, a: 1})
  })

  it('parses rgba', () => {
    expect(parseColor('rgba(1, 2, 3, 0.5)')).toEqual({r: 1, g: 2, b: 3, a: 0.5})
  })

  it('parses transparent', () => {
    expect(parseColor('transparent')).toEqual({r: 0, g: 0, b: 0, a: 0})
  })

  it('refuses garbage', () => {
    expect(parseColor('not-a-colour')).toBe(null)
  })

  it('parses the modern color(srgb) form a color-mix() resolves to', () => {
    // This is the exact string the browser returns for the note
    // highlight. A parser that does not understand it skips the
    // highlight and tunes the text against the wrong background.
    expect(parseColor('color(srgb 0.94902 0.568627 0.0117647 / 0.3)')).toEqual({
      r: 242,
      g: 145,
      b: 3,
      a: 0.3,
    })
  })

  it('parses color(srgb) without an alpha', () => {
    expect(parseColor('color(srgb 1 0 0)')).toEqual({r: 255, g: 0, b: 0, a: 1})
  })

  it('does not guess an unsupported colour space', () => {
    expect(parseColor('color(display-p3 1 0 0)')).toBe(null)
  })

  it('parses a percentage alpha', () => {
    expect(parseColor('rgb(1, 2, 3, 60%)')).toEqual({r: 1, g: 2, b: 3, a: 0.6})
  })
})

describe('contrastRatio', () => {
  it('is 21 for black on white', () => {
    const r = contrastRatio({r: 0, g: 0, b: 0}, {r: 255, g: 255, b: 255})
    expect(Math.abs(r - 21)).toBeLessThan(0.01)
  })

  it('is 1 for a colour on itself', () => {
    const r = contrastRatio({r: 30, g: 30, b: 30}, {r: 30, g: 30, b: 30})
    expect(Math.abs(r - 1)).toBeLessThan(0.001)
  })
})

/** the hue of a colour, in degrees, or null for a grey */
function hue(c) {
  const max = Math.max(c.r, c.g, c.b)
  const min = Math.min(c.r, c.g, c.b)
  if (max === min) {
    return null
  }
  const d = max - min
  let h
  if (max === c.r) h = ((c.g - c.b) / d + (c.g < c.b ? 6 : 0)) / 6
  else if (max === c.g) h = ((c.b - c.r) / d + 2) / 6
  else h = ((c.r - c.g) / d + 4) / 6
  return h * 360
}

describe('adjustForContrast', () => {
  it('reaches AA on the dark surface', () => {
    const pink = parseColor('#e611bf')
    const surface = parseColor('#1c1913')
    expect(contrastRatio(pink, surface)).toBeLessThan(4.5) // precondition
    const out = adjustForContrast(pink, surface)
    expect(contrastRatio(out, surface)).toBeGreaterThanOrEqual(4.5)
  })

  it('reaches AA inside its own highlight', () => {
    const pink = parseColor('#e611bf')
    const highlight = parseColor('#5c3d0e')
    const out = adjustForContrast(pink, highlight)
    expect(contrastRatio(out, highlight)).toBeGreaterThanOrEqual(4.5)
  })

  it('reaches AA on the light surface', () => {
    const pink = parseColor('#e611bf')
    const surface = parseColor('#ffffff')
    const out = adjustForContrast(pink, surface)
    expect(contrastRatio(out, surface)).toBeGreaterThanOrEqual(4.5)
  })

  it('leaves a colour that already passes alone', () => {
    const out = adjustForContrast(parseColor('#000000'), parseColor('#ffffff'))
    expect(out).toEqual({r: 0, g: 0, b: 0, a: 1})
  })

  it('keeps the hue', () => {
    const pink = parseColor('#e611bf')
    const out = adjustForContrast(pink, parseColor('#1c1913'))
    const before = hue(pink)
    const after = hue(out)
    const delta = Math.abs(before - after)
    expect(Math.min(delta, 360 - delta)).toBeLessThan(6)
  })

  it('passes on every style surface in the lab', () => {
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
      expect(
        contrastRatio(out, bg),
        `${surface}: ${toCss(out)} = ${contrastRatio(out, bg)}:1`
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('gets LIGHTER on a dark surface, not darker', () => {
    const pink = parseColor('#e611bf')
    const out = adjustForContrast(pink, parseColor('#1c1913'))
    expect(out.r).toBeGreaterThanOrEqual(pink.r)
    expect(out.b).toBeGreaterThanOrEqual(pink.b)
  })

  it('gets DARKER on a light surface, not lighter', () => {
    const pink = parseColor('#e611bf')
    const out = adjustForContrast(pink, parseColor('#ffffff'))
    expect(out.r).toBeLessThanOrEqual(pink.r)
    expect(out.b).toBeLessThanOrEqual(pink.b)
  })

  it('makes the SMALLEST change that passes', () => {
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
    expect(delta).toBeLessThan(40)
  })

  it('stays readable when the hue cannot get light enough', () => {
    // A saturated magenta on the tree's own amber highlight: the gamut
    // runs out before the contrast does, so the hue has to give some
    // saturation up. It must still end up legible, and it must not end
    // up as a different hue altogether.
    const pink = parseColor('#e611bf')
    const highlight = parseColor('#5c3d0e')
    const out = adjustForContrast(pink, highlight)
    expect(contrastRatio(out, highlight)).toBeGreaterThanOrEqual(4.5)
    const after = hue(out)
    if (after !== null) {
      const before = hue(pink)
      const delta = Math.abs(before - after)
      expect(Math.min(delta, 360 - delta)).toBeLessThan(10)
    }
  })
})

describe('effectiveBackground', () => {
  it('is a function', () => {
    expect(typeof effectiveBackground).toBe('function')
  })
})
