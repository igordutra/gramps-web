import {html, css} from 'lit'
import {keyed} from 'lit/directives/keyed.js'

import '@material/web/button/outlined-button'
import '@material/web/select/filled-select'
import '@material/web/select/select-option'
import '@material/web/textfield/filled-text-field'

import {supportsPersistentAccessTokens} from '../components/GrampsjsAccessTokens.js'
import '../components/GrampsjsCollapsibleSection.js'
import '../components/GrampsjsFormSelectObjectList.js'
import {userRoles} from '../components/GrampsjsFormUser.js'
import '../components/GrampsjsIcon.js'
import '../components/GrampsjsOidcAccounts.js'
import '../components/GrampsjsShareUrl.js'
import '../components/GrampsjsSysinfo.js'
import '../components/GrampsjsTaskProgressIndicator.js'
import '../components/GrampsjsTreeQuotas.js'
import '../components/GrampsjsUsers.js'
import {GrampsjsView} from './GrampsjsView.js'

import {Check, Copy} from '../icons/phosphor.js'
import {
  __APIHOST__,
  ACCESS_TOKEN_EXPIRY_MS,
  apiGetOIDCConfig,
  storeAuthToken,
  storeRefreshToken,
  getTreeConfig,
} from '../api.js'
import {fireEvent} from '../util.js'
import {
  applyScheme,
  resolveTheme,
  DEFAULT_PRIMARY,
  DEFAULT_SECONDARY,
  DEFAULT_THEME,
  THEMES,
} from '../theme.js'
import {DEFAULT_TREE_VIEW, TREE_VIEWS} from '../treeDefaults.js'
import {
  SYMBOL_SET_DEFAULT,
  SYMBOL_SET_OPTIONS,
  getSymbolSetLabel,
} from '../symbols.js'

export class GrampsjsViewSettingsUser extends GrampsjsView {
  static get styles() {
    return [
      ...super.styles,
      css`
        .token-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        h3 {
          font-size: 1.1em;
          font-weight: 500;
          margin: 1.5em 0 0.5em;
        }

        .tree-preferences {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px 24px;
          align-items: start;
        }

        .tree-preferences md-filled-select {
          width: 100%;
        }

        .profile-field {
          display: flex;
          align-items: end;
          gap: 8px;
        }

        .profile-field md-filled-text-field {
          flex: 1;
        }
      `,
    ]
  }

  static get properties() {
    return {
      _userInfo: {type: Object},
      _translations: {type: Array},
      _langLoading: {type: Boolean},
      _tokenCopied: {type: Boolean},
      _localAuthDisabled: {type: Boolean},
      _hasLinkedAccount: {type: Boolean},
    }
  }

  constructor() {
    super()
    this._userInfo = {}
    this._translations = []
    this._langLoading = false
    this._tokenCopied = false
    this._localAuthDisabled = false
    this._hasLinkedAccount = false
  }

  renderContent() {
    return html`
      <p style="margin-top: 2.5em;">
        ${this._('Changes here only affect your account.')}
      </p>

      <grampsjs-collapsible-section
        heading="${this._('Account')}"
        description="${this._(
          'Profile info, credentials, and account security'
        )}"
      >
        <dl>
          <div>
            <dt><span>${this._('Username: ').replace(':', '')}</span></dt>
            <dd>${this._userInfo?.name}</dd>
          </div>
          <div>
            <dt><span>${this._('Full Name')}</span></dt>
            <dd>${this._userInfo?.full_name}</dd>
          </div>
          <div>
            <dt><span>${this._('User group')}</span></dt>
            <dd>${this._(userRoles[this._userInfo?.role])}</dd>
          </div>
        </dl>
        <div style="clear: both;"></div>

        <h3>${this._('Change username')}</h3>
        ${this.renderChangeUsername()}

        <h3>${this._('Change full name')}</h3>
        ${this.renderChangeFullName()}

        <h3>${this._('Change E-mail')}</h3>
        ${this.renderChangeEmail()}
        ${this._localAuthDisabled
          ? ''
          : html`
              <h3>${this._('Change password')}</h3>
              ${this.renderChangePw()}
            `}
        ${supportsPersistentAccessTokens(this.appState?.dbInfo)
          ? html`
              <h3>${this._('Access tokens')}</h3>
              <grampsjs-access-tokens
                .appState="${this.appState}"
              ></grampsjs-access-tokens>
            `
          : ''}
        <grampsjs-oidc-accounts
          @oidc-accounts:changed="${this._handleOidcAccountsChanged}"
          .appState="${this.appState}"
          username="${this._userInfo?.name || ''}"
        ></grampsjs-oidc-accounts>
      </grampsjs-collapsible-section>

      <grampsjs-collapsible-section
        heading="${this._('Appearance')}"
        description="${this._('Display preferences saved on this device')}"
      >
        <h3>${this._('Select language')}</h3>
        ${this.renderLangSelect()}
        <h3>${this._('Select theme')}</h3>
        ${this.renderThemeSelect()}
        <h3>${this._('Select style')}</h3>
        ${this.renderStyleSelect()}
        <h3>${this._('Genealogical symbols')}</h3>
        ${this.renderSymbolsSelect()}
        <h3>${this._('Family tree preferences')}</h3>
        ${this.renderTreePreferences()}
      </grampsjs-collapsible-section>

      <grampsjs-collapsible-section
        heading="${this._('Developer Tools')}"
        description="${this._('Access the interactive API documentation')}"
      >
        ${this.renderApiToken()}
      </grampsjs-collapsible-section>
    `
  }

