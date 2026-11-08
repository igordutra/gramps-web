import {css} from 'lit'

export const sharedStyles = css`
  :host {
    line-height: 1.6;
    --grampsjs-body-font-family: 'Inter var', 'Gramps Symbols', sans-serif;
    --grampsjs-heading-font-family: 'Inter var', 'Gramps Symbols', sans-serif;
    --grampsjs-mono-font-family: 'Commit Mono', monospace;
    --md-ref-typeface-plain: 'Inter var', 'Gramps Symbols', sans-serif;
    --grampsjs-body-font-size: 16px;
    font-size: var(--grampsjs-body-font-size);
    font-family: var(--grampsjs-body-font-family);
    /* 340 is too light to read comfortably at 16px on a layered surface;
       400 is the modern default body weight. */
    --grampsjs-body-font-weight: 400;
    font-weight: var(--grampsjs-body-font-weight);
    /* Slightly tighter tracking on body copy reads as considered rather
       than default-browser. */
    letter-spacing: -0.005em;
    --mdc-typography-font-family: var(--grampsjs-body-font-family);
    --md-sys-typescale-headline-small-font: var(--grampsjs-heading-font-family);
    --md-sys-typescale-headline-medium-font: var(
      --grampsjs-heading-font-family
    );
    --md-sys-typescale-headline-large-font: var(--grampsjs-heading-font-family);
    --md-sys-typescale-body-small-font: var(--grampsjs-body-font-family);
    --md-sys-typescale-body-medium-font: var(--grampsjs-body-font-family);
    --md-sys-typescale-body-large-font: var(--grampsjs-body-font-family);
    /*
     * The tab bar is navigation, so its labels carry more weight than the
     * list rows below them. Upstream wrote 15px at 500 — the label size
     * with a heavier weight. The size and the weight are taken from the
     * SAME step here, which is what the scale requires: title-small is
     * the step whose weight reads as navigation.
     */
    --md-primary-tab-label-text-weight: var(
      --md-sys-typescale-title-small-weight
    );
    --md-primary-tab-label-text-size: var(--md-sys-typescale-title-small-size);
    --md-primary-tab-active-indicator-height: var(--grampsjs-space-2);
    --md-divider-thickness: var(--grampsjs-space-0);
    --md-list-item-leading-space: var(--grampsjs-space-16);
    --md-list-item-trailing-space: var(--grampsjs-space-16);
    --mdc-list-side-padding: 16px;
  }

  /*
   * A heading for screen readers only. Every page needs a level-one
   * heading so assistive technology can announce the page name; the
   * visible title is rendered by the tab bar, so repeating it here would
   * be visual noise.
   */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /*
   * Material's select renders its SELECTED text by inheritance from
   * its host: it has no override point for it, so the token that sizes
   * a text field's value does not reach it. The select would then
   * follow the app's body font size, and the select and the text
   * field beside it would be a pixel apart. The host's own font-size
   * is set from the same token the text field uses, so the two agree
   * and both follow the theme.
   */
  md-outlined-select {
    font-size: var(--grampsjs-field-value-size);
  }

  md-list-item {
    --md-list-item-label-text-weight: var(
      --md-sys-typescale-label-large-weight
    );
    --md-list-item-label-text-size: var(--md-sys-typescale-label-large-size);
    --md-list-item-supporting-text-color: var(--grampsjs-body-font-color-50);
    --md-list-item-trailing-supporting-text-color: var(
      --grampsjs-body-font-color-60
    );
    /*
     * The trailing text is the quietest text in a row. Material's own
     * list item uses the label-small step for it, and the app's label-
     * small step is 12px — which is also the size upstream wrote as
     * 0.875rem.
     */
    --md-list-item-trailing-supporting-text-size: var(
      --md-sys-typescale-label-small-size
    );
    --md-list-item-trailing-supporting-text-weight: var(
      --md-sys-typescale-label-small-weight
    );
    /* A list item of type "link" renders an <a> inside Material's shadow
       root. The label is coloured by --md-list-item-label-text-color, but
       the anchor itself keeps the user agent's default link colour
       (rgb(0,0,238)) unless the host sets one — so any content in the
       row that is not the label inherited the browser's blue. Setting the
       colour on the host reaches the anchor, and the label still wins
       through its own token. */
    color: var(--md-sys-color-on-surface);
  }

  label {
    display: inline-flex;
    place-items: center;
    gap: 12px;
    font-size: 15px;
    font-weight: 350;
    color: var(--md-sys-color-on-background);
  }

  h2,
  h3,
  h4 {
    font-weight: 600;
    letter-spacing: -0.015em;
    font-family: var(--grampsjs-heading-font-family);
    color: var(--grampsjs-color-shade-40);
  }

  h1 {
    font-weight: 400;
    font-family: var(--grampsjs-heading-font-family);
    font-size: 34px;
  }

  h2 {
    font-weight: 550;
    font-size: 30px;
    margin-top: 10px;
    margin-bottom: 30px;
  }

  h3 {
    font-weight: 550;
    font-size: 18px;
    margin-top: 40px;
    margin-bottom: 30px;
  }

  h4 {
    font-size: 16px;
  }

  h4.label {
    font-family: var(--grampsjs-body-font-family);
    font-size: 16px;
  }

  b,
  strong {
    font-weight: 600;
  }

  a:link,
  a:visited,
  span.link {
    color: var(--grampsjs-color-link-font);
    text-decoration: none;
  }

  /*
   * A link inside a block of text needs to be distinguishable from the
   * surrounding words without relying on colour alone: either a 3:1
   * contrast against the text around it, or an underline. The accent
   * colour does not reach that contrast against the page's dark text, so
   * links inside text get an underline.
   */
  a:link,
  a:visited {
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  a:hover,
  span.link:hover {
    color: var(--grampsjs-color-link-hover);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
  }

  .link {
    cursor: pointer;
  }

  .linkicon {
    --md-icon-size: var(--grampsjs-icon-size-xs);
    margin-right: 8px;
    position: relative;
    bottom: -1px;
    opacity: 0.7;
  }

  .nopointer {
    pointer-events: none;
  }

  i svg {
    height: 1em;
    top: 0.125em;
    position: relative;
  }

  .md {
    font-weight: 400;
  }

  hr {
    border: 0;
    height: 1px;
    background: var(--grampsjs-body-font-color-20);
  }

  dt {
    font-size: 14px;
    color: var(--grampsjs-body-font-color-50);
    font-weight: 400;
    margin-bottom: 0.2em;
  }

  dd {
    margin: 0;
    padding: 0 0 1em 0;
  }

  dl div {
    float: left;
    margin-right: 3rem;
  }

  p {
    margin-top: 1.2em;
    margin-bottom: 1.2em;
  }

  .avatar.skeleton {
    width: 44px;
    height: 44px;
    border-radius: var(--md-sys-shape-corner-2xl);
  }

  .float-right {
    float: right;
  }

  grampsjs-icon.inline {
    vertical-align: middle;
    padding-right: 0.2em;
    position: relative;
    bottom: auto;
    top: auto;
    color: var(--grampsjs-body-font-color-35);
  }

  grampsjs-icon.male {
    color: var(--color-boy);
  }

  grampsjs-icon.female {
    color: var(--color-girl);
  }

  .event {
    margin-right: 1em;
  }

  .sym {
    color: var(--grampsjs-body-font-color-50);
  }

  .edit {
    color: var(--mdc-theme-secondary);
    --mdc-theme-primary: var(--mdc-theme-secondary);
    --mdc-theme-on-primary: var(--mdc-theme-on-secondary);
    --md-sys-color-primary: var(--md-sys-color-secondary);
    --md-sys-color-on-primary: var(--md-sys-color-on-secondary);
    --md-sys-color-primary-container: var(--md-sys-color-secondary-container);
    --md-sys-color-on-primary-container: var(
      --md-sys-color-on-secondary-container
    );
  }

  h2 .given-name {
    text-decoration: underline var(--grampsjs-body-font-color-60);
    text-underline-offset: 0.15em;
    text-decoration-thickness: 0.1rem;
  }

  span.skeleton {
    display: inline-block;
    background-color: var(--grampsjs-color-skeleton-background);
    background: linear-gradient(
      110deg,
      var(--grampsjs-color-skeleton-base) 8%,
      var(--grampsjs-color-skeleton-shine) 18%,
      var(--grampsjs-color-skeleton-base) 33%
    );
    opacity: 0.8;
    border-radius: var(--md-sys-shape-corner-extra-small);
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
  }

  div.skeleton {
    background-color: var(--grampsjs-color-skeleton-background);
    background: linear-gradient(
      110deg,
      var(--grampsjs-color-skeleton-base) 8%,
      var(--grampsjs-color-skeleton-shine) 18%,
      var(--grampsjs-color-skeleton-base) 33%
    );
    opacity: 0.8;
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
  }

  .card {
    padding: 1em 1em;
    border-radius: var(--md-sys-shape-corner-2xl);
    background-color: var(--grampsjs-color-shade-230);
  }

  .alert {
    background-color: var(--grampsjs-alert-background-color);
    border-left: 4px solid var(--grampsjs-alert-border-color);
    border-radius: var(--md-sys-shape-corner-small);
    padding: 0.8em 1em;
    font-size: 0.8em;
    color: var(--grampsjs-body-font-color);
    margin: 1.5em 0;
  }

  .alert.error {
    background-color: var(--grampsjs-alert-error-background-color);
    border-left-color: var(--grampsjs-alert-error-border-color);
  }

  .alert.warn {
    background-color: var(--grampsjs-alert-warn-background-color);
    border-left-color: var(--grampsjs-alert-warn-border-color);
  }

  .success {
    color: var(--grampsjs-alert-success-font-color);
  }

  .error {
    color: var(--grampsjs-alert-error-font-color);
  }

  .warn {
    color: var(--grampsjs-alert-warn-font-color);
  }

  @keyframes shine {
    to {
      background-position-x: -200%;
    }
  }

  .button-row {
    display: flex;
    align-items: center;
    gap: 0.6em;
  }

  .button-row > grampsjs-task-progress-indicator {
    display: flex;
  }

  grampsjs-task-progress-indicator.button {
    position: relative;
    top: 6px;
    left: 10px;
  }

  grampsjs-task-progress-indicator.button-left {
    position: relative;
    top: 6px;
    right: 10px;
  }

  .monospace {
    font-family: var(--grampsjs-mono-font-family);
    border: 1px solid var(--grampsjs-body-font-color-15);
    border-radius: var(--md-sys-shape-corner-small);
    background-color: var(--grampsjs-body-font-color-5);
    padding: 0.3em;
    font-size: 0.9em;
    color: var(--grampsjs-color-monospace);
  }

  /* Note highlight; the stored color is blended with the background so that
     it stays readable in dark mode */
  .note-highlight {
    background-color: color-mix(
      in srgb,
      var(--note-highlight-color) var(--grampsjs-note-highlight-strength),
      transparent
    );
  }

  md-outlined-text-field.drag-hover {
    --md-outlined-text-field-outline-color: var(--mdc-theme-secondary);
    --md-outlined-text-field-hover-outline-color: var(--mdc-theme-secondary);
    --md-outlined-text-field-hover-outline-width: var(--mdc-theme-secondary);
    --md-outlined-text-field-outline-width: var(--mdc-theme-secondary);
    --md-outlined-text-field-input-text-color: var(
      --grampsjs-body-font-color-50
    );
    --md-outlined-text-field-hover-input-text-color: var(
      --grampsjs-body-font-color-40
    );
  }

  @media (max-width: 768px) {
    :host {
      font-size: 16px;
      --md-list-item-leading-space: var(--grampsjs-space-8);
      --md-list-item-trailing-space: var(--grampsjs-space-8);
      --mdc-list-side-padding: 8px;
    }

    [slot='trailing-supporting-text'] {
      display: none;
    }

    h1 {
      font-size: 24px;
    }

    h2 {
      font-size: 24px;
    }

    h3 {
      font-size: 20px;
    }

    h4 {
      font-size: 18px;
    }
  }

  /* Hover state layer for clickable list items in view mode */
  md-list:not(.activatable):not(.toc-list) md-list-item[type='button'] {
    --md-list-item-hover-state-layer-color: var(--md-sys-color-on-surface);
    --md-list-item-hover-state-layer-opacity: var(
      --grampsjs-state-hover-opacity
    );
    --md-list-item-pressed-state-layer-color: var(--md-sys-color-on-surface);
    --md-list-item-pressed-state-layer-opacity: var(
      --grampsjs-state-press-opacity
    );
  }
`

