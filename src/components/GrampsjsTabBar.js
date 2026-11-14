import {html, css, LitElement} from 'lit'

import '@material/web/tabs/tabs'
import '@material/web/tabs/primary-tab'

import {fireEvent} from '../util.js'
import {sharedStyles} from '../SharedStyles.js'
import {GrampsjsAppStateMixin} from '../mixins/GrampsjsAppStateMixin.js'

const tabs = {
  people: 'People',
  families: 'Families',
  events: 'Events',
  places: 'Places',
  sources: 'Sources',
  citations: 'Citations',
  repositories: 'Repositories',
  notes: 'Notes',
  settings: {
    user: 'User settings',
    administration: 'Administration',
    users: 'Manage users',
    info: 'System Information',
  },
}

class GrampsjsTabBar extends GrampsjsAppStateMixin(LitElement) {
  static get styles() {
    return [
      sharedStyles,
      css`
        /*
         * The category strip.
         *
         * The margin was 20px on all sides with a max-width of 100%. The
         * max-width is a percentage of the CONTAINING BLOCK, so the strip
         * was 100% wide plus 40px of margin — it overflowed the pane by
         * 40px at every width and pushed the whole app sideways on a
         * phone. Subtracting the margins from the max-width fixes it, and
         * the margins come from the space scale so they stay on the same
         * rhythm as the page gutter.
         */
        md-tabs {
          margin: var(--grampsjs-space-16) var(--grampsjs-space-20);
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
    const currentKey = this.appState.path.pageId || this.appState.path.page
    if (!(this.appState.path.page in tabs)) {
      return ''
    }
    if (
      this.appState.path.pageId &&
      this.appState.path.page in tabs &&
      !(this.appState.path.pageId in tabs[this.appState.path.page])
    ) {
      return ''
    }
    let currentTabs
    if (!this.appState.path.pageId) {
      currentTabs = Object.fromEntries(
        Object.entries(tabs).filter(([, value]) => typeof value === 'string')
      )
    } else {
      currentTabs = tabs[this.appState.path.page]
    }
    const filteredTabKeys = Object.keys(currentTabs).filter(key =>
      this._permissionToSeeTab(this.appState.path.page, key)
    )
    return html`
      <md-tabs .activeTabIndex=${filteredTabKeys.indexOf(currentKey)}>
        ${filteredTabKeys.map(
          key =>
            html`
              <md-primary-tab @click="${() => this._goTo(key)}"
                >${this._(currentTabs[key])}</md-primary-tab
              >
            `
        )}
      </md-tabs>
    `
  }

  _permissionToSeeTab(page, key) {
    if (page !== 'settings') {
      return true
    }
    switch (key) {
      case 'administration':
        return this.appState.permissions.canManageUsers
      case 'users':
        return this.appState.permissions.canManageUsers
      case 'user':
        return true
      case 'info':
        return true
      default:
        return false
    }
  }

  _goTo(key) {
    if (this.appState.path.pageId) {
      fireEvent(this, 'nav', {path: `${this.appState.path.page}/${key}`})
    } else {
      fireEvent(this, 'nav', {path: key})
    }
  }
}

window.customElements.define('grampsjs-tab-bar', GrampsjsTabBar)
