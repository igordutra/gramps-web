import {
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  TonalPalette,
  Variant,
  argbFromHex,
  hexFromArgb,
} from '@material/material-color-utilities'
import {TREE_CONFIG_PRIMARY_COLOR, TREE_CONFIG_SECONDARY_COLOR} from './api.js'

export const DEFAULT_PRIMARY = '#6d4c41'
/**
 * The stock Material blue (#0277bd) reads as an unrelated accent beside the
 * warm brown primary — it was the loudest thing on the screen and it was
 * not the brand. A deep, desaturated slate-teal sits beside the brown as a
 * cool counterweight instead of a competing hue.
 */
export const DEFAULT_SECONDARY = '#3f5f6b'

/**
 * The themes the app offers.
 *
 * A theme is a named bundle: a seed pair, a colour scheme, and the scales
 * that give it its character. The scales are what separate one theme from
 * another — two themes with the same seeds and different shape and density
 * read as different products, and a theme that only changed the hue would
 * prove nothing about whether the token layer is really in charge.
 *
 * The colours are applied from the seed through Material's tonal palette,
 * so a theme states its intent with two hexes and lets the palette do the
 * rest. The scales are literal custom properties.
 */
export const THEMES = {
  archive: {
    label: 'Archive',
    primary: DEFAULT_PRIMARY,
    secondary: DEFAULT_SECONDARY,
    // The document-like default: a small radius, an airy gutter, and a
    // soft wide shadow. This reads as a research tool rather than a
    // consumer app.
    shape: {
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
      '--md-sys-shape-corner-full': '8px',
    },
    space: {
      '--grampsjs-page-gutter': '24px',
      '--grampsjs-page-gutter-compact': '12px',
      '--grampsjs-page-gutter-block': '16px',
      '--grampsjs-column-gap': '32px',
    },
    density: {
      '--md-filled-button-container-height': '34px',
      '--md-outlined-button-container-height': '34px',
      '--md-text-button-container-height': '34px',
      '--md-elevated-button-container-height': '34px',
    },
  },

  /**
   * A deliberately different theme, to prove the token layer is real.
   *
   * It is not "the same app in another colour": the corners are square
   * rather than softly rounded, the type is larger and heavier, the
   * gutter is wider, the controls are shorter and denser, and the
   * elevation is a hard offset rather than a soft shadow. If every one of
   * those reaches the rendered interface, the theme is applied through
   * the scales and not by a handful of hand-written rules.
   */
  blueprint: {
    label: 'Blueprint',
    primary: '#1d4ed8',
    secondary: '#0f766e',
    // Square corners throughout: this theme is about the grid.
    shape: {
      '--md-sys-shape-corner-none': '0px',
      '--md-sys-shape-corner-extra-small': '0px',
      '--md-sys-shape-corner-small': '0px',
      '--md-sys-shape-corner-medium': '0px',
      '--md-sys-shape-corner-large': '0px',
      '--md-sys-shape-corner-extra-large': '0px',
      '--md-sys-shape-corner-xl': '0px',
      '--md-sys-shape-corner-2xl': '0px',
      '--md-sys-shape-corner-3xl': '0px',
      '--md-sys-shape-corner-4xl': '0px',
      '--md-sys-shape-corner-full': '0px',
    },
    type: {
      '--md-sys-typescale-label-large-size': '1rem',
      '--md-sys-typescale-label-large-weight': '600',
      '--md-sys-typescale-body-medium-size': '1rem',
      '--md-sys-typescale-body-large-size': '1.125rem',
      '--md-sys-typescale-title-medium-size': '1.125rem',
      '--md-sys-typescale-title-large-size': '1.5rem',
      '--md-sys-typescale-headline-small-weight': '700',
      '--md-sys-typescale-headline-medium-weight': '700',
      '--md-sys-typescale-headline-large-weight': '700',
    },
    space: {
      '--grampsjs-page-gutter': '32px',
      '--grampsjs-page-gutter-compact': '16px',
      '--grampsjs-page-gutter-block': '24px',
      '--grampsjs-column-gap': '48px',
    },
    density: {
      '--md-filled-button-container-height': '30px',
      '--md-outlined-button-container-height': '30px',
      '--md-text-button-container-height': '30px',
      '--md-elevated-button-container-height': '30px',
    },
    elevation: {
      '--md-sys-elevation-level1': '2px 2px 0 0 rgba(15, 23, 42, 0.12)',
      '--md-sys-elevation-level2': '3px 3px 0 0 rgba(15, 23, 42, 0.14)',
      '--md-sys-elevation-level3': '4px 4px 0 0 rgba(15, 23, 42, 0.16)',
      '--md-sys-elevation-level4': '5px 5px 0 0 rgba(15, 23, 42, 0.18)',
      '--md-sys-elevation-level5': '6px 6px 0 0 rgba(15, 23, 42, 0.2)',
    },
  },
}

// The lab runs the SECOND style on purpose: Blueprint is a different
// design language — square corners, a different type scale, a
// different density — so a component that follows the tokens visibly
// changes with it, and one that is hard-coded visibly does not.
export const DEFAULT_THEME = 'blueprint'

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
  // The label scale is the scale every control's text comes from: button
  // labels, field labels, tab labels. It was left at Material's stock
  // 14px/500, which is why a button and a field label read smaller than
  // the 16px body text around them. 15px/450 matches the list rows.
  '--md-sys-typescale-label-large-size': '0.9375rem',
  '--md-sys-typescale-label-large-weight': '450',
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
  // The body steps carry no weight of their own in Material, so they fall
  // back to the reference weight. The app uses the body sizes for the
  // text that is READ rather than acted on — a revision list, a menu
  // item — and it wanted those lighter than a label, so the weights are
  // declared here and the body steps are used for their size.
  '--md-sys-typescale-body-small-weight': '400',
  '--md-sys-typescale-body-medium-weight': '400',
  '--md-sys-typescale-body-large-weight': '400',
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
  '--grampsjs-space-48': '48px',
  '--grampsjs-space-56': '56px',
  '--grampsjs-space-64': '64px',
  // Page gutter: the breathing room between the window edge and content.
  '--grampsjs-page-gutter': '24px',
  // Gutter for the narrow layout, where 24px would eat the content.
  '--grampsjs-page-gutter-compact': '12px',
  // The vertical half of the page gutter. A page's first row of content
  // sits closer to the top edge than to the sides, which is what a
  // document layout does; the two are separate tokens so a view can
  // differ on either axis.
  '--grampsjs-page-gutter-block': '16px',
  // Gap between the two columns of the dashboard. The columns used to
  // touch, because the rule that gave the first one its padding was
  // dead (see GrampsjsViewDashboard).
  '--grampsjs-column-gap': '32px',
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
  // The shadow colour itself, for the components that take a colour
  // rather than a whole shadow. It was written down in five files.
  '--grampsjs-shadow-color': 'rgba(15, 23, 42, 0.18)',
}