/* A leading list icon or thumbnail as a 40px circle */
export const listAvatarStyles = css`
  grampsjs-img[slot='start'],
  grampsjs-icon[slot='start'] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* The 40px above is the circular container. grampsjs-icon draws into its
     content box, so pad it back to a 24px glyph. */
  grampsjs-icon[slot='start'] {
    box-sizing: border-box;
    padding: 8px;
    background-color: var(--grampsjs-color-icon-background);
  }
`

export const personListItemStyles = [
  listAvatarStyles,
  css`
    /* Roomier rows than the Material defaults */
    md-list-item {
      --md-list-item-one-line-container-height: var(--grampsjs-space-64);
      --md-list-item-two-line-container-height: var(
        --grampsjs-list-item-two-line-row-height
      );
      --md-list-item-three-line-container-height: var(
        --grampsjs-list-item-three-line-row-height
      );
      --md-list-item-top-space: var(--grampsjs-space-12);
      --md-list-item-bottom-space: var(--grampsjs-space-12);
    }

    /* Cursor for clickable items in view mode */
    md-list:not(.activatable) md-list-item[type='button'] {
      cursor: pointer;
    }

    span.date-col {
      display: inline-block;
      min-width: 12ch;
      margin-inline-end: 0.5em;
    }
  `,
]

