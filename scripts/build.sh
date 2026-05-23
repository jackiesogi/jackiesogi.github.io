#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="src"
DIST_DIR="dist"
CSS_DIR="themes"

echo "[build] clean dist..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

echo "[build] copy static assets..."
mkdir -p "$DIST_DIR/static"
cp -r "$CSS_DIR/"* "$DIST_DIR/static/" 2>/dev/null || true

echo "[build] converting markdown..."

# safer than pipe + while read
find "$SRC_DIR" -name "*.md" -print0 | while IFS= read -r -d '' file; do

    rel_path="${file#$SRC_DIR/}"
    out_file="$DIST_DIR/${rel_path%.md}.html"

    mkdir -p "$(dirname "$out_file")"

    echo "  - ${rel_path} -> ${out_file#$DIST_DIR/}"

    pandoc "$file" \
        -o "$out_file" \
        --from markdown \
        --to html5 \
        --template=templates/layout.html \
        --standalone \
        --css="/themes/vue.css"

done

echo "[build] done."
#!/usr/bin/env bash
set -euo pipefail

SRC="src"
DIST="dist"

echo "[clean] dist"
rm -rf "$DIST"
mkdir -p "$DIST"

echo "[copy assets]"
mkdir -p "$DIST/assets"
cp -r assets/* "$DIST/assets/" 2>/dev/null || true

echo "[copy themes]"
mkdir -p "$DIST/themes"
cp -r themes/* "$DIST/themes/" 2>/dev/null || true

echo "[build markdown]"

find "$SRC" -name "*.md" -print0 | while IFS= read -r -d '' file; do
    rel="${file#$SRC/}"
    out="$DIST/${rel%.md}.html"

    mkdir -p "$(dirname "$out")"

    echo "  $rel → ${out#$DIST/}"

    pandoc "$file" \
        -o "$out" \
        --template=templates/layout.html \
        --standalone

done

echo "[done]"