  renderLangSelect() {
    // md-select only picks up the selected option on its first render, but
    // the options arrive later, so render it anew once they are loaded.
    return keyed(
      this._translations.length,
      html`
        <md-filled-select
          id="select-language"
          label="${this._langLoading
            ? this._('Loading items...')
            : this._('Language')}"
          @change="${this._handleLangSelected}"
          ?disabled="${this._langLoading}"
        >
          ${this._translations.map(
            langObj => html`
              <md-select-option
                value="${langObj.language}"
                ?selected="${langObj.language === this.appState.settings.lang}"
                >${langObj.native}</md-select-option
              >
            `,
            this
          )}
        </md-filled-select>
      `
    )
  }

  _handleLangSelected(event) {
    const key = event.target.value
    if (key) {
      this.appState.updateSettings({lang: key})
    }
  }

  firstUpdated() {
    if (this.active) {
      this._fetchOwnUserDetails()
    }
    this._fetchAuthConfig()
  }

  update(changed) {
    super.update(changed)
    if (changed.has('active') && this.active) {
      if (!this._langLoading && this._translations.length === 0) {
        this._fetchDataLang()
      }
      this.renderRoot.querySelector('grampsjs-access-tokens')?.refresh()
      this.renderRoot.querySelector('grampsjs-oidc-accounts')?.refresh()
    }
  }

  async _fetchDataLang() {
    this.loading = true
    this._langLoading = true
    const dataTrans = await this.appState.apiGet('/api/translations/')
    if ('data' in dataTrans) {
      this.error = false
      this._translations = dataTrans.data
    } else if ('error' in dataTrans) {
      this.error = true
      this._errorMessage = dataTrans.error
      return
    }
    this._langLoading = false
    this.loading = false
  }

  renderThemeSelect() {
    const theme = this.appState.settings.theme ?? 'system'
    return html`
      <md-filled-select
        id="select-theme"
        label="${this._('Theme')}"
        @change="${this._handleThemeSelected}"
      >
        <md-select-option value="system" ?selected="${theme === 'system'}"
          >${this._('System')}</md-select-option
        >
        <md-select-option value="light" ?selected="${theme === 'light'}"
          >${this._('Light')}</md-select-option
        >
        <md-select-option value="dark" ?selected="${theme === 'dark'}"
          >${this._('Dark')}</md-select-option
        >
      </md-filled-select>
    `
  }

  /**
   * The style picker.
   *
   * A theme here is a whole design language, not a hue: it carries the
   * shape, type, spacing and density scales as well as the seed colours.
   * Switching one must change the whole interface, which is the only way
   * to know the token layer is really in charge of the rendering.
   */
  renderStyleSelect() {
    const style = this.appState.settings.style ?? DEFAULT_THEME
    return html`
      <md-filled-select
        id="select-style"
        label="${this._('Style')}"
        @change="${this._handleStyleSelected}"
      >
        ${Object.entries(THEMES).map(
          ([id, theme]) => html`
            <md-select-option value="${id}" ?selected="${style === id}"
              >${this._(theme.label)}</md-select-option
            >
          `
        )}
      </md-filled-select>
    `
  }

  _handleStyleSelected(event) {
    const style = event.target.value
    if (!(style in THEMES)) return
    this.appState.updateSettings({style})
    const resolved = resolveTheme(style, getTreeConfig())
    try {
      applyScheme(
        resolved.primary,
        resolved.secondary,
        this.appState.settings.theme,
        resolved.name
      )
    } catch {
      applyScheme(
        DEFAULT_PRIMARY,
        DEFAULT_SECONDARY,
        this.appState.settings.theme,
        DEFAULT_THEME
      )
    }
  }

  _handleThemeSelected(event) {
    const theme = event.target.value
    this.appState.updateSettings({theme})
    // Changing the light/dark mode must keep the chosen STYLE: the two
    // are independent axes — a square-cornered theme stays square in
    // dark mode.
    const style = this.appState.settings.style ?? DEFAULT_THEME
    const resolved = resolveTheme(style, getTreeConfig())
    try {
      applyScheme(resolved.primary, resolved.secondary, theme, resolved.name)
    } catch {
      applyScheme(DEFAULT_PRIMARY, DEFAULT_SECONDARY, theme, DEFAULT_THEME)
    }
  }