/* Items of a container reordered with DragReorderController, which marks the
   container with the `reorderable` class */
export const reorderableStyles = css`
  .reorderable > * {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }

  .reorderable > [dragging] {
    position: relative;
    z-index: 1;
    cursor: grabbing;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .reorderable > [drag-shift] {
    transition: transform 0.15s ease;
  }
`

/* Drives all six md-icon-button colour tokens from one variable. An inherited
   `color` does not reach the icon, so include these styles and set:

     md-icon-button {
       --grampsjs-icon-button-color: var(--grampsjs-body-font-color-50);
     }

   The variable inherits, so setting it on an ancestor or on a class such as
   `.edit` recolours a subset. Two optional companions:
   `--grampsjs-icon-button-disabled-color` defaults to the enabled colour, and
   `--grampsjs-icon-button-disabled-opacity` should be 1 once the disabled
   colour is itself dimmed. Every fallback is md's own default, so a button that
   sets nothing keeps the standard appearance.

   These styles match by tag name, so they stay opt-in. */
export const iconButtonColorStyles = css`
  md-icon-button {
    --md-icon-button-icon-color: var(
      --grampsjs-icon-button-color,
      var(--md-sys-color-on-surface-variant)
    );
    --md-icon-button-hover-icon-color: var(
      --grampsjs-icon-button-color,
      var(--md-sys-color-on-surface-variant)
    );
    --md-icon-button-focus-icon-color: var(
      --grampsjs-icon-button-color,
      var(--md-sys-color-on-surface-variant)
    );
    --md-icon-button-pressed-icon-color: var(
      --grampsjs-icon-button-color,
      var(--md-sys-color-on-surface-variant)
    );
    --md-icon-button-disabled-icon-color: var(
      --grampsjs-icon-button-disabled-color,
      var(--grampsjs-icon-button-color, var(--md-sys-color-on-surface))
    );
    --md-icon-button-disabled-icon-opacity: var(
      --grampsjs-icon-button-disabled-opacity,
      0.38
    );
  }
`

