/*
Color utility functions
*/

/* Convert a 16-bit channel (4 hex digits) to 8 bits */
function hex4To8Bit(hex4) {
  return Math.round(parseInt(hex4, 16) / 257)
}

/* Convert #RRRRGGGGBBBB (4 hex digits per channel, as stored by
Gdk.Color.to_string() in Gramps 3.4 and 4.0) to rgb() */
export function hex12ToCss(hex, a = 1) {
  const result = /^#?([a-f\d]{4})([a-f\d]{4})([a-f\d]{4})$/i.exec(hex)
  if (result) {
    const r = hex4To8Bit(result[1])
    const g = hex4To8Bit(result[2])
    const b = hex4To8Bit(result[3])
    return `rgb(${r}, ${g}, ${b}, ${a})`
  }

  return null
}

/* Convert #RRGGBB to rgb() */
export function hex6ToCss(hex, a = 1) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)
    return `rgb(${r}, ${g}, ${b}, ${a})`
  }

  return null
}

/* Pick the right CSS conversion based on color string length */
export function colorToCss(color, a = 1) {
  return (
    (color?.length > 7 ? hex12ToCss(color, a) : hex6ToCss(color, a)) ??
    `rgba(0,0,0,${a})`
  )
}

function supportsRelativeColor() {
  return (
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('color', 'oklch(from red l c h)')
  )
}

/* Tag color as CSS, with its lightness kept within the readable range of
the current theme (--grampsjs-tag-lightness-min/-max in global.css). Hue and
chroma are kept, so a black tag shows light grey on the dark theme. Browsers
without relative color syntax get the plain color. */
export function tagColorToCss(color, a = 1) {
  const css = colorToCss(color, a)
  if (!supportsRelativeColor()) {
    return css
  }
  return `oklch(from ${css} clamp(var(--grampsjs-tag-lightness-min, 0), l, var(--grampsjs-tag-lightness-max, 1)) c h / alpha)`
}

/* Convert #RRRRGGGGBBBB back to #rrggbb */
export function hex12ToHex6(hex) {
  const result = /^#?([a-f\d]{4})([a-f\d]{4})([a-f\d]{4})$/i.exec(hex)
  if (!result) return null
  const r = hex4To8Bit(result[1])
  const g = hex4To8Bit(result[2])
  const b = hex4To8Bit(result[3])
  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/* Return a hex6 color suitable for a color picker input */
export function colorForPicker(color, defaultColor = '#1f77b4') {
  if (!color) return defaultColor
  if (color.length > 7) return hex12ToHex6(color) ?? defaultColor
  return color
}

/* Convert #rrggbb to #RRRRGGGGBBBB */
export function hex6ToHex12(hex6) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex6)
  if (result) {
    const r = parseInt(result[1], 16) * 257
    const g = parseInt(result[2], 16) * 257
    const b = parseInt(result[3], 16) * 257
    return `#${r.toString(16).padStart(4, '0')}${g
      .toString(16)
      .padStart(4, '0')}${b.toString(16).padStart(4, '0')}`
  }
  return null
}

/* The relative luminance of a colour, per WCAG 2. */
function luminance(r, g, b) {
  const channel = v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/* The contrast ratio between two colours, per WCAG 2. */
export function contrastRatio(colorA, colorB) {
  const a = luminance(...colorA)
  const b = luminance(...colorB)
  const lighter = Math.max(a, b)
  const darker = Math.min(a, b)
  return (lighter + 0.05) / (darker + 0.05)
}

/* The channels of a colour, or null if it cannot be read. */
function channelsOf(color) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color ?? '')
  if (!match) {
    return null
  }
  return [
    parseInt(match[1], 16),
    parseInt(match[2], 16),
    parseInt(match[3], 16),
  ]
}

/*
 * Darken a colour until it can be read on a light background.
 *
 * A tag's colour is the user's own choice, and it is used as the
 * chip's label. But a label nobody can read is not a colour anybody
 * can use: the tag colours Gramps ships with sit between 3.4:1 and
 * 4.4:1 against their own tint, and 14px text needs 4.5:1.
 *
 * The colour is kept as the chip's tint and darkened only for the
 * label, so the tag still looks like the tag.
 */
export function readableOnLight(color, ratio = 4.5) {
  const channels = channelsOf(color)
  if (!channels) {
    return color
  }
  const background = [255, 255, 255]
  let darkened = channels
  for (let step = 0; step < 21; step += 1) {
    if (contrastRatio(darkened, background) >= ratio) {
      break
    }
    darkened = darkened.map(c => Math.round(c * 0.9))
  }
  return `rgb(${darkened[0]}, ${darkened[1]}, ${darkened[2]})`
}
