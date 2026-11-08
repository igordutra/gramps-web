import {html, css, LitElement} from 'lit'

import {GrampsjsAppStateMixin} from '../mixins/GrampsjsAppStateMixin.js'
import {fireEvent} from '../util.js'
import {getTreeId} from '../api.js'
import {ArrowDown, ArrowUp} from '../icons/phosphor.js'

/*
 * The statistics cards.
 *
 * They used to be a two-column table: a count and a name on each row.
 * The counts are the point, so they are now cards — the number is the
 * largest thing on the card and the name is the smallest.
 *
 * Every number comes from the API. The totals are the object_counts the
 * app already keeps in its state (they come from GET /api/metadata/),
 * so they are never hard-coded and need no request of their own.
 *
 * The comparison is a separate thing: how many records of each type
 * were CHANGED in the last thirty days, and how many were changed in
 * the thirty days before that. The API can answer that exactly —
 * GET /api/search/ takes a `change` timestamp filter and reports the
 * number of matches in the X-Total-Count header — so it is fetched
 * rather than guessed. Two requests per type, one for each window.
 *
 * The change date is the last time a record was touched, which is what
 * Gramps stores. It is not a creation date, so the card says
 * "changed", never "added".
 */

// The card types, in the order they are shown. `key` is the name the
// API uses for the count in object_counts; `api` is the name the
// search API uses for the same type.
const _types = [
  {key: 'people', api: 'person'},
  {key: 'families', api: 'family'},
  {key: 'events', api: 'event'},
  {key: 'places', api: 'place'},
  {key: 'sources', api: 'source'},
  {key: 'citations', api: 'citation'},
  {key: 'media', api: 'media'},
  {key: 'notes', api: 'note'},
  {key: 'repositories', api: 'repository'},
]

// The window the comparison covers. Thirty days is a month, which is
// what a person means by "since last month".
const _periodDays = 30
const _periodSeconds = _periodDays * 24 * 60 * 60

// The comparison is the same for every card and it does not change
// minute to minute, so it is fetched once per tree and kept for a few
// minutes rather than on every visit to the dashboard.
const _cache = new Map()
const _cacheLifetime = 5 * 60 * 1000

export class GrampsjsStatistics extends GrampsjsAppStateMixin(LitElement) {
  static get properties() {
    return {
      data: {type: Object},
      _comparison: {state: true},
    }
  }

  constructor() {
    super()
    this.data = {}
    this._comparison = null
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin-bottom: var(--grampsjs-space-40);
        }

        h2 {
          margin: 0 0 var(--grampsjs-space-16);
        }

