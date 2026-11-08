#!/usr/bin/env python3
"""Migrate the app's icon imports from @mdi/js to the Phosphor module.

Every file that imports Material Design Icon constants from '@mdi/js' is
rewritten to import the matching Phosphor constants from src/icons/phosphor.js
instead, and every use of those constants is renamed to match. The mapping
lives in scripts/map-mdi-to-phosphor.py.

Two details matter:

  * Several MDI icons map to the same Phosphor icon (mdiBookmark and
    mdiBookmarkOutline both become the bookmark shape). Those share one
    local name, so the import lists the Phosphor constant once.

  * Where a Phosphor name would shadow an identifier the file already uses
    — a local `Copy`, `Image`, `File` — the import is aliased with an
    `Icon` suffix instead, so a new icon never collides with existing code.

The script reports what it changed and refuses to touch a file it cannot
map confidently.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
MAPPING_FILE = os.path.join(ROOT, "scripts", "map-mdi-to-phosphor.py")

IMPORT_RE = re.compile(
    r"import\s*\{(?P<names>[^}]*)\}\s*from\s*'@mdi/js'\s*;?", re.S
)


def load_mapping():
    source = open(MAPPING_FILE).read()
    pairs = re.findall(r'"(mdi[A-Za-z]+)":\s*"([a-z0-9-]+)"', source)
    return dict(pairs)


def pascal(name):
    return "".join(part.capitalize() for part in name.split("-"))


def relative_import_path(source_file):
    """The path from source_file to src/icons/phosphor.js, as a JS import."""
    depth = len(os.path.relpath(source_file, SRC).split(os.sep)) - 1
    # A file directly in src/ needs './icons/phosphor.js'; anything deeper
    # needs '../' per level. An empty prefix would produce a bare module
    # specifier, which the browser rejects.
    prefix = "../" * depth if depth else "./"
    return prefix + "icons/phosphor.js"


def identifiers_in(source):
    """Every identifier the file already uses, ignoring imports."""
    stripped = IMPORT_RE.sub("", source)
    stripped = re.sub(r"//[^\n]*", "", stripped)
    stripped = re.sub(r"/\*.*?\*/", "", stripped, flags=re.S)
    stripped = re.sub(r"'[^']*'|\"[^\"]*\"", "", stripped)
    return set(re.findall(r"[A-Za-z_$][A-Za-z0-9_$]*", stripped))


def migrate(source, mapping, import_path):
    """Return (new_source, rename_map) for one file, or (None, None)."""
    match = IMPORT_RE.search(source)
    if not match:
        return None, None

    names = [
        n.strip().split(" as ")[0].strip()
        for n in match.group("names").split(",")
        if n.strip()
    ]

    taken = identifiers_in(source)
    base_for = {}          # phosphor base -> local name
    local_for_mdi = {}     # mdi name -> local name
    unmapped = []

    for name in names:
        target = mapping.get(name)
        if target is None:
            unmapped.append(name)
            continue
        base = pascal(target)
        if base in base_for:
            # Another MDI icon already mapped to this Phosphor icon; share
            # the local name.
            local_for_mdi[name] = base_for[base]
            continue
        local = base
        if local in taken:
            local = base + "Icon"
            counter = 2
            while local in taken:
                local = "%sIcon%d" % (base, counter)
                counter += 1
        taken.add(local)
        base_for[base] = local
        local_for_mdi[name] = local

    if unmapped:
        return None, unmapped

    imports = []
    for base in sorted(base_for):
        local = base_for[base]
        if local == base:
            imports.append(base)
        else:
            imports.append("%s as %s" % (base, local))

    body = ",\n  ".join(imports)
    # The import pattern consumes the whitespace that followed the original
    # statement, including its newline, so the replacement has to put one
    # back or the next import is glued onto this line.
    new_import = "import {\n  %s,\n} from '%s'\n" % (body, import_path)
    updated = source[: match.start()] + new_import + source[match.end() :]

    for old, new in local_for_mdi.items():
        updated = re.sub(r"\b%s\b" % re.escape(old), new, updated)

    return updated, local_for_mdi


def main():
    mapping = load_mapping()
    changed = []
    renames = 0
    unmapped = set()

    for dirpath, _dirnames, filenames in os.walk(SRC):
        for filename in filenames:
            if not filename.endswith(".js"):
                continue
            path = os.path.join(dirpath, filename)
            if os.path.relpath(path, SRC).startswith("icons"):
                continue

            source = open(path).read()
            if "@mdi/js" not in source:
                continue

            updated, result = migrate(
                source, mapping, relative_import_path(path)
            )
            if updated is None:
                if result:
                    unmapped.update(result)
                continue

            open(path, "w").write(updated)
            changed.append(os.path.relpath(path, ROOT))
            renames += len(result)

    print(
        "rewrote %d files, %d identifier renames" % (len(changed), renames)
    )
    if unmapped:
        print("\nNO MAPPING FOR:")
        for name in sorted(unmapped):
            print("  ", name)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
