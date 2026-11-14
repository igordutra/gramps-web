/**
 * Colour helpers for making USER-CHOSEN note colours legible.
 *
 * A note's author picks their own font colour and their own highlight
 * colour, and those choices are stored in the tree as arbitrary values.
 * The app already treats a user highlight BACKGROUND as something to
 * blend with the page so it stays readable in either colour mode
 * (`--note-highlight-color` is mixed with the surface rather than
 * painted at full strength).
 *
 * A user font COLOUR got no such treatment: it was painted exactly as
 * chosen, straight onto whatever surface it landed on. On a light
 * surface a mid-tone colour is illegible, and on a dark surface the
 * same colour can be. The colour is the author's, and the surface is
 * the theme's, so the only way to guarantee legibility for an ARBITRARY
 * choice is to move the colour until it can be read.
 *
 * The move is deliberately small: the hue and the saturation are kept,
 * and only the lightness is adjusted, by the least amount that reaches
 * the contrast ratio. A colour that already passes is never touched.
 */

// The WCAG AA threshold for body text.
const TARGET_RATIO = 4.5

// A margin above the threshold. The background is recomposed here
// from the layers the browser reports, and a one-unit rounding
// difference in a single channel is enough to turn a ratio of exactly
// 4.50 into one of 4.49. Aiming a little above the line means that
// rounding cannot land under it.
const TARGET_MARGIN = 0.1

/**
 * Parse a CSS colour into its components.
 *
 * `getComputedStyle` resolves colours to `rgb()` / `rgba()`, an inline
 * style may hold a hex, and a `color-mix()` resolves to the modern
 * `color(srgb r g b / a)` form — which is the one that matters here,
 * because the note highlight is painted with a `color-mix()` and a
 * parser that does not understand it silently SKIPS the highlight and
 * tunes the text against the wrong background.
 *
 * @param {string} value a CSS colour
 * @return {{r: number, g: number, b: number, a: number}|null}
 */
export function parseColor(value) {
  if (!value) return null
  const text = String(value).trim().toLowerCase()
  if (text === 'transparent') return {r: 0, g: 0, b: 0, a: 0}

  const hex = text.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/)
  if (hex) {
    let digits = hex[1]
    if (digits.length === 3) {
      digits = digits
        .split('')
        .map(c => c + c)
        .join('')
    }
    return {
      r: parseInt(digits.slice(0, 2), 16),
      g: parseInt(digits.slice(2, 4), 16),
      b: parseInt(digits.slice(4, 6), 16),
      a: 1,
    }
  }

  const alphaOf = raw => {
    if (raw === undefined) return 1
    const value = raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw)
    return Number.isFinite(value) ? value : 1
  }

  const rgb = text.match(/^rgba?\(([^)]*)\)$/)
  if (rgb) {
    const parts = rgb[1].split(/[,/\s]+/).filter(Boolean)
    if (parts.length < 3) return null
    const channel = raw =>
      raw.endsWith('%')
        ? Math.round((parseFloat(raw) / 100) * 255)
        : Math.round(parseFloat(raw))
    return {
      r: channel(parts[0]),
      g: channel(parts[1]),
      b: channel(parts[2]),
      a: alphaOf(parts[3]),
    }
  }

  // The modern form: color(srgb 0.9 0.5 0.1 / 0.3). A `color-mix()`
  // in srgb resolves to exactly this.
  const modern = text.match(/^color\(\s*([a-z0-9-]+)\s+([^)]*)\)$/)
  if (modern) {
    const space = modern[1]
    const parts = modern[2].split(/[\s/]+/).filter(Boolean)
    if (space !== 'srgb' && space !== 'srgb-linear') return null
    if (parts.length < 3) return null
    const channel = raw => {
      if (raw === undefined) return null
      let value = raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw)
      if (!Number.isFinite(value)) return null
      if (space === 'srgb-linear') {
        value =
          value <= 0.0031308
            ? 12.92 * value
            : 1.055 * value ** (1 / 2.4) - 0.055
      }
      return Math.min(255, Math.max(0, Math.round(value * 255)))
    }
    const r = channel(parts[0])
    const g = channel(parts[1])
    const b = channel(parts[2])
    if (r === null || g === null || b === null) return null
    return {r, g, b, a: alphaOf(parts[3])}
  }

  return null
}

/** Composite a translucent colour over an opaque one. */
function over(foreground, background) {
  const a = foreground.a
  return {
    r: foreground.r * a + background.r * (1 - a),
    g: foreground.g * a + background.g * (1 - a),
    b: foreground.b * a + background.b * (1 - a),
    a: 1,
  }
}

/** The WCAG relative luminance of an opaque colour. */
export function luminance({r, g, b}) {
  const channel = value => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** The contrast ratio between two opaque colours, 1 to 21. */
export function contrastRatio(foreground, background) {
  const a = luminance(foreground)
  const b = luminance(background)
  const high = Math.max(a, b)
  const low = Math.min(a, b)
  return (high + 0.05) / (low + 0.05)
}

/** Convert an opaque colour to HSL, for a lightness-only adjustment. */
function toHsl({r, g, b}) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const lightness = (max + min) / 2
  if (max === min) return {h: 0, s: 0, l: lightness}

  const delta = max - min
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  let hue
  if (max === rn) {
    hue = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6
  } else if (max === gn) {
    hue = ((bn - rn) / delta + 2) / 6
  } else {
    hue = ((rn - gn) / delta + 4) / 6
  }
  return {h: hue * 360, s: saturation, l: lightness}
}

