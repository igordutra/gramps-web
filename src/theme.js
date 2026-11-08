import {
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  TonalPalette,
  Variant,
  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities'

export const DEFAULT_PRIMARY = '#6d4c41'
/**
 * The stock Material blue (#0277bd) reads as an unrelated accent beside the
 * warm brown primary — it was the loudest thing on the screen and it was
 * not the brand. A deep, desaturated slate-teal sits beside the brown as a
 * cool counterweight instead of a competing hue.
 */
export const DEFAULT_SECONDARY = '#3f5f6b'

/**
 * Design-token scales that Gramps Web does not currently define.
 *
 * Material's components expose override points for shape, type scale,
 * spacing and elevation, but Gramps Web only sets the *colour* tokens
 * (see applyColors). Everything else therefore falls back to Material's
 * stock values — which is why buttons render at 14px/500 while body text
 * is 17px/340, and why every button is a 9999px pill.
 *
 * Defining these here makes the whole component set re-themeable from one
 * place, and lets the app's own components reference them instead of
 * hard-coding pixel values.
 */
export const SHAPE_SCALE = {
  '--md-sys-shape-corner-none': '0px',
  '--md-sys-shape-corner-extra-small': '2px',
  '--md-sys-shape-corner-small': '4px',
  '--md-sys-shape-corner-medium': '6px',
  '--md-sys-shape-corner-large': '8px',
  '--md-sys-shape-corner-extra-large': '12px',
  '--md-sys-shape-corner-xl': '14px',
  '--md-sys-shape-corner-2xl': '16px',
  '--md-sys-shape-corner-3xl': '20px',
  '--md-sys-shape-corner-4xl': '24px',
  // Material's default is 9999px (a pill). Gramps is a dense research tool:
  // a small radius reads as "document" rather than "consumer app".
  '--md-sys-shape-corner-full': '8px',
}

export const TYPE_SCALE = {
  '--md-sys-typescale-label-large-font':
    '"Inter var", "Gramps Symbols", sans-serif',
  '--md-sys-typescale-label-large-size': '0.875rem',
  '--md-sys-typescale-label-large-weight': '500',
  '--md-sys-typescale-label-large-line-height': '1.25rem',
  '--md-sys-typescale-label-medium-font':
    '"Inter var", "Gramps Symbols", sans-serif',
  '--md-sys-typescale-label-medium-size': '0.8125rem',
  '--md-sys-typescale-label-medium-weight': '500',
  '--md-sys-typescale-label-medium-line-height': '1.125rem',
  '--md-sys-typescale-label-small-font':
    '"Inter var", "Gramps Symbols", sans-serif',
  '--md-sys-typescale-label-small-size': '0.75rem',
  '--md-sys-typescale-label-small-weight': '500',
  '--md-sys-typescale-label-small-line-height': '1rem',
  '--md-sys-typescale-body-small-size': '0.8125rem',
  '--md-sys-typescale-body-medium-size': '0.9375rem',
  '--md-sys-typescale-body-large-size': '1.0625rem',
  // Headings get tighter tracking and heavier weight than Material's
  // defaults: a modern interface separates levels by weight and spacing,
  // not only by size.
  '--md-sys-typescale-headline-small-font':
    '"Inter var", "Gramps Symbols", sans-serif',
  '--md-sys-typescale-headline-medium-font':
    '"Inter var", "Gramps Symbols", sans-serif',
  '--md-sys-typescale-headline-large-font':
    '"Inter var", "Gramps Symbols", sans-serif',
  '--md-sys-typescale-headline-small-size': '1.25rem',
  '--md-sys-typescale-headline-medium-size': '1.5rem',
  '--md-sys-typescale-headline-large-size': '1.875rem',
  '--md-sys-typescale-headline-small-weight': '600',
  '--md-sys-typescale-headline-medium-weight': '600',
  '--md-sys-typescale-headline-large-weight': '650',
  '--md-sys-typescale-headline-small-tracking': '-0.01em',
  '--md-sys-typescale-headline-medium-tracking': '-0.015em',
  '--md-sys-typescale-headline-large-tracking': '-0.02em',
  '--md-sys-typescale-title-large-size': '1.375rem',
  '--md-sys-typescale-title-medium-size': '1rem',
  '--md-sys-typescale-title-small-size': '0.875rem',
  '--md-sys-typescale-title-medium-weight': '600',
  '--md-sys-typescale-title-small-weight': '600',
  '--md-ref-typeface-plain': '"Inter var", "Gramps Symbols", sans-serif',
  '--md-ref-typeface-brand': '"Inter var", "Gramps Symbols", sans-serif',
}

export const SPACE_SCALE = {
  '--md-sys-space-unit': '4px',
  // Material exposes a single space unit; the app needs a real scale.
  // These are the values the layout is built from, so padding and gaps
  // across the app stay on the same rhythm instead of drifting apart.
  '--grampsjs-space-2': '2px',
  '--grampsjs-space-4': '4px',
  '--grampsjs-space-8': '8px',
  '--grampsjs-space-12': '12px',
  '--grampsjs-space-16': '16px',
  '--grampsjs-space-20': '20px',
  '--grampsjs-space-24': '24px',
  '--grampsjs-space-32': '32px',
  '--grampsjs-space-40': '40px',
  // Page gutter: the breathing room between the window edge and content.
  '--grampsjs-page-gutter': '24px',
  // Gutter for the narrow layout, where 24px would eat the content.
  '--grampsjs-page-gutter-compact': '12px',
}

export const ELEVATION_SCALE = {
  '--md-sys-elevation-level0': 'none',
  // Modern interfaces separate layers with a soft, wide, low-opacity shadow
  // rather than Material's tight dark one.
  '--md-sys-elevation-level1': '0 1px 2px rgba(15, 23, 42, 0.06)',
  '--md-sys-elevation-level2': '0 2px 8px rgba(15, 23, 42, 0.08)',
  '--md-sys-elevation-level3': '0 4px 16px rgba(15, 23, 42, 0.1)',
  '--md-sys-elevation-level4': '0 8px 24px rgba(15, 23, 42, 0.12)',
  '--md-sys-elevation-level5': '0 12px 32px rgba(15, 23, 42, 0.14)',
}

/**
 * Density overrides for the Material components.
 *
 * §10.6 of the local brief measured Material's stock density as the
 * residue a token layer cannot reach — but these ARE reachable: Material
 * exposes a public override point per component, and each of these
 * defaults to a hard-coded value.
 *
 * 40px buttons and 24px inline padding are Material's "touch" sizing.
 * A desktop-first research tool wants 34px controls with 14px padding:
 * denser, and it reads as an application rather than a consumer app.
 */
export const DENSITY_SCALE = {
  '--md-filled-button-container-height': '34px',
  '--md-outlined-button-container-height': '34px',
  '--md-text-button-container-height': '34px',
  '--md-elevated-button-container-height': '34px',
  '--md-filled-button-leading-space': '16px',
  '--md-outlined-button-leading-space': '16px',
  '--md-text-button-leading-space': '10px',
  '--md-filled-button-trailing-space': '16px',
  '--md-outlined-button-trailing-space': '16px',
  '--md-text-button-trailing-space': '10px',
  // Material's 8% hover / 12% press state layers are heavy on a light
  // surface; 5% / 9% keeps the affordance without the smear.
  '--md-filled-button-hover-state-layer-opacity': '0.05',
  '--md-filled-button-pressed-state-layer-opacity': '0.09',
  '--md-outlined-button-hover-state-layer-opacity': '0.05',
  '--md-outlined-button-pressed-state-layer-opacity': '0.09',
  '--md-text-button-hover-state-layer-opacity': '0.05',
  '--md-text-button-pressed-state-layer-opacity': '0.09',
  '--md-list-item-leading-space': '20px',
  '--md-list-item-trailing-space': '20px',
  '--md-outlined-text-field-top-space': '14px',
  '--md-outlined-text-field-bottom-space': '14px',
  '--md-filled-text-field-top-space': '14px',
  '--md-filled-text-field-bottom-space': '14px',
  // A 3px tab indicator is Material's "chunky" default; 2px reads cleaner.
  '--md-primary-tab-active-indicator-height': '2px',
  '--md-secondary-tab-active-indicator-height': '2px',
}

export function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function getCurrentTheme(theme) {
  return theme === undefined || theme === 'system' ? getSystemTheme() : theme
}

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export function applyColors(
  primaryHex = DEFAULT_PRIMARY,
  secondaryHex = DEFAULT_SECONDARY,
  isDark = false
) {
  const primaryHct = Hct.fromInt(argbFromHex(primaryHex))
  const secondaryHct = Hct.fromInt(argbFromHex(secondaryHex))
  const secondaryPalette = TonalPalette.fromHueAndChroma(
    secondaryHct.hue,
    secondaryHct.chroma
  )

  const primaryPalette = TonalPalette.fromHueAndChroma(
    primaryHct.hue,
    primaryHct.chroma
  )

  const scheme = new DynamicScheme({
    sourceColorHct: primaryHct,
    variant: Variant.TONAL_SPOT,
    isDark,
    contrastLevel: 0,
    // Preserve the seed's own hue+chroma rather than TONAL_SPOT's fixed values.
    primaryPalette,
    secondaryPalette,
    // Chroma 0 → pure neutral grays; no hue tint bleeds into surfaces.
    neutralPalette: TonalPalette.fromHueAndChroma(primaryHct.hue, 0),
    neutralVariantPalette: TonalPalette.fromHueAndChroma(primaryHct.hue, 0),
  })

  const root = document.documentElement

  // Shape / type / space / elevation scales. These are theme-independent
  // (they do not derive from the seed colour), so they are written on every
  // call rather than living in CSS.
  for (const [name, value] of Object.entries({
    ...SHAPE_SCALE,
    ...TYPE_SCALE,
    ...SPACE_SCALE,
    ...ELEVATION_SCALE,
    ...DENSITY_SCALE,
  })) {
    root.style.setProperty(name, value)
  }

  for (const [name, color] of Object.entries(MaterialDynamicColors)) {
    if (typeof color?.getArgb !== 'function') continue
    root.style.setProperty(
      `--md-sys-color-${toKebabCase(name)}`,
      hexFromArgb(color.getArgb(scheme))
    )
  }

  // Primary: use seed's own tone clamped to [30, 50] so users see their chosen
  // colour on the app bar. Tone 30-50 always reads white on-primary text.
  const primaryTone = isDark
    ? Math.min(80, Math.max(60, Math.round(primaryHct.tone)))
    : Math.min(50, Math.max(30, Math.round(primaryHct.tone)))
  root.style.setProperty(
    '--md-sys-color-primary',
    hexFromArgb(primaryPalette.tone(primaryTone))
  )

  // M3 achromatic tones 90-98 are darker than expected for a web app.
  //
  // A modern interface is not a flat white page: it is a layered stack, with
  // the canvas slightly recessed and the content planes sitting just above
  // it. The previous version forced every surface to #ffffff, which made the
  // whole app read as one undifferentiated sheet. These tones form a
  // deliberate ladder — canvas, content, raised, overlay — with the
  // elevation shadow doing the rest of the work.
  if (!isDark) {
    root.style.setProperty('--md-sys-color-background', '#f7f7f8')
    root.style.setProperty('--md-sys-color-surface', '#ffffff')
    // lowest/low/container → menus, cards, sheets: white
    root.style.setProperty('--md-sys-color-surface-container-lowest', '#ffffff')
    root.style.setProperty('--md-sys-color-surface-container-low', '#fbfbfc')
    root.style.setProperty('--md-sys-color-surface-container', '#f4f4f6')
    // high → dialogs, raised surfaces: white (md-dialog uses this token)
    root.style.setProperty('--md-sys-color-surface-container-high', '#ffffff')
    // highest → filled text-field/select backgrounds: light gray
    root.style.setProperty(
      '--md-sys-color-surface-container-highest',
      'rgb(235, 235, 235)'
    )
    // Outline is what separates a borderless control from the canvas; the
    // M3 default is too dark for a light layered surface.
    root.style.setProperty('--md-sys-color-outline', '#c4c4c9')
    root.style.setProperty('--md-sys-color-outline-variant', '#e2e2e6')
    // A warmer, less pure on-surface keeps the text from reading as a
    // printer's black on the layered greys above.
    root.style.setProperty('--md-sys-color-on-surface', '#1b1b1f')
    root.style.setProperty('--md-sys-color-on-surface-variant', '#45454c')
  }

  // Action color for edit/add/delete buttons: clamp tone to a readable range
  // so very light or very dark seeds still contrast against their background.
  const actionTone = isDark
    ? Math.min(80, Math.max(60, Math.round(secondaryHct.tone)))
    : Math.min(55, Math.max(30, Math.round(secondaryHct.tone)))
  root.style.setProperty(
    '--mdc-theme-secondary',
    hexFromArgb(secondaryPalette.tone(actionTone))
  )
  root.style.setProperty(
    '--mdc-theme-on-secondary',
    actionTone < 60 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)'
  )
}

export function applyScheme(
  primaryHex = DEFAULT_PRIMARY,
  secondaryHex = DEFAULT_SECONDARY,
  theme
) {
  const isDark = getCurrentTheme(theme) === 'dark'
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  applyColors(primaryHex, secondaryHex, isDark)
}
