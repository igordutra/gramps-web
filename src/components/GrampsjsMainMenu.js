/*
The dropdown menu for adding objects in the top app bar
*/

import {html, css, LitElement} from 'lit'
import '@material/web/list/list'
import '@material/web/list/list-item'
import '@material/web/divider/divider'

import {
  Bell,
  BellRinging,
  BookmarkSimple,
  CaretLeft,
  CaretRight,
  ClockCounterClockwise,
  Dna,
  DownloadSimple,
  FileArrowDown,
  GitCommit,
  House,
  Image,
  ListBullets,
  ListChecks,
  MapTrifold,
  Rss,
  Sparkle,
  TreeStructure,
  ChartLineUp,
} from '../icons/phosphor.js'
import {sharedStyles} from '../SharedStyles.js'
import {GrampsjsAppStateMixin} from '../mixins/GrampsjsAppStateMixin.js'
import {fireEvent} from '../util.js'
import './GrampsjsIcon.js'
import './GrampsjsTooltip.js'

const selectedColor = 'var(--grampsjs-color-icon-selected)'
const defaultColor = 'var(--grampsjs-color-icon-default)'

class GrampsjsAppBar extends GrampsjsAppStateMixin(LitElement) {
  static get properties() {
    return {
      editMode: {type: Boolean},
      editTitle: {type: String},
      editDialogContent: {type: String},
      saveButton: {type: Boolean},
      unreadCount: {type: Number},
      rail: {type: Boolean},
    }
  }

