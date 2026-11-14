/*
Base class for Gramps views
*/

import {LitElement, css, html} from 'lit'
import {sharedStyles} from '../SharedStyles.js'
import {GrampsjsAppStateMixin} from '../mixins/GrampsjsAppStateMixin.js'
import {PAGE_TITLES} from '../pageTitles.js'

export class GrampsjsView extends GrampsjsAppStateMixin(LitElement) {
  static get styles() {
    return [
      sharedStyles,
      css`
        /*
         * The page gutter.
         *
         * This used to be a margin of 25px/40px around a white panel, so
         * every page showed a grey band of canvas around its content and
         * the table then added a second gutter of its own on the inside —
         * 64px from the window edge to the first table cell.
         *
         * The gutter is now padding on the view itself, so the content
         * plane reaches the pane edge and there is exactly one gutter
         * between the window edge and the content.
         */
        :host {
          display: block;
          margin: 0;
          padding: var(--grampsjs-page-gutter, 24px);
          padding-top: var(--grampsjs-page-gutter-block, 16px);
          background-color: var(--md-sys-color-surface);
        }

        @media (max-width: 768px) {
          :host {
            padding: var(--grampsjs-page-gutter-compact, 12px);
            padding-top: var(--grampsjs-page-gutter-compact, 12px);
            --grampsjs-page-margin-inline: 20px;
          }
        }
      `,
    ]
  }

  shouldUpdate() {
    return this.active
  }

  static get properties() {
    return {
      active: {type: Boolean},
      loading: {type: Boolean},
      error: {type: Boolean},
      settings: {type: Object},
      _errorMessage: {type: String},
      _errorDetail: {type: Object},
      _hasFirstUpdated: {type: Boolean},
    }
  }

  constructor() {
    super()
    this.active = false
    this.loading = false
    this.error = false
    this.settings = {}
    this._errorMessage = ''
    this._hasFirstUpdated = false
    this._lastLangChanged = ''
    this._errorDetail = {}
    this._errorDispatched = false
  }

  render() {
    return html`${this.renderPageHeading()}${this.renderContent()}`
  }

  /**
   * The page's level-one heading.
   *
   * Rendered for assistive technology only: the visible page title comes
   * from the tab bar, and a second visible heading would be redundant.
   *
   * Views that override render() call this themselves.
   */
  renderPageHeading() {
    const {page} = this.appState?.path ?? {}
    const title = page ? PAGE_TITLES[page] : null
    if (!title) {
      return ''
    }
    return html`<h1 class="visually-hidden">${this._(title)}</h1>`
  }

  updated(changed) {
    super.updated(changed)
    const lang = this.appState?.i18n?.lang
    if (
      lang &&
      lang !== this._lastLangChanged &&
      changed.has('appState') &&
      changed.get('appState')?.i18n?.lang !== lang
    ) {
      this._lastLangChanged = lang
      this._onLangChanged(lang)
    }
    if (
      changed.has('error') ||
      changed.has('_errorMessage') ||
      changed.has('_errorDetail')
    ) {
      // Reset guard whenever the error state changes so a new error always fires
      this._errorDispatched = false
    }
    if (this.error && !this._errorDispatched) {
      this._errorDispatched = true
      this.dispatchEvent(
        new CustomEvent('grampsjs:error', {
          bubbles: true,
          composed: true,
          detail: {
            message: this._errorMessage,
            detail: this._errorDetail ?? {},
          },
        })
      )
    }
  }

  firstUpdated() {
    this._hasFirstUpdated = true
    const lang = this.appState?.i18n?.lang
    if (lang) {
      this._lastLangChanged = lang
      this._onLangChanged(lang)
    }
  }

  // Override in subclasses to fetch lang-dependent data.
  // eslint-disable-next-line no-unused-vars
  _onLangChanged(_lang) {}
}
