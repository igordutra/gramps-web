/**
 * Material Web's list, and the ARIA it does not quite get right.
 *
 * `md-list` says it is a list. `md-list-item` renders its content
 * inside its own shadow root, on an anchor, a button or an `li` that
 * carries `role="listitem"` — and it uses `delegatesFocus`, so the
 * host is focusable as well. That leaves the element carrying the
 * listitem role one level too deep to be a child of the list, and it
 * breaks three axe rules at once:
 *
 *   aria-required-parent    the listitem has no list parent
 *   aria-required-children  the list's child is the host, not a listitem
 *   aria-allowed-role       role="listitem" on an anchor is not a role
 *                           an anchor may carry
 *
 * The earlier workaround — `role="none"` on the host, so the anchor
 * inside is promoted to be the list's child — settles the first rule
 * and unsettles the second: axe's rule only looks *through* a
 * presentational child when that child is not focusable, and
 * `md-list-item` always is.
 *
 * The structure that satisfies all three is the plain one:
 *
 *   list  >  listitem  >  link
 *
 * The listitem role belongs on the host, which *is* a direct child of
 * the list. Only the second half of that cannot be written in markup,
 * because the element carrying the vendor's role lives in Material's
 * shadow root: so it is dropped here, once, for every list item in
 * the app.
 *
 * The patch is deliberately narrow. It touches one attribute on the
 * element Material renders as the item's content, and it does nothing
 * at all if that element is not where it is expected to be. If a
 * future version of Material moves it, the patch quietly stops
 * working and the app is no worse off than it was.
 */
import '@material/web/list/list-item.js'

const ITEM_ROLE = 'listitem'
const PATCHED = '__grampsjsListItemRolesPatched'

/**
 * Take the listitem role off the element Material renders inside the
 * item, so the host can carry it instead.
 *
 * @param {HTMLElement} host the md-list-item element
 * @return {boolean} whether the role was dropped
 */
function dropInnerListItemRole(host) {
  const inner = host.shadowRoot?.querySelector('#item')
  if (!inner || inner.getAttribute('role') !== ITEM_ROLE) {
    return false
  }
  inner.removeAttribute('role')
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
    dropInnerListItemRole(this)
    return result
  }
}