/**
 * Per-component shape and type overrides.
 *
 * Material v2 does NOT read the shape scale directly for form controls.
 * Each component consults its own override point, and each one has a
 * DIFFERENT fallback chain — which is why the token layer reached the
 * buttons but not the fields:
 *
 *   filled text field -> --md-outlined-text-field-container-shape
 *                       -> --md-sys-shape-corner-none (0px) for the end
 *                          corners, --md-sys-shape-corner-extra-small for
 *                          the start corners
 *   filled select    -> --md-outlined-select-text-field-container-shape
 *                       -> corner-extra-small / corner-none
 *
 * So a filled field resolved to a 2px top and a 0px bottom — the square,
 * "angular" bottom edge the operator saw. Setting the sys scale alone
 * cannot fix that; the per-component token has to be set, and the only
 * place that owns it is here.
 *
 * The label typography has the same problem: a field label resolves
 * through --md-outlined-field-label-text-size, not through the type scale
 * directly.
 *
 * The token names matter: the PUBLIC ones are
 * `--md-<variant>-text-field-*` and `--md-<variant>-select-text-field-*`,
 * and the `--md-<variant>-field-*` names are the components' INTERNAL
 * aliases.
 */
export const COMPONENT_SCALE = {
  /*
   * Material's per-component shape tokens.
   *
   * The four CORNER tokens are named separately because they have
   * SEPARATE fallback chains, and the chains do not agree:
   *
   *   container-shape-start-start  -> corner-extra-small   (4px)
   *   container-shape-start-end    -> corner-extra-small   (4px)
   *   container-shape-end-end      -> corner-NONE          (0px)
   *   container-shape-end-start    -> corner-NONE          (0px)
   *
   * So a field that inherits the shape scale gets a ROUNDED top and a
   * SQUARE bottom — the "angular" look. Setting only the container-shape
   * token does not fix it: the end corners never consult it. Each of
   * the four has to be set, and they are set here to the same value so
   * the field is uniformly rounded.
   *
   * Note the token names: the PUBLIC ones are
   * `--md-<variant>-text-field-*` and `--md-<variant>-select-text-field-*`.
   * The `--md-<variant>-field-*` names are the component's INTERNAL
   * aliases, which it assigns on its own `:host` rule — a value set on
   * the document root loses to that and has no effect at all.
   *
   * The app's fields are the OUTLINED variant: a border and no fill.
   * Material's FILLED variant is a grey box, and that grey box is what
   * made the forms read as stock Material — the app's own tables and
   * buttons are a white surface with a thin light border.
   */
  '--md-outlined-text-field-container-shape':
    'var(--md-sys-shape-corner-small)',
  '--md-outlined-text-field-container-shape-start-start':
    'var(--md-sys-shape-corner-small)',
  '--md-outlined-text-field-container-shape-start-end':
    'var(--md-sys-shape-corner-small)',
  '--md-outlined-text-field-container-shape-end-end':
    'var(--md-sys-shape-corner-small)',
  '--md-outlined-text-field-container-shape-end-start':
    'var(--md-sys-shape-corner-small)',
  '--md-outlined-select-text-field-container-shape':
    'var(--md-sys-shape-corner-small)',
  '--md-outlined-select-text-field-container-shape-start-start':
    'var(--md-sys-shape-corner-small)',
  '--md-outlined-select-text-field-container-shape-start-end':
    'var(--md-sys-shape-corner-small)',
  '--md-outlined-select-text-field-container-shape-end-end':
    'var(--md-sys-shape-corner-small)',
  '--md-outlined-select-text-field-container-shape-end-start':
    'var(--md-sys-shape-corner-small)',
  /*
   * The field's OWN aliases.
   *
   * These are the tokens the `md-outlined-field` element reads. A text
   * field assigns them on its own host rule — so for a text field a
   * root-level value loses and has no effect — but the SELECT does not
   * assign them, so the select's inner field inherits them from the
   * root. They therefore have to be set for the select, and they have
   * to MATCH the text field's own values, or the two controls in the
   * same row come out different heights.
   *
   * Material's field is 56px tall, which is taller than every other
   * control in the app. A research tool wants the same density as its
   * buttons.
   *
   * The height of a field is its TOP space + its BOTTOM space + the
   * content line, so the spaces are what set it.
   *
   * A field WITH a label and a field WITHOUT one are different: the
   * labelled one adds the label's own line to the content, so its
   * spaces are smaller. Material keeps the two the same height by
   * giving the labelled field 8px of space and the unlabelled field
   * 16px. These values keep that parity while shrinking both:
   *
   *   labelled:   6 + 18 (the label line) + 6 + 24 (the content) = 54
   *   unlabelled: 15 + 24 (the content)                   + 15 = 54
   */
  '--md-outlined-field-top-space': '15px',
  '--md-outlined-field-bottom-space': '15px',
  '--md-outlined-field-with-label-top-space': '6px',
  '--md-outlined-field-with-label-bottom-space': '6px',
  '--md-outlined-text-field-label-text-size':
    'var(--md-sys-typescale-label-large-size)',
  '--md-outlined-text-field-label-text-weight':
    'var(--md-sys-typescale-label-large-weight)',
  '--md-outlined-text-field-label-text-font': 'var(--md-ref-typeface-plain)',
  '--md-outlined-text-field-label-text-populated-size':
    'var(--md-sys-typescale-label-medium-size)',
  '--md-outlined-text-field-label-text-populated-line-height':
    'var(--md-sys-typescale-label-medium-line-height, 1rem)',
  '--md-outlined-select-text-field-label-text-size':
    'var(--md-sys-typescale-label-large-size)',
  '--md-outlined-select-text-field-label-text-weight':
    'var(--md-sys-typescale-label-large-weight)',
  '--md-outlined-select-text-field-label-text-font':
    'var(--md-ref-typeface-plain)',
  '--md-outlined-select-text-field-label-text-populated-size':
    'var(--md-sys-typescale-label-medium-size)',
  '--md-outlined-select-text-field-label-text-populated-line-height':
    'var(--md-sys-typescale-label-medium-line-height, 1rem)',
  '--md-outlined-text-field-top-space': '15px',
  '--md-outlined-text-field-bottom-space': '15px',
  '--md-outlined-text-field-with-label-top-space': '6px',
  '--md-outlined-text-field-with-label-bottom-space': '6px',
  '--md-outlined-select-text-field-top-space': '15px',
  '--md-outlined-select-text-field-bottom-space': '15px',
  '--md-outlined-select-text-field-with-label-top-space': '6px',
  '--md-outlined-select-text-field-with-label-bottom-space': '6px',
  '--grampsjs-pill-toggle-radius': 'var(--md-sys-shape-corner-full)',
  '--grampsjs-pill-toggle-hover-opacity': '5%',
  '--grampsjs-pill-toggle-gap': 'var(--grampsjs-space-8)',
  '--md-outlined-text-field-container-color': 'transparent',
  '--md-outlined-select-text-field-container-color': 'transparent',
  '--md-outlined-text-field-outline-color': 'var(--md-sys-color-outline)',
  '--md-outlined-text-field-hover-outline-color': 'var(--md-sys-color-outline)',
  '--md-outlined-text-field-focus-outline-color': 'var(--md-sys-color-primary)',
  '--md-outlined-text-field-error-outline-color': 'var(--md-sys-color-error)',
  '--md-outlined-text-field-outline-width': 'var(--grampsjs-outline-width)',
  '--md-outlined-text-field-hover-outline-width':
    'var(--grampsjs-outline-width)',
  '--md-outlined-text-field-focus-outline-width':
    'var(--grampsjs-outline-width)',
  '--md-outlined-text-field-active-indicator-color':
    'var(--md-sys-color-primary)',
  '--md-outlined-text-field-hover-active-indicator-color':
    'var(--md-sys-color-primary)',
  '--md-outlined-text-field-focus-active-indicator-color':
    'var(--md-sys-color-primary)',
  '--md-outlined-text-field-label-text-color':
    'var(--md-sys-color-on-surface-variant)',
  '--md-outlined-text-field-focus-label-text-color':
    'var(--md-sys-color-primary)',
  '--md-outlined-text-field-label-text-populated-weight':
    'var(--md-sys-typescale-label-medium-weight)',
  '--md-outlined-text-field-input-text-color': 'var(--md-sys-color-on-surface)',
  '--md-outlined-text-field-input-text-size':
    'var(--md-sys-typescale-body-medium-size)',
  '--md-outlined-text-field-input-text-weight':
    'var(--md-sys-typescale-body-medium-weight)',
  '--md-outlined-text-field-input-text-placeholder-color':
    'var(--md-sys-color-on-surface-variant)',
  '--md-outlined-select-text-field-outline-color':
    'var(--md-sys-color-outline)',
  '--md-outlined-select-text-field-hover-outline-color':
    'var(--md-sys-color-outline)',
  '--md-outlined-select-text-field-focus-outline-color':
    'var(--md-sys-color-primary)',
  '--md-outlined-select-text-field-outline-width':
    'var(--grampsjs-outline-width)',
  '--md-outlined-select-text-field-hover-outline-width':
    'var(--grampsjs-outline-width)',
  '--md-outlined-select-text-field-focus-outline-width':
    'var(--grampsjs-outline-width)',
  '--md-outlined-select-text-field-active-indicator-color':
    'var(--md-sys-color-primary)',
  '--md-outlined-select-text-field-label-text-color':
    'var(--md-sys-color-on-surface-variant)',
  '--md-outlined-select-text-field-focus-label-text-color':
    'var(--md-sys-color-primary)',
  '--md-outlined-select-text-field-input-text-color':
    'var(--md-sys-color-on-surface)',
  '--md-outlined-select-text-field-input-text-size':
    'var(--md-sys-typescale-body-medium-size)',
  '--md-outlined-select-text-field-input-text-weight':
    'var(--md-sys-typescale-body-medium-weight)',
  '--md-outlined-select-text-field-input-text-placeholder-color':
    'var(--md-sys-color-on-surface-variant)',
}