/* Drives the colour tokens of md-text-button and md-outlined-button (label,
   icon, state layer and outline) from one variable. Include these styles and
   set:

     .danger-button {
       --grampsjs-button-color: var(--grampsjs-alert-error-font-color);
     }

   The variable inherits, so setting it on an ancestor recolours every text
   and outlined button below it. Slotted icons follow the label when they use
   `color="currentColor"`. Disabled buttons keep md's own colours, and every
   fallback is md's default, so a button that sets nothing keeps the standard
   appearance.

   These styles match by tag name, so they stay opt-in. */
export const buttonColorStyles = css`
  md-text-button {
    --md-text-button-label-text-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-text-button-hover-label-text-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-text-button-focus-label-text-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-text-button-pressed-label-text-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-text-button-icon-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-text-button-hover-icon-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-text-button-focus-icon-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-text-button-pressed-icon-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-text-button-hover-state-layer-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-text-button-pressed-state-layer-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
  }

  md-outlined-button {
    --md-outlined-button-label-text-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-outlined-button-hover-label-text-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-outlined-button-focus-label-text-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-outlined-button-pressed-label-text-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-outlined-button-icon-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-outlined-button-hover-icon-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-outlined-button-focus-icon-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-outlined-button-pressed-icon-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-outlined-button-hover-state-layer-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-outlined-button-pressed-state-layer-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-primary)
    );
    --md-outlined-button-outline-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-outline)
    );
    --md-outlined-button-pressed-outline-color: var(
      --grampsjs-button-color,
      var(--md-sys-color-outline)
    );
  }
`

/* Icon buttons sitting on the app bar inherit its colour, and are 48px so that
   they line up with each other and with the bar's own height. */
export const appBarIconButtonStyles = [
  iconButtonColorStyles,
  css`
    md-icon-button {
      --grampsjs-icon-button-color: currentColor;
      --md-icon-button-state-layer-width: var(--grampsjs-space-48);
      --md-icon-button-state-layer-height: var(--grampsjs-space-48);
    }
  `,
]
