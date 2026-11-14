import {LitElement, html, css} from 'lit'
import {sharedStyles} from '../SharedStyles.js'
import {GrampsjsAppStateMixin} from '../mixins/GrampsjsAppStateMixin.js'

export class GrampsjsObjectToc extends GrampsjsAppStateMixin(LitElement) {
  static get styles() {
    return [
      sharedStyles,
      css`
        md-list.toc-list {
          /*
           * The table of contents is a quiet index beside the record, so
           * its entries are the smallest text in the app. Upstream wrote
           * 14px at 400; the size and the weight are the body-small step.
           */
          --md-list-item-label-text-weight: var(
            --md-sys-typescale-body-small-weight
          );
          --md-list-item-label-text-size: var(
            --md-sys-typescale-body-small-size
          );
          --md-list-item-label-text-color: var(
            --md-sys-color-on-surface-variant
          );
          --md-list-item-hover-state-layer-color: var(--md-sys-color-surface);
          --md-list-item-top-space: var(--grampsjs-space-0);
          --md-list-item-bottom-space: var(--grampsjs-space-0);
          --md-list-item-one-line-container-height: var(--grampsjs-space-40);
        }

        md-list-item.active {
          /*
           * The active row is the one emphasis in the list, so it takes
           * a heavier weight than the rows around it.
           */
          --md-list-item-label-text-weight: var(
            --md-sys-typescale-title-small-weight
          );
        }

        h3 {
          margin-left: 14px;
          margin-bottom: 12px;
          margin-top: 0;
          font-size: 16px;
          font-weight: 420;
          opacity: 0.55;
        }
      `,
    ]
  }

  static get properties() {
    return {
      tabs: {type: Object},
      activeSection: {type: String},
      heading: {type: Boolean},
    }
  }

  constructor() {
    super()
    this.tabs = {}
    this.activeSection = ''
    this.heading = false
  }

  render() {
    const tabKeys = Object.keys(this.tabs)
    if (tabKeys.length <= 1) {
      return html`` // Don't show TOC if there's only one section
    }

    return html`
      ${this.heading ? html`<h3>${this._('Table Of Contents')}</h3>` : ''}
      <md-list class="toc-list" role="list">
        ${tabKeys.map(
          key => html`
            <md-list-item
              type="button"
              id="toc-item-${key}"
              class="${key === this.activeSection ? 'active' : ''}"
              @click="${e => this._handleItemClick(e, key)}"
            >
              ${this._(this.tabs[key].title)}
            </md-list-item>
          `
        )}
      </md-list>
    `
  }

  setActiveSection(sectionKey) {
    this.activeSection = sectionKey
  }

  _handleItemClick(e, sectionKey) {
    e.preventDefault()
    e.stopPropagation()

    this.activeSection = sectionKey

    this.dispatchEvent(
      new CustomEvent('toc-item-click', {
        detail: {
          sectionKey,
        },
        bubbles: true,
        composed: true,
      })
    )
  }
}

customElements.define('grampsjs-object-toc', GrampsjsObjectToc)