  constructor() {
    super()
    this.editMode = false
    this.editTitle = ''
    this.editDialogContent = ''
    this.saveButton = false
    this.unreadCount = 0
    this.rail = false
    this._boundHandleNotifications = this._handleNotificationsChanged.bind(this)
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        md-list-item {
          --md-list-item-label-text-color: var(--grampsjs-color-drawer-text);
          /*
           * The drawer is the app's primary navigation, so its rows are
           * one step larger than a list row's. Upstream wrote 1rem at
           * 400; 1rem is the body-large step, and the body weight is the
           * lighter of the two.
           */
          --md-list-item-label-text-size: var(
            --md-sys-typescale-body-large-size
          );
          --md-list-item-label-text-weight: var(
            --md-sys-typescale-body-large-weight
          );
          --md-list-item-one-line-container-height: var(--grampsjs-space-40);
        }

        md-list-item[selected] {
          --md-list-item-label-text-color: var(--grampsjs-color-icon-selected);
          /*
           * The selected row is the one emphasis in the drawer, so it
           * takes a heavier weight than the rows around it.
           */
          --md-list-item-label-text-weight: var(
            --md-sys-typescale-title-small-weight
          );
        }

        md-divider {
          --md-divider-thickness: var(--grampsjs-outline-width);
          --md-divider-color: var(--grampsjs-divider-color);
          padding: 0 20px;
          margin: 4px 0;
        }

        .unread-badge {
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 9px;
          background: var(--md-sys-color-error, #b00020);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          line-height: 18px;
          text-align: center;
          box-sizing: border-box;
        }

        /*
         * The icon rail.
         *
         * Collapsed, the drawer is 56px wide and the labels are out of
         * the way — but they are not taken away. They are clipped, so
         * they still name the item for a screen reader, and the
         * tooltip shows them on hover.
         *
         * The icon lands 16px from the drawer's edge, which in a 56px
         * rail puts its centre exactly in the middle of the rail, so
         * nothing has to be nudged into place.
         */
        .nav-label {
          white-space: nowrap;
        }

        .nav-label.visually-hidden {
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
         * The unread count becomes a dot in the rail: there is no room
         * for a number, but the count stays in the accessibility tree.
         */
        .rail .unread-badge {
          min-width: 8px;
          width: 8px;
          height: 8px;
          padding: 0;
          font-size: 0;
          line-height: 8px;
        }

        .rail-toggle {
          cursor: pointer;
        }
      `,
    ]
  }

  connectedCallback() {
    super.connectedCallback()
    const existing = this.appState?.getNotifications?.() ?? []
    this.unreadCount = existing.filter(n => n?.read === false).length
    window.addEventListener(
      'notifications:changed',
      this._boundHandleNotifications
    )
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener(
      'notifications:changed',
      this._boundHandleNotifications
    )
  }

  _handleNotificationsChanged(e) {
    this.unreadCount = e.detail.unreadCount
  }

  _icon(path, isSelected) {
    return html`<grampsjs-icon
      slot="start"
      path="${path}"
      color="${isSelected ? selectedColor : defaultColor}"
    ></grampsjs-icon>`
  }

  /**
   * One navigation row.
   *
   * The label is wrapped in a span so that the rail can hide it
   * without taking it away from a screen reader, and so that the
   * tooltip shows the item's own name rather than a second copy of
   * it that could drift out of step.
   */
  _navItem(href, icon, label, selected) {
    return html`<md-list-item
      type="link"
      href="${href}"
      ?selected="${selected}"
    >
      ${this._icon(icon, selected)}
      <span class="nav-label ${this.rail ? 'visually-hidden' : ''}"
        >${label}</span
      >
      ${this.rail
        ? html`<grampsjs-tooltip .appState="${this.appState}"
            >${label}</grampsjs-tooltip
          >`
        : ''}
    </md-list-item>`
  }

  /**
   * The row that switches between the full drawer and the rail.
   */
  _renderRailToggle() {
    // On a small screen the drawer is a modal overlay, so a rail would
    // be a rail of nothing.
    if (this.appState.screenSize === 'small') {
      return ''
    }
    const label = this.rail ? this._('Expand menu') : this._('Collapse menu')
    return html`<md-divider inset></md-divider>
      <md-list-item
        type="button"
        class="rail-toggle"
        @click="${this._handleToggleRail}"
      >
        ${this._icon(this.rail ? CaretRight : CaretLeft, false)}
        <span class="nav-label ${this.rail ? 'visually-hidden' : ''}"
          >${label}</span
        >
        ${this.rail
          ? html`<grampsjs-tooltip .appState="${this.appState}"
              >${label}</grampsjs-tooltip
            >`
          : ''}
      </md-list-item>`
  }

  _handleToggleRail() {
    fireEvent(this, 'nav:rail-toggle', {rail: !this.rail})
  }

  render() {
    const p = this.appState.path.page
    const listsPages = [
      'people',
      'families',
      'events',
      'places',
      'citations',
      'sources',
      'repositories',
      'notes',
    ]
    return html` <md-list role="list" class="${this.rail ? 'rail' : ''}">
      ${this._navItem('/', House, this._('Home'), p === 'home')}
      ${this._navItem('/blog', Rss, this._('Blog'), p === 'blog')}
      ${this._navItem(
        '/tree',
        TreeStructure,
        this._('Family Tree'),
        p === 'tree'
      )}
      ${this._navItem(
        '/timeline',
        ChartLineUp,
        this._('Timeline'),
        p === 'timeline'
      )}
      ${this._navItem('/map', MapTrifold, this._('Map'), p === 'map')}
      ${this.appState.frontendConfig.hideDNALink
        ? ''
        : this._navItem(
            '/dna-matches',
            Dna,
            this._('DNA'),
            ['dna-matches', 'dna-chromosome', 'ydna'].includes(p)
          )}
      ${this._navItem(
        '/people',
        ListBullets,
        this._('Lists'),
        listsPages.includes(p)
      )}
      ${this._navItem('/medialist', Image, this._('Media'), p === 'medialist')}
      ${this.canUseChat
        ? this._navItem('/chat', Sparkle, this._('Assistant'), p === 'chat')
        : ''}
      <md-divider inset></md-divider>
      ${this._navItem(
        '/recent',
        ClockCounterClockwise,
        this._('History'),
        p === 'recent'
      )}
      ${this._navItem(
        '/bookmarks',
        BookmarkSimple,
        this._('_Bookmarks').replace('_', ''),
        p === 'bookmarks'
      )}
      ${this._navItem('/tasks', ListChecks, this._('Tasks'), p === 'tasks')}
      ${this._navItem(
        '/reports',
        FileArrowDown,
        this._('_Reports').replace('_', ''),
        p === 'reports'
      )}
      ${this._navItem(
        '/export',
        DownloadSimple,
        this._('Export'),
        p === 'export'
      )}
      <md-divider inset></md-divider>
      ${this.appState.permissions.canViewPrivate
        ? this._navItem(
            '/revisions',
            GitCommit,
            this._('Revisions'),
            p === 'revisions'
          )
        : ''}
      <md-list-item
        type="link"
        href="/notifications"
        ?selected="${p === 'notifications'}"
      >
        ${this._icon(
          this.unreadCount > 0 ? BellRinging : Bell,
          p === 'notifications'
        )}
        <span class="nav-label ${this.rail ? 'visually-hidden' : ''}"
          >${this._('Notifications')}</span
        >
        ${this.rail
          ? html`<grampsjs-tooltip .appState="${this.appState}"
              >${this._('Notifications')}</grampsjs-tooltip
            >`
          : ''}
        ${this.unreadCount > 0
          ? html`<span class="unread-badge" slot="end"
              >${this.unreadCount}</span
            >`
          : ''}
      </md-list-item>
      ${this._renderRailToggle()}
    </md-list>`
  }
}

window.customElements.define('grampsjs-main-menu', GrampsjsAppBar)