export const MATERIAL_SCALE = {
  /*
   * Every Material component the app renders, with each of its
   * public override points pointed at a design-system token.
   *
   * Material exposes an override point per component and per
   * property, so the token layer does not have to rewrite
   * Material's CSS — it has to NAME every property the app
   * wants to own and point it at a token instead of at
   * Material's literal. A property that is not named here is
   * still Material's to decide.
   *
   * This block was generated by lab/gen_material_tokens.py, which
   * reads Material's own stylesheets and maps each token by
   * ROLE. The audit that found the gaps is
   * lab/audit_material.py.
   */

  // --- assist-chip -------------------------------------------------
  '--md-assist-chip-container-height': 'var(--grampsjs-chip-height)',
  '--md-assist-chip-disabled-label-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-assist-chip-disabled-leading-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-assist-chip-disabled-outline-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-assist-chip-elevated-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-assist-chip-elevated-disabled-container-elevation':
    'var(--grampsjs-elevation-level-0)',
  '--md-assist-chip-elevated-disabled-container-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-assist-chip-elevated-focus-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-assist-chip-elevated-hover-container-elevation':
    'var(--grampsjs-elevation-level-2)',
  '--md-assist-chip-elevated-pressed-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-assist-chip-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-assist-chip-icon-label-space': 'var(--grampsjs-space-8)',
  '--md-assist-chip-icon-size': 'var(--grampsjs-icon-size)',
  '--md-assist-chip-leading-space': 'var(--grampsjs-space-16)',
  '--md-assist-chip-outline-width': 'var(--grampsjs-outline-width)',
  '--md-assist-chip-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-assist-chip-trailing-space': 'var(--grampsjs-space-16)',
  '--md-assist-chip-with-leading-icon-leading-space': 'var(--grampsjs-space-8)',

  // --- checkbox ----------------------------------------------------
  '--md-checkbox-container-shape': 'var(--md-sys-shape-corner-small)',
  '--md-checkbox-container-shape-end-end': 'var(--md-sys-shape-corner-small)',
  '--md-checkbox-container-shape-end-start': 'var(--md-sys-shape-corner-small)',
  '--md-checkbox-container-shape-start-end': 'var(--md-sys-shape-corner-small)',
  '--md-checkbox-container-shape-start-start':
    'var(--md-sys-shape-corner-small)',
  '--md-checkbox-container-size': 'var(--grampsjs-checkbox-size)',
  '--md-checkbox-disabled-container-opacity':
    'var(--grampsjs-disabled-checkbox-opacity)',
  '--md-checkbox-disabled-outline-width': 'var(--grampsjs-outline-width-thick)',
  '--md-checkbox-focus-outline-width': 'var(--grampsjs-outline-width-thick)',
  '--md-checkbox-hover-outline-width': 'var(--grampsjs-outline-width-thick)',
  '--md-checkbox-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-checkbox-icon-size': 'var(--grampsjs-icon-size)',
  '--md-checkbox-outline-width': 'var(--grampsjs-outline-width-thick)',
  '--md-checkbox-pressed-outline-width': 'var(--grampsjs-outline-width-thick)',
  '--md-checkbox-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-checkbox-selected-disabled-container-opacity':
    'var(--grampsjs-disabled-checkbox-opacity)',
  '--md-checkbox-selected-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-checkbox-selected-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-checkbox-state-layer-size': 'var(--grampsjs-state-layer-size)',

  // --- circular-progress -------------------------------------------
  '--md-circular-progress-active-indicator-width':
    'var(--grampsjs-progress-indicator-width)',
  '--md-circular-progress-size': 'var(--grampsjs-progress-size)',

  // --- dialog ------------------------------------------------------
  '--md-dialog-icon-size': 'var(--grampsjs-icon-size-large)',

  // --- divider -----------------------------------------------------
  '--md-divider-thickness': 'var(--grampsjs-outline-width)',

  // --- fab ---------------------------------------------------------
  '--md-fab-branded-container-elevation': 'var(--grampsjs-elevation-level-3)',
  '--md-fab-branded-container-height': 'var(--grampsjs-fab-size-branded)',
  '--md-fab-branded-container-width': 'var(--grampsjs-fab-size-branded)',
  '--md-fab-branded-focus-container-elevation':
    'var(--grampsjs-elevation-level-3)',
  '--md-fab-branded-hover-container-elevation':
    'var(--grampsjs-elevation-level-4)',
  '--md-fab-branded-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-fab-branded-icon-size': 'var(--grampsjs-icon-size-branded)',
  '--md-fab-branded-large-container-height':
    'var(--grampsjs-fab-size-branded-large)',
  '--md-fab-branded-large-container-width':
    'var(--grampsjs-fab-size-branded-large)',
  '--md-fab-branded-large-icon-size': 'var(--grampsjs-icon-size-xxl)',
  '--md-fab-branded-lowered-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-fab-branded-lowered-focus-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-fab-branded-lowered-hover-container-elevation':
    'var(--grampsjs-elevation-level-2)',
  '--md-fab-branded-lowered-pressed-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-fab-branded-pressed-container-elevation':
    'var(--grampsjs-elevation-level-3)',
  '--md-fab-branded-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-fab-container-elevation': 'var(--grampsjs-elevation-level-3)',
  '--md-fab-container-height': 'var(--grampsjs-fab-size)',
  '--md-fab-container-width': 'var(--grampsjs-fab-size)',
  '--md-fab-focus-container-elevation': 'var(--grampsjs-elevation-level-3)',
  '--md-fab-hover-container-elevation': 'var(--grampsjs-elevation-level-4)',
  '--md-fab-hover-state-layer-opacity': 'var(--grampsjs-state-hover-opacity)',
  '--md-fab-icon-size': 'var(--grampsjs-icon-size-large)',
  '--md-fab-large-container-height': 'var(--grampsjs-fab-size-large)',
  '--md-fab-large-container-width': 'var(--grampsjs-fab-size-large)',
  '--md-fab-large-icon-size': 'var(--grampsjs-icon-size-xl)',
  '--md-fab-lowered-container-elevation': 'var(--grampsjs-elevation-level-1)',
  '--md-fab-lowered-focus-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-fab-lowered-hover-container-elevation':
    'var(--grampsjs-elevation-level-2)',
  '--md-fab-lowered-pressed-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-fab-pressed-container-elevation': 'var(--grampsjs-elevation-level-3)',
  '--md-fab-pressed-state-layer-opacity': 'var(--grampsjs-state-press-opacity)',
  '--md-fab-small-container-height': 'var(--grampsjs-fab-size-small)',
  '--md-fab-small-container-width': 'var(--grampsjs-fab-size-small)',
  '--md-fab-small-icon-size': 'var(--grampsjs-icon-size-large)',

  // --- filled-button -----------------------------------------------
  '--md-filled-button-container-elevation': 'var(--grampsjs-elevation-level-0)',
  '--md-filled-button-disabled-container-elevation':
    'var(--grampsjs-elevation-level-0)',
  '--md-filled-button-disabled-container-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-filled-button-disabled-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-filled-button-disabled-label-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-filled-button-focus-container-elevation':
    'var(--grampsjs-elevation-level-0)',
  '--md-filled-button-hover-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-filled-button-icon-size': 'var(--grampsjs-icon-size)',
  '--md-filled-button-pressed-container-elevation':
    'var(--grampsjs-elevation-level-0)',
  '--md-filled-button-with-leading-icon-leading-space':
    'var(--grampsjs-space-16)',
  '--md-filled-button-with-leading-icon-trailing-space':
    'var(--grampsjs-space-24)',
  '--md-filled-button-with-trailing-icon-leading-space':
    'var(--grampsjs-space-24)',
  '--md-filled-button-with-trailing-icon-trailing-space':
    'var(--grampsjs-space-16)',

  // --- filled-icon-button ------------------------------------------
  '--md-filled-icon-button-container-height':
    'var(--grampsjs-icon-button-size)',
  '--md-filled-icon-button-container-width': 'var(--grampsjs-icon-button-size)',
  '--md-filled-icon-button-disabled-container-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-filled-icon-button-disabled-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-filled-icon-button-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-filled-icon-button-icon-size': 'var(--grampsjs-icon-size-large)',
  '--md-filled-icon-button-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',

  // --- filled-tonal-icon-button ------------------------------------
  '--md-filled-tonal-icon-button-container-height':
    'var(--grampsjs-icon-button-size)',
  '--md-filled-tonal-icon-button-container-width':
    'var(--grampsjs-icon-button-size)',
  '--md-filled-tonal-icon-button-disabled-container-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-filled-tonal-icon-button-disabled-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-filled-tonal-icon-button-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-filled-tonal-icon-button-icon-size': 'var(--grampsjs-icon-size-large)',
  '--md-filled-tonal-icon-button-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',

  // --- filter-chip -------------------------------------------------
  '--md-filter-chip-container-height': 'var(--grampsjs-chip-height)',
  '--md-filter-chip-disabled-label-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-filter-chip-disabled-leading-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-filter-chip-disabled-outline-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-filter-chip-disabled-selected-container-opacity':
    'var(--grampsjs-disabled-selected-container-opacity)',
  '--md-filter-chip-disabled-trailing-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-filter-chip-elevated-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-filter-chip-elevated-disabled-container-elevation':
    'var(--grampsjs-elevation-level-0)',
  '--md-filter-chip-elevated-disabled-container-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-filter-chip-elevated-focus-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-filter-chip-elevated-hover-container-elevation':
    'var(--grampsjs-elevation-level-2)',
  '--md-filter-chip-elevated-pressed-container-elevation':
    'var(--grampsjs-elevation-level-1)',
  '--md-filter-chip-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-filter-chip-icon-label-space': 'var(--grampsjs-space-8)',
  '--md-filter-chip-icon-size': 'var(--grampsjs-icon-size)',
  '--md-filter-chip-leading-space': 'var(--grampsjs-space-16)',
  '--md-filter-chip-outline-width': 'var(--grampsjs-outline-width)',
  '--md-filter-chip-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-filter-chip-selected-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-filter-chip-selected-outline-width':
    'var(--grampsjs-outline-width-none)',
  '--md-filter-chip-selected-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-filter-chip-trailing-space': 'var(--grampsjs-space-16)',
  '--md-filter-chip-with-leading-icon-leading-space': 'var(--grampsjs-space-8)',
  '--md-filter-chip-with-trailing-icon-trailing-space':
    'var(--grampsjs-space-8)',

  // --- icon --------------------------------------------------------
  '--md-icon-font': 'var(--md-ref-typeface-plain)',
  '--md-icon-size': 'var(--grampsjs-icon-size-large)',

  // --- icon-button -------------------------------------------------
  '--md-icon-button-disabled-icon-opacity': 'var(--grampsjs-disabled-opacity)',
  '--md-icon-button-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-icon-button-icon-size': 'var(--grampsjs-icon-size-large)',
  '--md-icon-button-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-icon-button-selected-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-icon-button-selected-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-icon-button-state-layer-height':
    'var(--grampsjs-icon-button-touch-target)',
  '--md-icon-button-state-layer-width':
    'var(--grampsjs-icon-button-touch-target)',

  // --- input-chip --------------------------------------------------
  '--md-input-chip-avatar-size': 'var(--grampsjs-icon-size-large)',
  '--md-input-chip-container-height': 'var(--grampsjs-chip-height)',
  '--md-input-chip-container-shape': 'var(--grampsjs-chip-radius)',
  '--md-input-chip-container-shape-end-end': 'var(--grampsjs-chip-radius)',
  '--md-input-chip-container-shape-end-start': 'var(--grampsjs-chip-radius)',
  '--md-input-chip-container-shape-start-end': 'var(--grampsjs-chip-radius)',
  '--md-input-chip-container-shape-start-start': 'var(--grampsjs-chip-radius)',
  '--md-input-chip-disabled-avatar-opacity': 'var(--grampsjs-disabled-opacity)',
  '--md-input-chip-disabled-label-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-input-chip-disabled-leading-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-input-chip-disabled-outline-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-input-chip-disabled-selected-container-opacity':
    'var(--grampsjs-disabled-selected-container-opacity)',
  '--md-input-chip-disabled-trailing-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-input-chip-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-input-chip-icon-label-space': 'var(--grampsjs-space-8)',
  '--md-input-chip-icon-size': 'var(--grampsjs-icon-size)',
  '--md-input-chip-leading-space': 'var(--grampsjs-space-16)',
  '--md-input-chip-outline-width': 'var(--grampsjs-outline-width)',
  '--md-input-chip-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-input-chip-selected-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-input-chip-selected-outline-width':
    'var(--grampsjs-outline-width-none)',
  '--md-input-chip-selected-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-input-chip-trailing-space': 'var(--grampsjs-space-16)',
  '--md-input-chip-with-leading-icon-leading-space': 'var(--grampsjs-space-8)',
  '--md-input-chip-with-trailing-icon-trailing-space':
    'var(--grampsjs-space-8)',

  // --- linear-progress ---------------------------------------------
  '--md-linear-progress-active-indicator-height':
    'var(--grampsjs-progress-indicator-height)',
  '--md-linear-progress-track-height': 'var(--grampsjs-space-4)',

  // --- list-item ---------------------------------------------------
  '--md-list-item-bottom-space': 'var(--grampsjs-space-12)',
  '--md-list-item-disabled-opacity': 'var(--grampsjs-disabled-item-opacity)',
  '--md-list-item-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-list-item-one-line-container-height':
    'var(--grampsjs-list-item-height)',
  '--md-list-item-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-list-item-top-space': 'var(--grampsjs-space-12)',
  '--md-list-item-two-line-container-height':
    'var(--grampsjs-list-item-height-two-line)',

  // --- menu --------------------------------------------------------
  '--md-menu-bottom-space': 'var(--grampsjs-space-8)',
  '--md-menu-container-elevation': 'var(--grampsjs-elevation-level-2)',
  '--md-menu-top-space': 'var(--grampsjs-space-8)',

  // --- menu-item ---------------------------------------------------
  '--md-menu-item-bottom-space': 'var(--grampsjs-space-12)',
  '--md-menu-item-container-color': 'transparent',
  '--md-menu-item-disabled-opacity': 'var(--grampsjs-disabled-item-opacity)',
  '--md-menu-item-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-menu-item-leading-space': 'var(--grampsjs-space-16)',
  '--md-menu-item-one-line-container-height':
    'var(--grampsjs-list-item-height)',
  '--md-menu-item-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-menu-item-top-space': 'var(--grampsjs-space-12)',
  '--md-menu-item-trailing-space': 'var(--grampsjs-space-16)',
  '--md-menu-item-two-line-container-height':
    'var(--grampsjs-list-item-height-two-line)',

  // --- outlined-button ---------------------------------------------
  '--md-outlined-button-disabled-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-button-disabled-label-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-button-disabled-outline-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-outlined-button-icon-size': 'var(--grampsjs-icon-size)',
  '--md-outlined-button-outline-width': 'var(--grampsjs-outline-width)',
  '--md-outlined-button-with-leading-icon-leading-space':
    'var(--grampsjs-space-16)',
  '--md-outlined-button-with-leading-icon-trailing-space':
    'var(--grampsjs-space-24)',
  '--md-outlined-button-with-trailing-icon-leading-space':
    'var(--grampsjs-space-24)',
  '--md-outlined-button-with-trailing-icon-trailing-space':
    'var(--grampsjs-space-16)',

  // --- outlined-icon-button ----------------------------------------
  '--md-outlined-icon-button-container-height':
    'var(--grampsjs-icon-button-size)',
  '--md-outlined-icon-button-container-width':
    'var(--grampsjs-icon-button-size)',
  '--md-outlined-icon-button-disabled-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-icon-button-disabled-outline-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-outlined-icon-button-disabled-selected-container-opacity':
    'var(--grampsjs-disabled-selected-container-opacity)',
  '--md-outlined-icon-button-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-outlined-icon-button-icon-size': 'var(--grampsjs-icon-size-large)',
  '--md-outlined-icon-button-outline-width': 'var(--grampsjs-outline-width)',
  '--md-outlined-icon-button-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',

  // --- outlined-select ---------------------------------------------
  '--md-outlined-select-text-field-disabled-input-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-select-text-field-disabled-label-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-select-text-field-disabled-leading-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-select-text-field-disabled-outline-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-outlined-select-text-field-disabled-outline-width':
    'var(--grampsjs-outline-width)',
  '--md-outlined-select-text-field-disabled-supporting-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-select-text-field-disabled-trailing-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-select-text-field-focus-outline-width':
    'var(--grampsjs-outline-width-focus)',
  '--md-outlined-select-text-field-hover-outline-width':
    'var(--grampsjs-outline-width)',
  '--md-outlined-select-text-field-leading-icon-size':
    'var(--grampsjs-icon-size-large)',
  '--md-outlined-select-text-field-outline-width':
    'var(--grampsjs-outline-width)',
  '--md-outlined-select-text-field-trailing-icon-size':
    'var(--grampsjs-icon-size-large)',

  // --- outlined-text-field -----------------------------------------
  '--md-outlined-text-field-disabled-input-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-text-field-disabled-label-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-text-field-disabled-leading-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-text-field-disabled-outline-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-outlined-text-field-disabled-outline-width':
    'var(--grampsjs-outline-width)',
  '--md-outlined-text-field-disabled-supporting-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-text-field-disabled-trailing-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-outlined-text-field-focus-outline-width':
    'var(--grampsjs-outline-width-focus)',
  '--md-outlined-text-field-hover-outline-width':
    'var(--grampsjs-outline-width)',
  '--md-outlined-text-field-icon-input-space': 'var(--grampsjs-space-16)',
  '--md-outlined-text-field-input-text-prefix-trailing-space':
    'var(--grampsjs-space-2)',
  '--md-outlined-text-field-input-text-suffix-leading-space':
    'var(--grampsjs-space-2)',
  '--md-outlined-text-field-leading-icon-size':
    'var(--grampsjs-icon-size-large)',
  '--md-outlined-text-field-leading-space': 'var(--grampsjs-space-16)',
  '--md-outlined-text-field-outline-width': 'var(--grampsjs-outline-width)',
  '--md-outlined-text-field-trailing-icon-size':
    'var(--grampsjs-icon-size-large)',
  '--md-outlined-text-field-trailing-space': 'var(--grampsjs-space-16)',
  '--md-outlined-text-field-with-leading-icon-leading-space':
    'var(--grampsjs-space-12)',
  '--md-outlined-text-field-with-trailing-icon-trailing-space':
    'var(--grampsjs-space-12)',

  // --- primary-tab -------------------------------------------------
  '--md-primary-tab-active-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-primary-tab-active-indicator-shape':
    'var(--grampsjs-tab-indicator-shape)',
  '--md-primary-tab-active-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-primary-tab-container-elevation': 'var(--grampsjs-elevation-level-0)',
  '--md-primary-tab-container-height': 'var(--grampsjs-tab-height)',
  '--md-primary-tab-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-primary-tab-icon-size': 'var(--grampsjs-icon-size-large)',
  '--md-primary-tab-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-primary-tab-with-icon-and-label-text-container-height':
    'var(--grampsjs-tab-height-with-icon)',

  // --- radio -------------------------------------------------------
  '--md-radio-disabled-selected-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-radio-disabled-unselected-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-radio-hover-state-layer-opacity': 'var(--grampsjs-state-hover-opacity)',
  '--md-radio-icon-size': 'var(--grampsjs-icon-size-medium)',
  '--md-radio-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-radio-selected-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-radio-selected-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-radio-state-layer-size': 'var(--grampsjs-state-layer-size)',

  // --- slider ------------------------------------------------------
  '--md-slider-active-track-height': 'var(--grampsjs-space-4)',
  '--md-slider-disabled-active-track-opacity':
    'var(--grampsjs-disabled-checkbox-opacity)',
  '--md-slider-disabled-handle-elevation': 'var(--grampsjs-elevation-level-0)',
  '--md-slider-disabled-inactive-track-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-slider-handle-elevation': 'var(--grampsjs-elevation-level-1)',
  '--md-slider-handle-height': 'var(--grampsjs-slider-handle-size)',
  '--md-slider-handle-width': 'var(--grampsjs-slider-handle-size)',
  '--md-slider-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-slider-inactive-track-height': 'var(--grampsjs-space-4)',
  '--md-slider-label-container-height': 'var(--grampsjs-slider-label-height)',
  '--md-slider-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-slider-state-layer-size': 'var(--grampsjs-state-layer-size)',
  '--md-slider-with-overlap-handle-outline-width':
    'var(--grampsjs-outline-width)',
  '--md-slider-with-tick-marks-container-size': 'var(--grampsjs-space-2)',

  // --- switch ------------------------------------------------------
  '--md-switch-disabled-handle-opacity': 'var(--grampsjs-disabled-opacity)',
  '--md-switch-disabled-icon-opacity': 'var(--grampsjs-disabled-opacity)',
  '--md-switch-disabled-selected-handle-opacity':
    'var(--grampsjs-disabled-opaque-opacity)',
  '--md-switch-disabled-selected-icon-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-switch-disabled-track-opacity':
    'var(--grampsjs-disabled-container-opacity)',
  '--md-switch-handle-height': 'var(--grampsjs-switch-handle-size)',
  '--md-switch-handle-width': 'var(--grampsjs-switch-handle-size)',
  '--md-switch-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-switch-icon-size': 'var(--grampsjs-icon-size-small)',
  '--md-switch-pressed-handle-height':
    'var(--grampsjs-switch-handle-size-pressed)',
  '--md-switch-pressed-handle-width':
    'var(--grampsjs-switch-handle-size-pressed)',
  '--md-switch-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-switch-selected-handle-height':
    'var(--grampsjs-switch-handle-size-selected)',
  '--md-switch-selected-handle-width':
    'var(--grampsjs-switch-handle-size-selected)',
  '--md-switch-selected-hover-state-layer-opacity':
    'var(--grampsjs-state-hover-opacity)',
  '--md-switch-selected-icon-size': 'var(--grampsjs-icon-size-small)',
  '--md-switch-selected-pressed-state-layer-opacity':
    'var(--grampsjs-state-press-opacity)',
  '--md-switch-state-layer-size': 'var(--grampsjs-state-layer-size)',
  '--md-switch-touch-target-size': 'var(--grampsjs-touch-target)',
  '--md-switch-track-height': 'var(--grampsjs-switch-track-height)',
  '--md-switch-track-outline-width': 'var(--grampsjs-outline-width-thick)',
  '--md-switch-track-width': 'var(--grampsjs-switch-track-width)',
  '--md-switch-with-icon-handle-height':
    'var(--grampsjs-switch-handle-size-selected)',
  '--md-switch-with-icon-handle-width':
    'var(--grampsjs-switch-handle-size-selected)',

  // --- text-button -------------------------------------------------
  '--md-text-button-disabled-icon-opacity': 'var(--grampsjs-disabled-opacity)',
  '--md-text-button-disabled-label-text-opacity':
    'var(--grampsjs-disabled-opacity)',
  '--md-text-button-icon-size': 'var(--grampsjs-icon-size)',
  '--md-text-button-with-leading-icon-leading-space':
    'var(--grampsjs-space-12)',
  '--md-text-button-with-leading-icon-trailing-space':
    'var(--grampsjs-space-16)',
  '--md-text-button-with-trailing-icon-leading-space':
    'var(--grampsjs-space-16)',
  '--md-text-button-with-trailing-icon-trailing-space':
    'var(--grampsjs-space-12)',
}

