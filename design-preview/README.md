# The three styles, in both colour modes

Not part of the proposed change — this branch exists to show the pictures.

Six pages — the dashboard, people, a person, the tree, settings and search —
in each style, in light and dark. **36 images.**

| | light | dark |
| :--- | :--- | :--- |
| Archive | `home-archive-light.png` | `home-archive-dark.png` |
| Blueprint | `home-blueprint-light.png` | `home-blueprint-dark.png` |
| Almanac | `home-almanac-light.png` | `home-almanac-dark.png` |

…and the same six per page, named `<page>-<style>-<mode>.png`.

- **Archive** — the rounded dashboard: 10–12px corners, a pill search field,
  teal as an accent over white and cool grey.
- **Blueprint** — the square-cut technical one: 0px corners on the buttons,
  1px rules, a strict aligned table.
- **Almanac** — the printed-book one: EB Garamond throughout, warm ivory and
  sage, generous leading.

Each shot was taken with the style applied through the app's **own persisted
setting**, and the applied theme was **read back from the document before the
shutter** — a combination that did not stick was refused rather than captured.
That check earned its keep: it is what revealed that the style setting was
being ignored entirely on every page load.

The work itself is on `feature/modern-visual-identity`.
