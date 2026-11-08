/*
The dropdown menu for adding objects in the top app bar
*/

import {html, css, LitElement} from 'lit'
import {
  Archive,
  BookOpenText,
  BookmarkSimple,
  Calendar,
  Image,
  ListChecks,
  MapPin,
  Plus,
  Rss,
  Textbox,
  User,
  Users,
} from '../icons/phosphor.js'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/menu/menu'
import '@material/web/menu/menu-item'
import '@material/web/divider/divider'

import {sharedStyles, appBarIconButtonStyles} from '../SharedStyles.js'
import {GrampsjsAppStateMixin} from '../mixins/GrampsjsAppStateMixin.js'
import './GrampsjsIcon.js'

const menuItems = [
  ['Person', '/new_person', User],
  ['Family', '/new_family', Users],
  ['Event', '/new_event', Calendar],
  ['Place', '/new_place', MapPin],
  ['Source', '/new_source', BookOpenText],
  ['Citation', '/new_citation', BookmarkSimple],
  ['Repository', '/new_repository', Archive],
  ['Note', '/new_note', Textbox],
  ['Media Object', '/new_media', Image],
  ['Task', '/new_task', ListChecks],
  ['Blog Post', '/new_blog_post', Rss],
]

class GrampsjsAddMenu extends GrampsjsAppStateMixin(LitElement) {
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
          --md-menu-item-one-line-container-height: var(--grampsjs-space-48);
        }

        md-menu-item.header {
          --md-menu-item-disabled-opacity: var(
            --grampsjs-menu-item-disabled-opacity
          );
          --md-menu-item-one-line-container-height: var(--grampsjs-space-32);
          /*
           * A menu item is a small control. Upstream wrote 14px; the
           * size is the body-small step.
           */
          --md-menu-item-label-text-size: var(
            --md-sys-typescale-body-small-size
          );
          --md-menu-item-label-text-weight: var(
            --md-sys-typescale-body-small-weight
          );
        }
      `,
    ]
  }

  render() {
    return html`
      <div style="position: relative;">
        <md-icon-button
          aria-label="${this._('Add')}"
          @click="${this._handleClickAdd}"
          id="button_add"
        >
          <grampsjs-icon path="${Plus}" color="currentColor"></grampsjs-icon>
        </md-icon-button>

        <md-menu
          id="menu_add"
          anchor="button_add"
          anchor-corner="start-end"
          menu-corner="end-end"
        >
          <md-menu-item disabled class="header"
            ><div slot="headline">${this._('Add')}</div></md-menu-item
          >
          <md-divider role="separator" tabindex="-1"></md-divider>
          ${menuItems.map(menuItem => this._menuItem(...menuItem))}
        </md-menu>
      </div>
    `
  }

  _menuItem(title, url, iconPath) {
    return html`
      <md-menu-item href="${url}" graphic="icon">
        <span slot="headline">${this._(title)}</span>
        <grampsjs-icon
          slot="start"
          path="${iconPath}"
          color="var(--grampsjs-body-font-color-35)"
        ></grampsjs-icon>
      </md-menu-item>
    `
  }

  _handleClickAdd() {
    const menu = this.shadowRoot.getElementById('menu_add')
    menu.open = !menu.open
  }
}

window.customElements.define('grampsjs-add-menu', GrampsjsAddMenu)