        /*
         * The cards are their own grid, so they fill whatever column
         * they are in and wrap on their own. The minimum is wide
         * enough for a five-digit count and its label without the
         * number breaking.
         */
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: var(--grampsjs-space-12);
        }

        /*
         * A button, because a card that goes somewhere has to be
         * reachable by keyboard and announced as a control. The
         * button's own appearance is reset — it is a card, not a
         * button that happens to be large.
         */
        .card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--grampsjs-space-4);
          padding: var(--grampsjs-space-16);
          font: inherit;
          text-align: left;
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container-low);
          border: 1px solid var(--md-sys-color-outline-variant);
          border-radius: var(--md-sys-shape-corner-medium);
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .card:hover {
          background-color: var(--md-sys-color-surface-container);
        }

        .card:focus-visible {
          outline: 2px solid var(--md-sys-color-primary);
          outline-offset: 2px;
        }

        .label {
          font-size: var(--md-sys-typescale-label-medium-size);
          font-weight: var(--md-sys-typescale-label-medium-weight);
          color: var(--md-sys-color-on-surface-variant);
        }

        .value {
          font-size: var(--md-sys-typescale-headline-large-size);
          font-weight: var(--md-sys-typescale-headline-large-weight);
          line-height: 1.1;
          font-variant-numeric: tabular-nums;
        }

        /*
         * The comparison sits under the number: the direction and the
         * count on one line, and what it counts on the next. The
         * caption is never dropped — a direction on its own would say
         * nothing — and putting it on its own line keeps every card
         * the same shape, whatever the comparison happens to be.
         */
        .delta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--grampsjs-space-2);
          font-size: var(--md-sys-typescale-label-medium-size);
          font-weight: var(--md-sys-typescale-label-small-weight);
          color: var(--md-sys-color-on-surface-variant);
        }

        .delta .figure {
          display: flex;
          align-items: center;
          gap: var(--grampsjs-space-4);
        }

        .delta svg {
          width: var(--grampsjs-icon-size-small);
          height: var(--grampsjs-icon-size-small);
          fill: currentColor;
          flex: none;
        }

        /* More activity than the window before it. */
        .delta.up {
          color: var(--md-sys-color-primary);
        }

        /* Less activity. Not an error, so not the error colour. */
        .delta.down,
        .delta.flat {
          color: var(--md-sys-color-on-surface-variant);
        }

        .delta .amount {
          font-weight: var(--md-sys-typescale-label-medium-weight);
        }
      `,
    ]
  }

  connectedCallback() {
    super.connectedCallback()
    this._loadComparison()
  }

  /**
   * The number of records of each type changed in the last thirty
   * days, and the number changed in the thirty days before that.
   */
  async _loadComparison() {
    const tree = getTreeId() || 'unknown'
    const cached = _cache.get(tree)
    if (cached && Date.now() - cached.at < _cacheLifetime) {
      this._comparison = cached.value
      return
    }

    const now = Math.floor(Date.now() / 1000)
    const recent = now - _periodSeconds
    const earlier = now - 2 * _periodSeconds

    const entries = await Promise.all(
      _types.map(async type => {
        const [inWindow, inEarlierWindow] = await Promise.all([
          this._countChanged(type.api, recent),
          this._countChanged(type.api, earlier),
        ])
        if (inWindow === null || inEarlierWindow === null) {
          // The API could not answer for this type: the card shows the
          // count and no comparison, rather than a wrong comparison.
          return [type.key, null]
        }
        return [
          type.key,
          {
            recent: inWindow,
            previous: Math.max(0, inEarlierWindow - inWindow),
          },
        ]
      })
    )

    const value = Object.fromEntries(entries)
    _cache.set(tree, {at: Date.now(), value})
    if (!this.isConnected) {
      return
    }
    this._comparison = value
  }

  /**
   * How many records of a type were changed after a timestamp, or null
   * if the API could not say.
   */
  async _countChanged(type, since) {
    try {
      const result = await this.appState.apiGet(
        `/api/search/?query=%2A&type=${type}&change=>${since}&page=1&pagesize=1`
      )
      if ('error' in result) {
        return null
      }
      const total = Number(result.total_count)
      return Number.isFinite(total) ? total : 0
    } catch (error) {
      return null
    }
  }

  render() {
    return html`
      <h2>${this._('Statistics')}</h2>
      <div class="cards">${_types.map(type => this._renderCard(type))}</div>
    `
  }

  _renderCard(type) {
    const count = this.data?.[type.key]
    if (count === undefined) {
      return ''
    }
    const comparison = this._comparison?.[type.key]
    const label = this._(type.key.charAt(0).toUpperCase() + type.key.slice(1))
    const detail = comparison
      ? this._(
          '%s changed in the last 30 days; %s changed in the 30 days before',
          comparison.recent,
          comparison.previous
        )
      : label
    return html`
      <button
        class="card"
        type="button"
        title="${detail}"
        aria-label="${label}: ${this._formatNumber(count)}. ${detail}"
        @click="${() => this._handleClick(type.key)}"
      >
        <span class="label">${label}</span>
        <span class="value">${this._formatNumber(count)}</span>
        ${comparison ? this._renderDelta(comparison) : ''}
      </button>
    `
  }

  _renderDelta(comparison) {
    const {recent, previous} = comparison
    if (recent === 0 && previous === 0) {
      return html`
        <span class="delta flat">
          <span class="figure"><span class="amount">—</span></span>
          <span>${this._('no changes in 30 days')}</span>
        </span>
      `
    }
    const up = recent > previous
    const icon = up ? ArrowUp : ArrowDown
    return html`
      <span class="delta ${up ? 'up' : 'down'}">
        <span class="figure">
          <svg viewBox="0 0 256 256" aria-hidden="true">
            <path d="${icon}" />
          </svg>
          <span class="amount">${this._formatNumber(recent)}</span>
        </span>
        <span>${this._('changed in 30 days')}</span>
      </span>
    `
  }

  _formatNumber(value) {
    const locale = this.appState?.i18n?.lang || undefined
    try {
      return Number(value).toLocaleString(locale)
    } catch (error) {
      return String(value)
    }
  }

  _handleClick(key) {
    // we don't have a tag list
    // media is the only case that needs special treatment
    const path = key === 'media' ? 'medialist' : key
    fireEvent(this, 'nav', {path})
  }
}

window.customElements.define('grampsjs-statistics', GrampsjsStatistics)
