/* eslint-disable class-methods-use-this */

import {css, html, LitElement} from 'lit'

import '@material/web/tabs/tabs'
import '@material/web/tabs/primary-tab'

import {GrampsjsAppStateMixin} from '../mixins/GrampsjsAppStateMixin.js'
import {fireEvent} from '../util.js'
import {sharedStyles} from '../SharedStyles.js'

const tabs = {
  'dna-matches': 'Matches',
  'dna-chromosome': 'Chromosome Browser',
  ydna: 'Y-DNA',
}

class GrampsjsDnaTabBar extends GrampsjsAppStateMixin(LitElement) {
  static get styles() {
    return [
      sharedStyles,
      css`
        md-tabs {
          /*
           * The same trap the main tab bar fell into: a max-width of
           * 100% is a percentage of the CONTAINING BLOCK, so the strip
           * was 100% wide PLUS its 20px margins — 40px wider than the
           * pane, and the pane scrolled sideways by 20px at every
           * width. The margin has to come out of the max-width.
           */
          margin: var(--grampsjs-space-16) var(--grampsjs-space-20);
          margin-bottom: var(--grampsjs-space-40);
          width: max-content;
          max-width: calc(100% - (2 * var(--grampsjs-space-20)));
        }

        md-primary-tab {
          flex: 0 0 auto;
          width: auto;
        }
      `,
    ]
  }

  render() {
    if (!(this.appState.path.page in tabs)) {
      return ''
    }
    const currentKey = this.appState.path.page
    return html`
      <md-tabs .activeTabIndex=${Object.keys(tabs).indexOf(currentKey)}>
        ${Object.keys(tabs).map(
          key => html`
            <md-primary-tab
              @click=${() =>
                this._goTo(
                  this.appState?.path?.pageId
                    ? `${key}/${this.appState?.path?.pageId}`
                    : key
                )}
            >
              ${this._(tabs[key])}
            </md-primary-tab>
          `
        )}
      </md-tabs>
      ${this.page}
    `
  }

  _goTo(path) {
    fireEvent(this, 'nav', {path})
  }
}

window.customElements.define('grampsjs-dna-tab-bar', GrampsjsDnaTabBar)
