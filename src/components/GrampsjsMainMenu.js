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
import './GrampsjsIcon.js'

const selectedColor = 'var(--grampsjs-color-icon-selected)'
const defaultColor = 'var(--grampsjs-color-icon-default)'

class GrampsjsAppBar extends GrampsjsAppStateMixin(LitElement) {
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
      `,
    ]
  }

  static get properties() {
    return {
      editMode: {type: Boolean},
      editTitle: {type: String},
      editDialogContent: {type: String},
      saveButton: {type: Boolean},
      unreadCount: {type: Number},
    }
  }

  constructor() {
    super()
    this.editMode = false
    this.editTitle = ''
    this.editDialogContent = ''
    this.saveButton = false
    this.unreadCount = 0
    this._boundHandleNotifications = this._handleNotificationsChanged.bind(this)
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
    return html` <md-list role="list">
      <md-list-item
        type="link"
        role="none"
        href="/"
        ?selected="${p === 'home'}"
      >
        ${this._icon(House, p === 'home')} ${this._('Home')}
      </md-list-item>
      <md-list-item
        role="none"
        type="link"
        href="/blog"
        ?selected="${p === 'blog'}"
      >
        ${this._icon(Rss, p === 'blog')} ${this._('Blog')}
      </md-list-item>
      <md-list-item
        role="none"
        type="link"
        href="/tree"
        ?selected="${p === 'tree'}"
      >
        ${this._icon(TreeStructure, p === 'tree')} ${this._('Family Tree')}
      </md-list-item>
      <md-list-item
        role="none"
        type="link"
        href="/timeline"
        ?selected="${p === 'timeline'}"
      >
        ${this._icon(ChartLineUp, p === 'timeline')} ${this._('Timeline')}
      </md-list-item>
      <md-list-item
        role="none"
        type="link"
        href="/map"
        ?selected="${p === 'map'}"
      >
        ${this._icon(MapTrifold, p === 'map')} ${this._('Map')}
      </md-list-item>
      ${this.appState.frontendConfig.hideDNALink
        ? ''
        : html`
            <md-list-item
              role="none"
              type="link"
              href="/dna-matches"
              ?selected="${['dna-matches', 'dna-chromosome', 'ydna'].includes(
                p
              )}"
            >
              ${this._icon(
                Dna,
                ['dna-matches', 'dna-chromosome', 'ydna'].includes(p)
              )}
              ${this._('DNA')}
            </md-list-item>
          `}
      <md-list-item
        role="none"
        type="link"
        href="/people"
        ?selected="${listsPages.includes(p)}"
      >
        ${this._icon(ListBullets, listsPages.includes(p))} ${this._('Lists')}
      </md-list-item>
      <md-list-item
        role="none"
        type="link"
        href="/medialist"
        ?selected="${p === 'medialist'}"
      >
        ${this._icon(Image, p === 'medialist')} ${this._('Media')}
      </md-list-item>
      ${this.canUseChat
        ? html`
            <md-list-item
              role="none"
              type="link"
              href="/chat"
              ?selected="${p === 'chat'}"
            >
              ${this._icon(Sparkle, p === 'chat')} ${this._('Assistant')}
            </md-list-item>
          `
        : ''}
      <md-divider inset></md-divider>
      <md-list-item
        role="none"
        type="link"
        href="/recent"
        ?selected="${p === 'recent'}"
      >
        ${this._icon(ClockCounterClockwise, p === 'recent')}
        ${this._('History')}
      </md-list-item>
      <md-list-item
        role="none"
        type="link"
        href="/bookmarks"
        ?selected="${p === 'bookmarks'}"
      >
        ${this._icon(BookmarkSimple, p === 'bookmarks')} ${this._('_Bookmarks')}
      </md-list-item>
      <md-list-item
        role="none"
        type="link"
        href="/tasks"
        ?selected="${p === 'tasks'}"
      >
        ${this._icon(ListChecks, p === 'tasks')} ${this._('Tasks')}
      </md-list-item>
      <md-list-item
        role="none"
        type="link"
        href="/reports"
        ?selected="${p === 'reports'}"
      >
        ${this._icon(FileArrowDown, p === 'reports')}
        ${this._('_Reports').replace('_', '')}
      </md-list-item>
      <md-list-item
        role="none"
        type="link"
        href="/export"
        ?selected="${p === 'export'}"
      >
        ${this._icon(DownloadSimple, p === 'export')} ${this._('Export')}
      </md-list-item>
      <md-divider inset></md-divider>
      ${this.appState.permissions.canViewPrivate
        ? html`
            <md-list-item
              role="none"
              type="link"
              href="/revisions"
              ?selected="${p === 'revisions'}"
            >
              ${this._icon(GitCommit, p === 'revisions')} ${this._('Revisions')}
            </md-list-item>
          `
        : ''}
      <md-list-item
        role="none"
        type="link"
        href="/notifications"
        ?selected="${p === 'notifications'}"
      >
        ${this._icon(
          this.unreadCount > 0 ? BellRinging : Bell,
          p === 'notifications'
        )}
        ${this._('Notifications')}
        ${this.unreadCount > 0
          ? html`<span class="unread-badge" slot="end"
              >${this.unreadCount}</span
            >`
          : ''}
      </md-list-item>
    </md-list>`
  }
}

window.customElements.define('grampsjs-main-menu', GrampsjsAppBar)
