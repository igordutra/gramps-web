/**
 * Material Web's list, and the ARIA it does not quite get right.
 *
 * `md-list` says it is a list. `md-list-item` renders its content
 * inside its own shadow root, on an anchor, a button or an `li`, and
 * that element carries `role="listitem"` — while the host uses
 * `delegatesFocus` and is focusable in its own right. The element
 * holding the listitem role is therefore one level too deep to be a
 * child of the list, and three axe rules object at once:
 *
 *   aria-required-parent    the listitem has no list parent
 *   aria-required-children  the list's child is the host, not a listitem
 *   aria-allowed-role       role="listitem" on an anchor is not a role
 *                           an anchor may carry
 *
 * There is a second thing about the host, and it is why this cannot
 * simply be written in markup. Material mixes an ARIA delegation
 * mixin into every element that delegates focus, and that mixin
 * **removes** an ARIA attribute from the host and shifts it to a
 * `data-*` attribute — an element that delegates its ARIA to its
 * shadow root must not carry the same ARIA twice. So the host's
 * `role` never survives as a role, and `getAttribute('role')` answers
 * with the `data-role` it was shifted to.
 *
 * Which leaves the host unable to be a listitem, and leaves the
 * vendor's inner element claiming to be one. And the inner element's
 * claim is the part that is actually wrong: an anchor that says
 * `role="listitem"` is not a link any more. Chromium's accessibility
 * tree agrees — before this patch the navigation's items were exposed
 * as list items, not as links.
 *
 * So the fix is to take the listitem role OFF the inner element and
 * let it be the link it is. The list keeps saying it is a list, and
 * its items are links inside it.
 *
 * The host's role is set once, and only once, because the delegation
 * mixin answers a role attribute by removing it and asking for an
 * update — setting it on every update would ask for an update
 * forever. The inner element's role is dropped on every update,
 * because Material re-renders it.
 *
 * The patch is deliberately narrow. It touches one attribute on the
 * element Material renders as the item's content, plus one on the
 * host, and it does nothing at all if that element is not where it is
 * expected to be. If a future version of Material moves it, the patch
 * quietly stops working and the app is no worse off than it was.
 */
import '@material/web/list/list-item.js'

const ITEM_ROLE = 'listitem'
const PATCHED = '__grampsjsListItemRolesPatched'

// The host is normalised once. Material's delegation mixin removes a
// role attribute from the host and asks for an update in response, so
// a host whose role is set on every update asks for an update
// forever.
const normalised = new WeakSet()

/**
 * Put the listitem role where it belongs for this particular item.
 *
 * Material renders the item's content on an anchor or a button for a
 * link or a button item, and on an `li` for a text item. The two
 * need opposite treatment:
 *
 *   anchor / button   the anchor is a link, not a listitem, and may
 *                     not carry that role
 *
 *   li                an `li` is a listitem, and must keep the role
 *
 * @param {HTMLElement} host the md-list-item element
 * @return {boolean} whether the item was normalised
 */
function normaliseListItem(host) {
  const inner = host.shadowRoot?.querySelector('#item')
  if (!inner) {
    return false
  }
  if (inner.tagName.toLowerCase() === 'li') {
    // An `li` must have a list parent, and its parent here is the
    // host — so the host is presentational and lets the `li` be the
    // list's item.
    if (!normalised.has(host)) {
      normalised.add(host)
      host.setAttribute('role', 'none')
    }
    return true
  }
  if (!normalised.has(host)) {
    normalised.add(host)
    host.setAttribute('role', ITEM_ROLE)
  }
  if (inner.getAttribute('role') === ITEM_ROLE) {
    inner.removeAttribute('role')
  }
  return true
}

/**
 * Install the fix. Safe to call more than once.
 */
export function installListItemRoles() {
  const ctor = customElements.get('md-list-item')
  if (!ctor || ctor[PATCHED]) {
    return
  }
  ctor[PATCHED] = true

  const originalUpdate = ctor.prototype.update
  ctor.prototype.update = function (changedProperties) {
    const result = originalUpdate.call(this, changedProperties)
    // The DOM is committed by the time update() returns, so the item
    // is there and its role can be taken off.
    normaliseListItem(this)
    return result
  }
}
