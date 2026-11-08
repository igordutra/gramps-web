import {css, html} from 'lit'
import {Plus} from '../icons/phosphor.js'
import '@material/web/fab/fab.js'
import {GrampsjsView} from './GrampsjsView.js'
import '../components/GrampsjsTasks.js'
import '../components/GrampsjsIcon.js'
import {GrampsjsStaleDataMixin} from '../mixins/GrampsjsStaleDataMixin.js'

import {fireEvent, toWritableObject} from '../util.js'
import {sortTasks} from '../taskConstants.js'

export class GrampsjsViewTasks extends GrampsjsStaleDataMixin(GrampsjsView) {
  static get styles() {
    return [
      super.styles,
      css`
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
          --md-fab-container-height: var(--grampsjs-space-48);
          --md-fab-container-width: var(--grampsjs-space-48);
          --md-fab-icon-size: var(--grampsjs-icon-size-medium);
          --md-fab-container-elevation: var(--grampsjs-elevation-level-2);
          --md-fab-container-shadow-color: var(--grampsjs-shadow-color);
        }
      `,
    ]
  }

  static get properties() {
    return {
      _data: {type: Array},
      _filters: {type: Array},
    }
  }

  constructor() {
    super()
    this._data = []
    this._filters = []
    // URI of the latest request of the task list
    this._latestUri = ''
  }

  render() {
    return html`${this.renderPageHeading()}
      <h2>${this._('Tasks')}</h2>

      <grampsjs-tasks
        .appState="${this.appState}"
        .data="${this._data}"
        ?loading="${this.loading}"
        @tasks:update-attribute="${this._handleUpdateAttribute}"
        @filters:changed="${this._handleFiltersChanged}"
      ></grampsjs-tasks>

      ${this.appState.permissions.canAdd ? this.renderFab() : ''} `
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
    fireEvent(this, 'nav', {path: 'new_task'})
  }

  async _fetchData() {
    this.loading = true
    const rules = {
      rules: [
        {
          name: 'HasTag',
          values: ['ToDo'],
        },
        ...this._filters,
      ],
    }
    const uri = `/api/sources/?rules=${encodeURIComponent(
      JSON.stringify(rules)
    )}&locale=${
      this.appState.i18n.lang || 'en'
    }&sort=-gramps_id&extend=tag_list`
    this._latestUri = uri
    const data = await this.appState.apiGet(uri)
    // a later request has replaced this one
    if (uri !== this._latestUri) {
      return
    }
    this.loading = false
    if ('data' in data) {
      this.error = false
      this._data = sortTasks(data.data)
    }
    if ('error' in data) {
      this.error = true
      this._errorMessage = data.error
    }
  }

  // Updates the tasks one after another and reports the first failure
  async _handleUpdateAttribute(event) {
    const {objects, key, value} = event.detail
    let error = ''
    for (const object of objects) {
      const rest = toWritableObject(object)
      rest.attribute_list = [
        ...rest.attribute_list.filter(att => att.type !== key),
        {_class: 'SrcAttribute', type: key, value},
      ]
      // eslint-disable-next-line no-await-in-loop
      const result = await this.appState.apiPut(
        `/api/sources/${object.handle}`,
        rest,
        {dbChanged: false}
      )
      if ('error' in result && !error) {
        error = result.error
      }
    }
    fireEvent(this, 'db:changed')
    if (error) {
      fireEvent(this, 'grampsjs:error', {message: error})
    }
  }

  _handleFiltersChanged(e) {
    this._filters = e.detail.filters
    e.preventDefault()
    e.stopPropagation()
    this._fetchData()
  }

  _onLangChanged() {
    this._fetchData()
  }

  handleUpdateStaleData() {
    this._fetchData()
  }
}

window.customElements.define('grampsjs-view-tasks', GrampsjsViewTasks)
