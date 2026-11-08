import {css, html} from 'lit'
import {Plus} from '../icons/phosphor.js'
import '@material/web/fab/fab.js'
import {GrampsjsView} from './GrampsjsView.js'
import '../components/GrampsjsBlogPostPreview.js'
import '../components/GrampsjsIcon.js'

import {GrampsjsStaleDataMixin} from '../mixins/GrampsjsStaleDataMixin.js'

import {fireEvent, clickKeyHandler} from '../util.js'

export class GrampsjsViewBlog extends GrampsjsStaleDataMixin(GrampsjsView) {
  static get styles() {
    return [
      super.styles,
      css`
        h2 {
          margin-left: 15px;
        }

        .muted {
          /* 40% opacity left this at a 2.5:1 contrast against the white
             panel. Use the app's muted text colour instead, which is
             already tuned for readability. */
          opacity: 1;
          color: var(--grampsjs-body-font-color-60);
        }

        #posts {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(
            auto-fill,
            minmax(min(420px, 100%), 1fr)
          );
        }

        .post {
          padding: 0.8em 1em;
          cursor: pointer;
          outline: 2px solid var(--grampsjs-body-font-color-0);
          transition: outline-color 0.3s ease-in;
        }

        .post:focus,
        .post:focus-within {
          outline: 2px solid var(--grampsjs-body-font-color-10);
          border-radius: var(--md-sys-shape-corner-small);
        }

        md-fab {
          position: fixed;
          /* The button belongs to the content column, not to the window.
             The column now reaches the viewport edge and the page scrollbar
             sits outside it, so the button is inset by the page gutter plus
             the scrollbar width — otherwise it hangs into the scrollbar. */
          bottom: var(--grampsjs-space-24, 24px);
          right: calc(
            var(--grampsjs-page-gutter, 24px) +
              var(--grampsjs-scrollbar-width, 0px)
          );
          /* Material's FAB is a large saturated disc with a heavy shadow.
             A modern action button is smaller, softer and matches the
             density of the rest of the toolbar. */
          --md-fab-container-shape: var(--md-sys-shape-corner-large);
          --md-fab-container-height: 48px;
          --md-fab-container-width: 48px;
          --md-fab-icon-size: 22px;
          --md-fab-container-elevation: 2;
          --md-fab-container-shadow-color: var(--grampsjs-shadow-color);
        }
      `,
    ]
  }

  static get properties() {
    return {
      _dataSources: {type: Array},
      _dataNotes: {type: Array},
      _totalCount: {type: Number},
      _page: {type: Number},
      _pages: {type: Number},
    }
  }

  constructor() {
    super()
    this._dataSources = []
    this._dataNotes = []
    this._page = 1
    this._pageSize = 6
    this._firstLoaded = false
    this._totalCount = -1
    this._pages = -1
  }

  renderContent() {
    return html`
      ${this.renderPosts()}
      ${this._totalCount > 0 ? this.renderPagination() : ''}
      ${this.appState.permissions.canAdd ? this.renderFab() : ''}
    `
  }

  renderFab() {
    return html`
      <md-fab
        variant="secondary"
        @click=${this._handleClickAdd}
        aria-label="${this._('Add')}"
      >
        <grampsjs-icon
          slot="icon"
          .path="${Plus}"
          color="var(--mdc-theme-on-secondary)"
        ></grampsjs-icon>
      </md-fab>
    `
  }

  _handleClickAdd() {
    fireEvent(this, 'nav', {path: 'new_blog_post'})
  }

  renderPosts() {
    if (this._firstLoaded && this._dataSources.length === 0) {
      return html`
        <h2>${this._('Blog')}</h2>
        <p class="muted">
          ${this._("To start using the blog, add a source with tag 'Blog'.")}
        </p>
      `
    }
    if (this.loading) {
      return html``
    }
    return html`
      <h2>${this._('Blog')}</h2>
      <div id="posts">
        ${this._dataSources.map(
          (source, i) => this.renderPost(source, this._dataNotes[i]),
          this
        )}
      </div>
    `
  }

  renderPagination() {
    return html`
      <grampsjs-pagination
        page="${this._page}"
        pages="${this._pages}"
        total="${this._totalCount}"
        pageSize="${this._pageSize}"
        @page:changed="${this._handlePageChanged}"
        .appState="${this.appState}"
      ></grampsjs-pagination>
    `
  }

  _handlePageChanged(event) {
    this._page = event.detail.page
    this._fetchData()
  }

  // eslint-disable-next-line no-dupe-class-members
  renderPost(source) {
    return html`
      <div
        class="post"
        tabindex="0"
        @click="${() => this._handlePreviewClick(source.gramps_id)}"
        @keydown="${clickKeyHandler}"
      >
        <div>
          <grampsjs-blog-post-preview
            .data="${source}"
            .appState="${this.appState}"
          ></grampsjs-blog-post-preview>
        </div>
      </div>
    `
  }

  firstUpdated() {
    this._fetchData()
  }

  _handlePreviewClick(grampsId) {
    fireEvent(this, 'nav', {path: `blog/${grampsId}`})
  }

  handleUpdateStaleData() {
    this._fetchData()
  }

  async _fetchData() {
    this.loading = true
    const rules = {
      rules: [
        {
          name: 'HasTag',
          values: ['Blog'],
        },
      ],
    }
    const uri = `/api/sources/?rules=${encodeURIComponent(
      JSON.stringify(rules)
    )}&page=${this._page}&pagesize=${this._pageSize}&sort=-change&locale=${
      this.appState.i18n.lang || 'en'
    }&profile=all&extend=all`
    await this.appState.apiGet(uri).then(data => {
      if ('data' in data) {
        this.error = false
        this._dataSources = data.data
        this._totalCount = data.total_count
        this._pages = Math.ceil(this._totalCount / this._pageSize)
      } else if ('error' in data) {
        this.error = true
        this._errorMessage = data.error
      }
    })
    this.loading = false
    this._firstLoaded = true
  }
}

window.customElements.define('grampsjs-view-blog', GrampsjsViewBlog)
