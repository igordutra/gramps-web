import {LitElement, css, html} from 'lit'

import '@material/web/button/text-button'
import '@material/web/iconbutton/icon-button.js'
import {PencilSimple} from '../icons/phosphor.js'
import {sharedStyles} from '../SharedStyles.js'
import './GrampsjsIcon.js'
import './GrampsjsSearchResultList.js'
import {GrampsjsAppStateMixin} from '../mixins/GrampsjsAppStateMixin.js'
import './GrampsjsFormSelectObject.js'

export class GrampsjsHomePerson extends GrampsjsAppStateMixin(LitElement) {
  static get styles() {
    return [
      sharedStyles,
      css`
        h2 {
          margin-bottom: 15px;
        }

        /* The pencil sits beside the row rather than inside it. A
           list item that is a link or a button may not contain
           another button, and the row is the link: the pencil opens
           the home person picker, the row goes to the person. */
        .home-person {
          display: flex;
          align-items: center;
        }
        .home-person grampsjs-search-result-list {
          flex: 1;
          min-width: 0;
        }
      `,
    ]
  }

  static get properties() {
    return {
      homePersonDetails: {type: Object},
      homePersonMissing: {type: Boolean},
      homePersonGrampsId: {type: String},
    }
  }

  constructor() {
    super()
    this.homePersonDetails = {}
    this.homePersonMissing = false
    this.homePersonGrampsId = ''
  }

  render() {
    return html`
      <h2>${this._('Home Person')}</h2>

      ${this.homePersonGrampsId && !this.homePersonMissing
        ? html`
            <div class="content home-person">
              <grampsjs-search-result-list
                large
                linked
                .appState="${this.appState}"
                ?loading="${!this.homePersonDetails?.handle}"
                numberLoading="1"
                .data=${[
                  {object: this.homePersonDetails, object_type: 'person'},
                ]}
              >
              </grampsjs-search-result-list>
              <md-icon-button
                id="homeperson-edit"
                aria-label="${this._('Edit')}"
                @click="${this._handleEditClick}"
              >
                <grampsjs-icon path="${PencilSimple}"></grampsjs-icon>
              </md-icon-button>
            </div>
          `
        : html` <md-text-button trailing-icon @click="${this._handleEditClick}">
            ${this._('Set _Home Person')}
            <svg viewBox="0 0 256 256" slot="icon">
              <path d="${PencilSimple}" />
            </svg>
          </md-text-button>`}
      <grampsjs-form-select-object
        @select-object:changed="${this._handleHomePerson}"
        objectType="person"
        .appState="${this.appState}"
        id="homeperson-select"
        label="${this._('Select')}"
        fixedMenuPosition
        hideButton
      ></grampsjs-form-select-object>
    `
  }

  _handleEditClick(e) {
    const anchor = e.detail?.sourceElement ?? e.currentTarget
    this.renderRoot.querySelector('#homeperson-select')?.open(anchor)
  }

  _handleHomePerson(e) {
    const obj = e.detail.objects[0]
    if (obj.object?.gramps_id) {
      this.appState.updateSettings({homePerson: obj.object.gramps_id}, true)
      this.homePersonDetails = obj.object
    }
    e.preventDefault()
    e.stopPropagation()
  }
}

window.customElements.define('grampsjs-home-person', GrampsjsHomePerson)
