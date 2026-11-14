import {css, html} from 'lit'

import '@material/web/list/list'
import '@material/web/list/list-item'
import {
  Archive,
  BookOpenText,
  BookmarkSimple,
  Calendar,
  CalendarMinus,
  CalendarPlus,
  GitCommit,
  Image,
  ImageSquare,
  MapPin,
  MapPinLine,
  MapPinPlus,
  Tag,
  Textbox,
  ChartLineUp,
  UserCircleGear,
  UserMinus,
  UserPlus,
  Users,
  UsersThree,
} from '../icons/phosphor.js'
import '../components/GrampsjsPagination.js'
import '../components/GrampsjsTimedelta.js'
import '../components/GrampsjsIcon.js'

import {GrampsjsView} from './GrampsjsView.js'
import {GrampsjsStaleDataMixin} from '../mixins/GrampsjsStaleDataMixin.js'

const changeIcons = {
  Person_0: UserPlus,
  Family_0: UsersThree,
  Event_0: CalendarPlus,
  Place_0: MapPinPlus,
  Source_0: BookOpenText,
  Citation_0: BookmarkSimple,
  Repository_0: Archive,
  Note_0: Textbox,
  Tag_0: Tag,
  Media_0: Image,
  Person_1: UserCircleGear,
  Family_1: Users,
  Event_1: Calendar,
  Place_1: MapPin,
  Source_1: BookOpenText,
  Citation_1: BookmarkSimple,
  Repository_1: Archive,
  Note_1: Textbox,
  Tag_1: Tag,
  Media_1: ImageSquare,
  Person_2: UserMinus,
  Family_2: Users,
  Event_2: CalendarMinus,
  Place_2: MapPinLine,
  Source_2: BookOpenText,
  Citation_2: BookmarkSimple,
  Repository_2: Archive,
  Note_2: Textbox,
  Tag_2: Tag,
  Media_2: Image,
}

export class GrampsjsViewRevisions extends GrampsjsStaleDataMixin(
  GrampsjsView
) {
  static get styles() {
    return [
      super.styles,
      css`
        md-list-item[type='text'] {
          --md-list-item-label-text-color: var(--grampsjs-body-font-color-48);
        }

        grampsjs-icon[slot='end'] {
          height: 22px;
          width: 22px;
          opacity: 0.9;
        }

        md-divider {
          --md-divider-thickness: var(--grampsjs-outline-width);
          --md-divider-color: var(--grampsjs-body-font-color-10);
        }

        .counter {
          position: relative;
          color: var(--grampsjs-color-icon);
          font-size: 11px;
          min-width: 14px;
          height: 14px;
          line-height: 16px;
          left: -17px;
          top: -6px;
          font-weight: 600;
          background-color: var(--grampsjs-color-icon-background);
          border-radius: 100px;
          display: inline-block;
          text-align: center;
          vertical-align: middle;
        }
      `,
    ]
  }

  static get properties() {
    return {
      _data: {type: Array},
      _page: {type: Number},
      _pages: {type: Number},
      _pageSize: {type: Number},
    }
  }

  constructor() {
    super()
    this._data = []
    this._page = 1
    this._pages = -1
    this._pageSize = 20
  }

  render() {
    return html`${this.renderPageHeading()}
      <h2>${this._('Revision History')}</h2>

      <md-list role="list">
        <md-divider></md-divider>
        ${this._data.map(txn => this._renderTransaction(txn))}
      </md-list>

      <grampsjs-pagination
        page="${this._page}"
        pages="${this._pages}"
        total="${this._totalCount}"
        pageSize="${this._pageSize}"
        @page:changed="${this._handlePageChanged}"
        .appState="${this.appState}"
      ></grampsjs-pagination> `
  }

  _renderTransaction(txn) {
    // eslint-disable-next-line camelcase
    const counts = txn.changes.reduce((acc, {obj_class, trans_type}) => {
      // eslint-disable-next-line camelcase
      const key = `${obj_class}_${trans_type}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return html`<md-list-item
        ?interactive="${!!txn.changes?.length}"
        type="${txn.changes?.length ? 'link' : 'text'}"
        href="${txn.changes?.length ? `/revision/${txn.id}` : ''}"
      >
        <div slot="headline">${this._(txn.description)}</div>
        <grampsjs-icon
          slot="start"
          path="${GitCommit}"
          color="var(--grampsjs-body-font-color-50)"
        ></grampsjs-icon>
        ${txn.changes?.length
          ? Object.keys(counts).map(key =>
              changeIcons[key]
                ? html`<grampsjs-icon
                    slot="end"
                    path="${changeIcons[key]}"
                    color="var(--grampsjs-body-font-color-45)"
                  ></grampsjs-icon>`
                : ''
            )
          : html`<grampsjs-icon
              slot="end"
              path="${ChartLineUp}"
              color="var(--grampsjs-body-font-color-45)"
            ></grampsjs-icon>`}
        <div slot="supporting-text">
          <span class="user">
            ${txn.connection?.user
              ? this._renderUser(txn.connection?.user)
              : this._('Unknown')},
          </span>
          <span class="time">
            <grampsjs-timedelta
              timestamp="${txn.timestamp}"
              locale="${this.appState.i18n.lang}"
            ></grampsjs-timedelta>
          </span>
        </div>
      </md-list-item>
      <md-divider></md-divider> `
  }

  // eslint-disable-next-line class-methods-use-this
  _renderUser(user) {
    return user.full_name || user.name
  }

  async _fetchData() {
    this.loading = true
    const url = `/api/transactions/history/?sort=-id&page=${this._page}&pagesize=${this._pageSize}`
    const data = await this.appState.apiGet(url)
    this.loading = false
    if ('data' in data) {
      this.error = false
      this._data = data.data
      this._totalCount = data.total_count
      this._pages = Math.ceil(this._totalCount / this._pageSize)
    } else if ('error' in data) {
      this.error = true
      this._errorMessage = data.error
    }
  }

  _handlePageChanged(event) {
    this._page = event.detail.page
  }

  firstUpdated() {
    this._fetchData()
  }

  handleUpdateStaleData() {
    this._fetchData()
  }

  update(changed) {
    super.update(changed)
    if (changed.has('_page') && changed._page !== this._page) {
      this._fetchData()
    }
  }
}

window.customElements.define('grampsjs-view-revisions', GrampsjsViewRevisions)
