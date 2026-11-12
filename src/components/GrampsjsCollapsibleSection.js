import {LitElement, html, css} from 'lit'
import {CaretRight} from '../icons/phosphor.js'
import './GrampsjsIcon.js'

export class GrampsjsCollapsibleSection extends LitElement {
  static get properties() {
    return {
      heading: {type: String},
      description: {type: String},
      open: {type: Boolean},
    }
  }

  constructor() {
    super()
    this.heading = ''
    this.description = ''
    this.open = false
  }

  static get styles() {
    return css`
      summary {
        cursor: pointer;
        list-style: none;
        display: grid;
        grid-template-columns: 22px 1fr;
        grid-template-areas:
          'chevron title'
          '. description';
        column-gap: 0.4em;
        padding: 1.25em 0 0.75em;
        user-select: none;
      }

      summary::-webkit-details-marker {
        display: none;
      }

      summary::marker {
        display: none;
      }

      summary:hover {
        opacity: 0.8;
      }

      .chevron {
        grid-area: chevron;
        align-self: center;
        display: flex;
        align-items: center;
        transition: transform 0.2s ease;
      }

      details[open] .chevron {
        transform: rotate(90deg);
      }

      .title {
        grid-area: title;
        font-size: 1.5em;
        font-weight: 500;
        /* The section title is a real HEADING, not a styled span. A
           section whose title is not a heading leaves the document
           outline skipping a level -- the page's <h1> followed
           straight by the section's <h3> -- and axe's heading-order
           rule fires on it. A heading inside <summary> is valid HTML:
           the summary's content model is phrasing content optionally
           intermixed with heading content.

           The heading's own margins and size are reset so the section
           looks exactly as it did when the title was a span. */
        margin: 0;
      }

      .description {
        grid-area: description;
        font-size: 0.95em;
        color: var(--md-sys-color-on-surface-variant, currentColor);
        opacity: 0.75;
        margin-top: 0.1em;
      }

      .content {
        padding-left: calc(22px + 0.4em);
        padding-bottom: 1.25em;
      }
    `
  }

  render() {
    return html`
      <details ?open="${this.open}">
        <summary>
          <span class="chevron">
            <grampsjs-icon
              path="${CaretRight}"
              height="22"
              color="var(--md-sys-color-on-surface)"
            ></grampsjs-icon>
          </span>
          <h2 class="title">${this.heading}</h2>
          ${this.description
            ? html`<span class="description">${this.description}</span>`
            : ''}
        </summary>
        <div class="content">
          <slot></slot>
        </div>
      </details>
    `
  }
}

window.customElements.define(
  'grampsjs-collapsible-section',
  GrampsjsCollapsibleSection
)
