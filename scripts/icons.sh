#!/bin/bash

SRC="./data/icons"
DST="./src/assets/project-icons"

mkdir -p "$DST"

for in_path in $SRC/*.png; do
  in_name=$(basename "$in_path")
  out_name=$(echo "$in_name" | awk '{print tolower($0)}')
  out_path="$DST/$out_name"
  convert "$in_path" -trim +repage -resize 64x64 "$out_path"
done