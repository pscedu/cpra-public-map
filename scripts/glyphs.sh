#!/bin/bash

FONTS="./fonts"
GLYPHS="./src/static/style/glyphs"

for source in $FONTS/*.ttf; do
    source_file=$(basename "$source")
    dest="$GLYPHS/${source_file%.*}"
    mkdir -p "$dest"
    npx build-glyphs "$source" "$dest"
done
