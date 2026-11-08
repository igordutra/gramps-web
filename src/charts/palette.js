import {sexColor} from '../util.js'

// Colours of chart content. The values are CSS variables, so charts follow
// the app theme.
export const chartPalette = {
  sex: sexColor,
  personBox: 'var(--grampsjs-chart-person-box)',
  text: 'var(--grampsjs-body-font-color-90)',
  // Opaque, so that links that run along each other look like one
  link: 'var(--grampsjs-chart-link)',
  familyMarker: 'var(--grampsjs-chart-link)',
  familyMarkerFill: 'var(--grampsjs-chart-family-marker-fill)',
  triangle: 'var(--grampsjs-body-font-color-35)',
  triangleHover: 'var(--grampsjs-body-font-color-10)',
  shadow: 'var(--grampsjs-body-font-color-30)',
  // The background of the view
  background: 'var(--md-sys-color-surface)',
  addButton: 'var(--mdc-theme-secondary)',
  addButtonIcon: 'var(--md-sys-color-on-secondary)',
  fanRoot: 'var(--grampsjs-color-shade-120)',
  fanNoValue: 'var(--grampsjs-color-shade-220)',
  fanText: 'var(--grampsjs-body-font-color-70)',
  legendText: 'var(--grampsjs-body-font-color)',
}

/**
 * Colours of exported charts.
 *
 * An exported SVG is a standalone file: it must carry literal colours,
 * because the tokens it might reference do not exist in whatever opens it
 * later. So these cannot be `var(...)` references the way the live
 * palette is.
 *
 * They are still resolved from the app's own tokens, though, rather than
 * written out by hand: `resolveExportPalette` reads the computed values
 * of the live theme's tokens and freezes them. A hand-written copy drifts
 * from the theme the moment either changes — which is how the exported
 * charts ended up with the old Material blue add button while the app
 * itself had moved on.
 *
 * The values are taken from the LIGHT theme's tokens, so a file exported
 * from a dark-theme session still looks like the printed archival
 * document a chart is usually wanted for.
 */
const EXPORT_TOKEN_MAP = {
  sex: {
    F: '--color-girl',
    M: '--color-boy',
    X: '--color-other',
    U: '--color-unknown',
  },
  background: '--md-sys-color-surface',
  personBox: '--grampsjs-chart-person-box',
  text: '--grampsjs-body-font-color-90',
  link: '--grampsjs-chart-link',
  familyMarker: '--grampsjs-chart-link',
  familyMarkerFill: '--grampsjs-chart-family-marker-fill',
  triangle: '--grampsjs-body-font-color-35',
  triangleHover: '--grampsjs-body-font-color-10',
  shadow: '--grampsjs-body-font-color-30',
  addButton: '--mdc-theme-secondary',
  addButtonIcon: '--md-sys-color-on-secondary',
  fanRoot: '--grampsjs-color-shade-120',
  fanNoValue: '--grampsjs-color-shade-220',
  fanText: '--grampsjs-body-font-color-70',
  legendText: '--grampsjs-body-font-color',
}

// The values an export falls back to when a token cannot be read, which
// happens only outside a browser (a test, a script).
const EXPORT_FALLBACK = {
  sex: {F: '#ef9a9a', M: '#64b5f6', X: '#ce93d8', U: '#b0bec5'},
  background: '#ffffff',
  personBox: '#e6e6e6',
  text: '#1a1a1a',
  link: '#999999',
  familyMarker: '#999999',
  familyMarkerFill: '#dcdcdc',
  triangle: '#a6a6a6',
  triangleHover: '#e6e6e6',
  shadow: '#b3b3b3',
  addButton: '#3f5f6b',
  addButtonIcon: '#ffffff',
  fanRoot: '#787878',
  fanNoValue: '#dcdcdc',
  fanText: '#4d4d4d',
  legendText: '#333333',
}

let cachedExportPalette = null

/**
 * Resolve the export palette from the app's live tokens.
 *
 * The tokens are read once and cached: an export is a snapshot, and the
 * live chart may re-read them.
 */
export function resolveExportPalette() {
  if (cachedExportPalette) return cachedExportPalette
  if (typeof window === 'undefined' || !document.documentElement) {
    cachedExportPalette = {...EXPORT_FALLBACK}
    return cachedExportPalette
  }
  const cs = getComputedStyle(document.documentElement)
  const read = (name, fallback) => {
    const value = cs.getPropertyValue(name).trim()
    return value || fallback
  }
  const palette = {}
  for (const [key, token] of Object.entries(EXPORT_TOKEN_MAP)) {
    if (key === 'sex') {
      palette.sex = {}
      for (const [sex, sexToken] of Object.entries(token)) {
        palette.sex[sex] = read(sexToken, EXPORT_FALLBACK.sex[sex])
      }
    } else {
      palette[key] = read(token, EXPORT_FALLBACK[key])
    }
  }
  cachedExportPalette = palette
  return palette
}

// The fallback palette, for use outside a browser. In the app the
// resolved palette is what gets exported.
export const exportPalette = {...EXPORT_FALLBACK}
