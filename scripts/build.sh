#!/usr/bin/env bash
set -euo pipefail

SRC="src"
DIST="dist"
TEMPLATE="templates/layout.html"

rm -rf "$DIST"
mkdir -p "$DIST"

find "$SRC" -name "*.md" -print0 | while IFS= read -r -d '' file; do
    rel="${file#$SRC/}"
    out="$DIST/${rel%.md}.html"
    mkdir -p "$(dirname "$out")"
    echo "  $rel → ${out#$DIST/}"
    pandoc "$file" -o "$out" --template="$TEMPLATE" --standalone --from markdown --to html5
done

echo "[done] output in $DIST/"
