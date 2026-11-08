/*
The dropdown menu for adding objects in the top app bar
*/

import {html, css, LitElement} from 'lit'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/icon/icon'
import '@material/web/menu/menu'
import '@material/web/menu/menu-item'
import '@material/web/divider/divider'

import {
  ArrowSquareOut,
  Cloud,
  Info,
  Question,
  SignOut,
  UserCircle,
  UserGear,
  Users,
  Wrench,
} from '../icons/phosphor.js'
import {sharedStyles, appBarIconButtonStyles} from '../SharedStyles.js'
import {GrampsjsAppStateMixin} from '../mixins/GrampsjsAppStateMixin.js'
import {renderIconSvg} from '../icons.js'
import './GrampsjsIcon.js'
import {clickKeyHandler} from '../util.js'

const menuItems = [
  ['User settings', '/settings/user', UserGear, false],
  ['Administration', '/settings/administration', Wrench, true],
  ['Manage users', '/settings/users', Users, true],
  ['System Information', '/settings/info', Info, false],
  ['Help', '/help', Question, false],
]

class GrampsjsSettingsMenu extends GrampsjsAppStateMixin(LitElement) {
  static get styles() {
    return [
      sharedStyles,
      appBarIconButtonStyles,
      css`
        md-menu {
          --md-divider-thickness: var(--grampsjs-outline-width);
          --md-divider-color: var(--grampsjs-body-font-color-30);
        }

        md-menu-item {
          --md-menu-item-top-space: var(--grampsjs-space-0);
          --md-menu-item-bottom-space: var(--grampsjs-space-0);
          --md-menu-item-one-line-container-height: var(--grampsjs-space-56);
          --icon-color: var(--grampsjs-body-font-color-35);
        }
        md-menu-item.red {
          --md-menu-item-label-text-color: var(--grampsjs-logout-font-color);
          --icon-color: var(--grampsjs-logout-font-color);
        }
        md-menu {
          --md-divider-thickness: var(--grampsjs-outline-width);
          --md-divider-color: var(--grampsjs-body-font-color-30);
        }
      `,
    ]
  }

  render() {
    return html`
      <div style="position: relative;">
        <md-icon-button
          aria-label="${this._('Settings')}"
          @click="${this._handleClickSettings}"
          id="button_settings"
        >
          <grampsjs-icon
            path="${UserCircle}"
            color="currentColor"
          ></grampsjs-icon>
        </md-icon-button>

        <md-menu
          id="menu_settings"
          anchor="button_settings"
          anchor-corner="start-end"
          menu-corner="end-end"
        >
        ${menuItems.map(menuItem => this._menuItem(...menuItem))}
          ${this._renderAccountItem()}
          <md-divider role="separator" tabindex="-1"></md-divider>
          <md-menu-item class="red"
            @click="${() => this.appState.signout()}"
            @keydown="${clickKeyHandler}"
          >
            <div slot="headline">${this._('Log out')}</div>
            <md-icon slot="start">${renderIconSvg(
              SignOut,
              'var(--icon-color)'
            )}</md-icon>
          </md-menu-item>
      </div>
    `
  }

  // Link to the page where the provider hosting this instance lets owners manage
  // it, set via `accountUrl` and `accountName` in config.js. The label is the
  // provider's name, a proper noun, so it needs no translation. Shown to tree
  // owners only, since nobody else can act on what it leads to.
  _renderAccountItem() {
    const {accountUrl, accountName} = this.appState.frontendConfig
    if (
      !accountUrl ||
      !accountName ||
      !this.appState.permissions.canManageUsers
    ) {
      return ''
    }
    return html`
      <md-divider role="separator" tabindex="-1"></md-divider>
      <md-menu-item href="${accountUrl}" target="_blank">
        <div slot="headline">${accountName}</div>
        <grampsjs-icon
          slot="start"
          path="${Cloud}"
          color="var(--icon-color)"
        ></grampsjs-icon>
        <grampsjs-icon
          slot="end"
          path="${ArrowSquareOut}"
          color="var(--icon-color)"
          height="18"
          width="18"
        ></grampsjs-icon>
      </md-menu-item>
    `
  }

  _menuItem(title, url, icon, needsAdminPermission) {
    if (needsAdminPermission && !this.appState.permissions.canManageUsers) {
      return ''
    }
    return html`
      <md-menu-item href="${url}">
        <div slot="headline">${this._(title)}</div>
        <md-icon slot="start"
          >${renderIconSvg(icon, 'var(--icon-color)')}</md-icon
        >
      </md-menu-item>
    `
  }

  _handleClickSettings() {
    const menu = this.shadowRoot.getElementById('menu_settings')
    menu.open = !menu.open
  }
}

window.customElements.define('grampsjs-settings-menu', GrampsjsSettingsMenu)