/** Convert HSL back to an opaque RGB colour, clamped to the gamut. */
function fromHsl({h, s, l}) {
  const hue = (((h % 360) + 360) % 360) / 360
  if (s === 0) {
    const value = Math.round(l * 255)
    return {r: value, g: value, b: value, a: 1}
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const channel = t => {
    let value = t
    if (value < 0) value += 1
    if (value > 1) value -= 1
    if (value < 1 / 6) return p + (q - p) * 6 * value
    if (value < 1 / 2) return q
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6
    return p
  }
  const clamp = value => Math.min(255, Math.max(0, Math.round(value * 255)))
  return {
    r: clamp(channel(hue + 1 / 3)),
    g: clamp(channel(hue)),
    b: clamp(channel(hue - 1 / 3)),
    a: 1,
  }
}

/**
 * The colour that sits behind an element, composited.
 *
 * Every translucent layer between the element and the first opaque
 * one is composited in turn, because a highlight is painted
 * translucently over the note's own background and the text has to be
 * read against the RESULT, not against the highlight alone.
 *
 * The walk crosses EVERY shadow boundary on the way. A note is nested
 * several shadow trees deep — the note content inside its own, that
 * inside the connected note's, that inside the view's — and a walk
 * that stops at the first boundary finds nothing, which reads as
 * white paper: right in a light style and wrong in a dark one.
 *
 * @param {Element} element the element whose backdrop is wanted
 * @return {{r: number, g: number, b: number, a: number}} an opaque colour
 */
export function effectiveBackground(element) {
  const layers = []
  let node = element
  while (node) {
    const background = parseColor(getComputedStyle(node).backgroundColor)
    if (background && background.a > 0) {
      layers.push(background)
      if (background.a >= 0.999) break
    }
    const parent = node.parentElement
    if (parent) {
      node = parent
    } else {
      // No parent element means the node is the top of a shadow
      // tree, so the walk continues from that tree's host.
      const shadow = node.getRootNode()
      node = shadow && shadow.host ? shadow.host : null
    }
  }
  if (!layers.length) return {r: 255, g: 255, b: 255, a: 1}

  let result = layers[layers.length - 1]
  if (result.a < 0.999) result = {r: 255, g: 255, b: 255, a: 1}
  for (let i = layers.length - 2; i >= 0; i--) {
    result = over(layers[i], result)
  }
  return result
}

/**
 * Move a colour by the least amount of lightness that lets it be read
 * against a background.
 *
 * The hue and the saturation are preserved, so the colour still reads
 * as the author's own colour; only its lightness moves. The direction
 * that gets there with the smaller change wins, and a colour that
 * already passes is returned untouched.
 *
 * @param {{r: number, g: number, b: number, a: number}} foreground
 * @param {{r: number, g: number, b: number, a: number}} background
 * @return {{r: number, g: number, b: number, a: number}}
 */
export function adjustForContrast(
  foreground,
  background,
  target = TARGET_RATIO
) {
  const opaque = {r: foreground.r, g: foreground.g, b: foreground.b, a: 1}
  // A colour that already passes the threshold is the author's own and
  // is left exactly as it is.
  if (contrastRatio(opaque, background) >= target) return opaque
  // Everything else is aimed a little above the threshold, so that a
  // rounding difference in the recomposed background cannot leave it
  // sitting just under.
  const goal = target + TARGET_MARGIN

  const hsl = toHsl(opaque)
  const make = (s, l) => fromHsl({h: hsl.h, s, l})

  let best = null
  // The saturation is given up only as far as it has to be. A vivid
  // hue cannot always get light enough on a dark background — the
  // gamut runs out before the contrast does — so the hue is walked
  // down towards grey and no further than the target needs. A colour
  // that can be fixed by lightness alone never loses any saturation,
  // because the change is scored and the least change wins.
  for (let step = 0; step <= 20; step++) {
    const saturation = Math.max(0, hsl.s - step * 0.05)
    for (const direction of ['lighter', 'darker']) {
      // The value that passes is the one CLOSEST to the original: the
      // lightest passing colour when lightening, the darkest when
      // darkening.
      let left = direction === 'lighter' ? hsl.l : 0
      let right = direction === 'lighter' ? 1 : hsl.l
      let found = null
      let foundLightness = null
      for (let i = 0; i < 20; i++) {
        const mid = (left + right) / 2
        const candidate = make(saturation, mid)
        if (contrastRatio(candidate, background) >= goal) {
          found = candidate
          foundLightness = mid
          if (direction === 'lighter') right = mid
          else left = mid
        } else if (direction === 'lighter') {
          left = mid
        } else {
          right = mid
        }
      }
      if (found) {
        const change =
          Math.abs(foundLightness - hsl.l) + 0.5 * (hsl.s - saturation)
        if (!best || change < best.change) best = {colour: found, change}
      }
    }
  }

  if (best) return best.colour

  // Nothing reached the target, which happens for a hue that is
  // pinned near the background's own lightness. Desaturating towards
  // the far end does reach it.
  const away = luminance(background) > 0.5 ? 0 : 1
  for (let s = hsl.s; s >= 0; s -= 0.05) {
    const candidate = make(Math.max(0, s), away)
    if (contrastRatio(candidate, background) >= goal) return candidate
  }
  return make(0, away)
}

/**
 * The CSS colour string for an adjusted colour.
 */
export function toCss({r, g, b}) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}