  renderSymbolsSelect() {
    const symbolSet = this.appState.settings.symbolSet ?? SYMBOL_SET_DEFAULT
    return html`
      <md-filled-select
        id="select-symbols"
        label="${this._('Genealogical symbols')}"
        @change="${this._handleSymbolsSelected}"
      >
        ${SYMBOL_SET_OPTIONS.map(
          value => html`
            <md-select-option value="${value}" ?selected=${value === symbolSet}>
              ${getSymbolSetLabel(value, s => this._(s))}
            </md-select-option>
          `
        )}
      </md-filled-select>
    `
  }

  _handleSymbolsSelected(event) {
    const candidate = event.target.value || SYMBOL_SET_DEFAULT
    const symbolSet = SYMBOL_SET_OPTIONS.includes(candidate)
      ? candidate
      : SYMBOL_SET_DEFAULT
    this.appState.updateSettings({symbolSet})
  }

  renderTreePreferences() {
    const defaultView =
      this.appState.settings.treeDefaultView ?? DEFAULT_TREE_VIEW
    return html`
      <div class="tree-preferences">
        <md-filled-select
          id="tree-default-view"
          label="${this._('Default family tree view')}"
          @change=${this._handleDefaultTreeViewChange}
        >
          ${TREE_VIEWS.map(
            view => html`
              <md-select-option
                value="${view}"
                ?selected=${view === defaultView}
              >
                ${this._(this._treeViewLabel(view))}
              </md-select-option>
            `
          )}
        </md-filled-select>
      </div>
    `
  }

  _treeViewLabel(view) {
    switch (view) {
      case 'descendant':
        return 'Descendant Tree'
      case 'hourglass':
        return 'Hourglass Graph'
      case 'relationship':
        return 'Relationship Graph'
      case 'fan':
        return 'Fan Chart'
      default:
        return 'Ancestor Tree'
    }
  }

  _handleDefaultTreeViewChange(event) {
    const candidate = event.target.value || DEFAULT_TREE_VIEW
    const view = TREE_VIEWS.includes(candidate) ? candidate : DEFAULT_TREE_VIEW
    this.appState.updateSettings({treeDefaultView: view})
  }

  renderChangeUsername() {
    return html`
      <p class="profile-field">
        <md-filled-text-field
          id="change-username"
          label="${this._('Username: ').replace(':', '')}"
          value="${this._userInfo?.name || ''}"
        ></md-filled-text-field>
        <md-outlined-button @click="${this._changeUsername}">
          ${this._('Save')}
        </md-outlined-button>
      </p>
    `
  }

  renderChangeFullName() {
    return html`
      <p class="profile-field">
        <md-filled-text-field
          id="change-full-name"
          label="${this._('Full Name')}"
          value="${this._userInfo?.full_name || ''}"
          supporting-text="${this._idpHint()}"
        ></md-filled-text-field>
        <md-outlined-button @click="${this._changeFullName}">
          ${this._('Save')}
        </md-outlined-button>
      </p>
    `
  }

  renderChangeEmail() {
    return html`
      <p>
        <md-filled-text-field
          id="change-email"
          label="${this._('New E-mail')}"
          value="${this._userInfo?.email ? this._userInfo.email : ''}"
          supporting-text="${this._idpHint()}"
        ></md-filled-text-field>
      </p>
      <p>
        <md-outlined-button @click="${this._changeEmail}">
          ${this._('Submit')}
        </md-outlined-button>
      </p>
    `
  }

  renderChangePw() {
    return html`
      <p>
        <md-filled-text-field
          id="old-pw"
          label="${this._('Old password')}"
          type="password"
        ></md-filled-text-field>
        <md-filled-text-field
          id="new-pw"
          label="${this._('New password')}"
          type="password"
        ></md-filled-text-field>
      </p>
      <p>
        <md-outlined-button @click="${this._changePw}">
          ${this._('Submit')}
        </md-outlined-button>
      </p>
    `
  }

  renderApiToken() {
    return html`
      <p>
        ${this._(
          'Copy your session token to use in Swagger UI, the interactive API testing tool.'
        )}
      </p>
      <p class="token-row">
        <md-outlined-button @click="${this._copyToken}">
          <grampsjs-icon
            slot="icon"
            path="${this._tokenCopied ? Check : Copy}"
            color="currentColor"
          ></grampsjs-icon>
          ${this._('_Copy')}
        </md-outlined-button>
        <md-outlined-button
          href="${__APIHOST__}/api/swagger-ui"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${this._('Launch Swagger')}
        </md-outlined-button>
      </p>
    `
  }