/**
 * The primitives the Material tokens above point at.
 *
 * These are the design system's own decisions about state
 * layers, disabled states, elevation levels, icon sizes,
 * strokes and density. They are declared here rather than in
 * the shape / type / space scales because each one belongs to
 * a different concern.
 */

/**
 * The primitives the Material tokens above point at.
 *
 * These are the design system's own decisions about state
 * layers, disabled states, elevation levels, icon sizes,
 * strokes and density. They are declared here rather than in
 * the shape / type / space scales because each one belongs to
 * a different concern.
 */
export const MATERIAL_PRIMITIVES = {
  '--grampsjs-state-hover-opacity': '0.05',
  '--grampsjs-state-press-opacity': '0.09',
  '--grampsjs-state-layer-size': '40px',
  '--grampsjs-disabled-opacity': '0.38',
  '--grampsjs-disabled-container-opacity': '0.12',
  '--grampsjs-disabled-surface-opacity': '0.04',
  '--grampsjs-disabled-item-opacity': '0.3',
  '--grampsjs-disabled-checkbox-opacity': '0.38',
  '--grampsjs-disabled-selected-container-opacity': '0.12',
  '--grampsjs-disabled-opaque-opacity': '1',
  '--grampsjs-elevation-level-0': '0',
  '--grampsjs-elevation-level-1': '1',
  '--grampsjs-elevation-level-2': '2',
  '--grampsjs-elevation-level-3': '3',
  '--grampsjs-elevation-level-4': '4',
  '--grampsjs-icon-size': '18px',
  '--grampsjs-icon-size-small': '16px',
  '--grampsjs-icon-size-medium': '20px',
  '--grampsjs-icon-size-large': '24px',
  '--grampsjs-icon-size-xl': '36px',
  '--grampsjs-icon-size-xxl': '48px',
  '--grampsjs-icon-size-branded': '36px',
  '--grampsjs-outline-width': '1px',
  '--grampsjs-outline-width-none': '0px',
  '--grampsjs-outline-width-thick': '2px',
  '--grampsjs-outline-width-focus': '3px',
  '--grampsjs-tab-indicator-height': '3px',
  '--grampsjs-progress-track-height': '4px',
  '--grampsjs-progress-indicator-height': '4px',
  '--grampsjs-control-height': '34px',
  '--grampsjs-chip-height': '32px',
  '--grampsjs-icon-button-size': '40px',
  '--grampsjs-icon-button-touch-target': '40px',
  '--grampsjs-tab-height': '48px',
  '--grampsjs-tab-height-with-icon': '64px',
  '--grampsjs-menu-item-height': '48px',
  '--grampsjs-list-item-height': '56px',
  // the size a field's VALUE is drawn at. The text field reads this
  // through Material's own override point; the select does not, so it
  // reads it from the host (see SharedStyles.js).
  '--grampsjs-field-value-size': 'var(--md-sys-typescale-body-medium-size)',
  '--grampsjs-list-item-height-two-line': '72px',
  '--grampsjs-fab-size': '56px',
  '--grampsjs-fab-size-small': '40px',
  '--grampsjs-fab-size-large': '96px',
  '--grampsjs-fab-size-branded': '56px',
  '--grampsjs-fab-size-branded-large': '96px',
  '--grampsjs-progress-size': '48px',
  '--grampsjs-progress-indicator-width': '10px',
  '--grampsjs-chip-radius': 'var(--md-sys-shape-corner-small)',
  '--grampsjs-checkbox-size': '18px',
  '--grampsjs-touch-target': '48px',
  '--grampsjs-switch-handle-size': '16px',
  '--grampsjs-switch-handle-size-selected': '24px',
  '--grampsjs-switch-handle-size-pressed': '28px',
  '--grampsjs-switch-track-width': '52px',
  '--grampsjs-switch-track-height': '32px',
  '--grampsjs-slider-handle-size': '20px',
  '--grampsjs-slider-label-height': '28px',
  '--grampsjs-space-0': '0px',
  '--grampsjs-icon-size-xs': '14px',
  '--grampsjs-divider-color': 'var(--grampsjs-body-font-color-30)',
  '--grampsjs-dialog-shape': '0',
  '--grampsjs-dialog-inline-size': 'min(1200px, 95vw)',
  '--grampsjs-menu-item-disabled-opacity': '0.6',
  '--grampsjs-icon-button-opacity': '1',
  '--grampsjs-list-item-two-line-row-height': '80px',
  '--grampsjs-list-item-three-line-row-height': '96px',
  '--grampsjs-tab-indicator-shape':
    'var(--md-sys-shape-corner-extra-small) var(--md-sys-shape-corner-extra-small) 0 0',
  '--grampsjs-progress-stroke': '14',
  '--grampsjs-progress-stroke-large': '18',
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
  isDark = false,
  themeName = DEFAULT_THEME
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
  const theme = THEMES[themeName] ?? THEMES[DEFAULT_THEME]

  // Shape / type / space / elevation scales. These are theme-independent
  // (they do not derive from the seed colour), so they are written on every
  // call rather than living in CSS. A theme's own scales are written LAST,
  // so they win over the defaults — that is what makes a second theme
  // actually different rather than merely another hue.
  for (const [name, value] of Object.entries({
    ...SHAPE_SCALE,
    ...TYPE_SCALE,
    ...SPACE_SCALE,
    ...ELEVATION_SCALE,
    ...MATERIAL_PRIMITIVES,
    ...MATERIAL_SCALE,
    ...DENSITY_SCALE,
    ...COMPONENT_SCALE,
    ...(theme.shape ?? {}),
    ...(theme.type ?? {}),
    ...(theme.space ?? {}),
    ...(theme.elevation ?? {}),
    ...(theme.density ?? {}),
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

/**
 * Resolve a theme name to the seed pair and colour scheme to apply.
 *
 * A tree may override the seed colours through the tree config; a named
 * theme supplies its own. The tree's colours win, because an administrator
 * who picked a colour for their tree means it.
 */
export function resolveTheme(themeName, treeConfig = {}) {
  const theme = THEMES[themeName] ?? THEMES[DEFAULT_THEME]
  return {
    name: themeName in THEMES ? themeName : DEFAULT_THEME,
    primary:
      treeConfig[TREE_CONFIG_PRIMARY_COLOR] || theme.primary || DEFAULT_PRIMARY,
    secondary:
      treeConfig[TREE_CONFIG_SECONDARY_COLOR] ||
      theme.secondary ||
      DEFAULT_SECONDARY,
  }
}

/**
 * The browser's own chrome — the address bar on a phone, the tab strip
 * on a desktop — is painted with the `theme-color` meta tag, and it
 * sits outside the page, so it cannot be reached by a stylesheet. It
 * was a baked-in brown that did not match the app's own primary.
 */
function setChromeColor(color) {
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', color)
  }
}

export function applyScheme(
  primaryHex = DEFAULT_PRIMARY,
  secondaryHex = DEFAULT_SECONDARY,
  theme,
  themeName = DEFAULT_THEME
) {
  const isDark = getCurrentTheme(theme) === 'dark'
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  document.documentElement.setAttribute('data-style', themeName)
  // the chrome follows the app's own primary, so it changes with the
  // style and never disagrees with the page
  setChromeColor(primaryHex)
  applyColors(primaryHex, secondaryHex, isDark, themeName)
}