  async _copyToken() {
    const token = await this.appState.refreshTokenIfNeeded()
    if (!token) {
      fireEvent(this, 'grampsjs:error', {
        message: 'No valid session token available',
      })
      return
    }
    try {
      await navigator.clipboard.writeText(token)
      this._tokenCopied = true
      setTimeout(() => {
        this._tokenCopied = false
      }, 2000)
    } catch {
      fireEvent(this, 'grampsjs:error', {
        message: 'Failed to copy token to clipboard',
      })
    }
  }

  _setUserUpdateError(data, fallbackMessage) {
    this.error = false
    this.error = true
    this._errorMessage = fallbackMessage || data.error
  }

  async _changeUsername() {
    const usernameField = this.shadowRoot.getElementById('change-username')
    const username = usernameField.value.trim()
    if (!username) {
      fireEvent(this, 'grampsjs:error', {
        message: 'Username cannot be empty',
      })
      return
    }
    if (username === this._userInfo?.name) {
      return
    }

    this.loading = true
    const data = await this.appState.apiPut('/api/users/-/', {
      name_new: username,
    })

    this.loading = false
    if ('error' in data) {
      const isConflict = data.errorDetail?.status === 409
      this._setUserUpdateError(
        data,
        isConflict ? 'This user name is already in use' : undefined
      )
      return
    }
    this.error = false
    fireEvent(this, 'grampsjs:notification', {
      message: 'Username successfully updated',
    })

    await this._fetchOwnUserDetails()
  }

  async _changeFullName() {
    const fullNameField = this.shadowRoot.getElementById('change-full-name')
    const fullName = fullNameField.value
    if (fullName === (this._userInfo?.full_name || '')) {
      return
    }

    const payload = {
      full_name: fullName,
    }

    this.loading = true
    const data = await this.appState.apiPut('/api/users/-/', payload)

    this.loading = false
    if ('error' in data) {
      this._setUserUpdateError(data)
      return
    }
    this.error = false
    fireEvent(this, 'grampsjs:notification', {
      message: 'Full name successfully updated',
    })

    await this._fetchOwnUserDetails()
  }

  async _changeEmail() {
    const form = this.shadowRoot.getElementById('change-email')
    if (!form.value) {
      return
    }
    this.loading = true
    const payload = {email: form.value}
    const data = await this.appState.apiPut('/api/users/-/', payload)

    this.loading = false
    if ('error' in data) {
      this.error = false
      this.error = true
      this._errorMessage = data.error
      return
    }
    fireEvent(this, 'grampsjs:notification', {
      message: 'E-mail successfully updated',
    })

    form.value = ''

    await this._fetchOwnUserDetails()
    form.value = this._userInfo.email
  }

  _changePw() {
    const formOldPw = this.shadowRoot.getElementById('old-pw')
    const formNewPw = this.shadowRoot.getElementById('new-pw')
    if (!formOldPw.value || !formNewPw.value) {
      return
    }
    this.loading = true
    const payload = {
      old_password: formOldPw.value,
      new_password: formNewPw.value,
    }
    this.appState
      .apiPost('/api/users/-/password/change', payload)
      .then(data => {
        this.loading = false
        if ('error' in data) {
          this.error = true
          this._errorMessage = data.error
        } else {
          this.error = false
          // A new password ends every other session; the API hands this one
          // a new token pair so that it keeps working.
          if (data.data?.refresh_token) {
            storeAuthToken(
              data.data.access_token,
              Date.now() + ACCESS_TOKEN_EXPIRY_MS
            )
            storeRefreshToken(data.data.refresh_token)
          }
          fireEvent(this, 'grampsjs:notification', {
            message: 'Password successfully updated',
          })
          formOldPw.value = ''
          formNewPw.value = ''
        }
      })
  }

  async _fetchOwnUserDetails() {
    const data = await this.appState.apiGet('/api/users/-/')
    if ('error' in data) {
      this.error = true
      this._errorMessage = data.error
    } else {
      this.error = false
      this._userInfo = data.data
    }
  }

  // the identity provider may overwrite full name and e-mail at each sign-in
  _idpHint() {
    return this._hasLinkedAccount
      ? this._(
          'Your full name and e-mail address may be updated whenever you sign in with a linked account.'
        )
      : ''
  }

  _handleOidcAccountsChanged(e) {
    this._hasLinkedAccount = e.detail.count > 0
  }

  // users without local auth have no password to change
  async _fetchAuthConfig() {
    const config = await apiGetOIDCConfig()
    this._localAuthDisabled = Boolean(
      config?.enabled && config.disable_local_auth
    )
  }
}

window.customElements.define(
  'grampsjs-view-settings-user',
  GrampsjsViewSettingsUser
)
