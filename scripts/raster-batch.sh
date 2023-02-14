#!/bin/bash

# Env variables:
# - DATA
# - INDEX_GPKG
# - TILES

# Use RAM disk as the working directory.
CONCURRENT="$SLURM_NTASKS_PER_NODE"
WORKING="$RAMDISK"

# CLARA color map
cat > $WORKING/CLARA.clr << EOF
-9999.999 0 0 0 0
0.999 0 0 0 0
1.000 114 141 151
3.999 114 141 151
4.000 115 183 234
6.999 115 183 234
7.000 153 217 167
9.999 153 217 167
10.000 248 216 139
12.999 248 216 139
13.000 233 176 35
15.999 233 176 35
16.000 229 101 36
20.999 229 101 36
21.000 183 56 101
9999.999 183 56 101
EOF

# FFIBS color map
cat > $WORKING/FFIBS.clr << EOF
-9999.999 0 0 0 0
-0.001 0 0 0 0
0.000 94 130 58
0.199 94 130 58
0.200 218 232 109
1.999 218 232 109
2.000 146 203 232
4.999 146 203 232
5.000 115 87 83
16.999 115 87 83
17.000 6 121 210
198.999 6 121 210
199.000 255 255 255
9999.999 255 255 255
EOF

# Land change color map
cat > $WORKING/lndchg.clr << EOF
55 0 0 0 0
52 69 145 172
51 0 0 0 0
44 0 0 0 0
33 0 0 0 0
32 69 145 172
31 0 0 0 0
23 38 81 24
22 0 0 0 0
21 38 81 24
13 0 0 0 0
12 69 145 172
11 0 0 0 0
0 0 0 0 0
EOF

# Land type diff color map
cat > $WORKING/lndtypdiff.clr << EOF
-9999 0 0 0 0
111 0 0 0 0
112 0 240 240
113 0 0 0 0
121 153 193 4
122 69 145 172
123 153 193 4
131 0 0 0 0
132 0 240 240
133 0 0 0 0
211 38 81 24
212 0 240 240
213 38 81 24
221 38 81 24
222 0 0 0 0
223 38 81 24
231 38 81 24
232 0 240 240
233 38 81 24
311 0 0 0 0
312 0 240 240
313 0 0 0 0
321 153 193 4
322 69 145 172
323 153 193 4
331 0 0 0 0
332 0 240 240
333 0 0 0 0
444 0 0 0 0
511 0 0 0 0
512 0 240 240
513 0 0 0 0
515 0 0 0 0
521 153 193 4
522 69 145 172
523 153 193 4
525 153 193 4
531 0 0 0 0
532 0 240 240
533 0 0 0 0
535 0 0 0 0
551 0 0 0 0
552 0 240 240
553 0 0 0 0
555 0 0 0 0
EOF

match() {
    for value in "${@:2}"; do
        if [[ "$1" == *"$value"* ]]; then
            echo "$value"
        fi
    done
}

set_status() {
    ogrinfo -sql "update raster set status = \"$2\" where raster_name = \"$1\"" \
        "$INDEX_GPKG"
}

convert_raster () {
    in_path="$1"
    raster_type="$2"
    in_name=$(basename "$in_path")
    raster_name="${in_name%.tif}"
    color_path="$WORKING/$raster_type.clr"
    out_name="${in_name%.tif}.mbtiles"
    out_path="$TILES/$out_name"
    working_tif_path="$WORKING/$raster_name.tif"
    working_tiles_path="$WORKING/$out_name"

    # Colorize the raster.
    gdaldem color-relief -alpha $in_path $color_path $working_tif_path

    # Set the coordinate system.
    gdal_edit.py -a_srs "EPSG:26915" $working_tif_path

    # Tile the highest zoom level.
    gdal_translate $working_tif_path $working_tiles_path \
        -of MBTILES -co ZOOM_LEVEL_STRATEGY=UPPER \
        -co NAME="$raster_name"

    # Add lower zoom levels.
    gdaladdo $working_tiles_path -r nearest

    # Move the tiles to the output directory.
    mv $working_tiles_path $out_path
    
    # Set the status to complete.
    set_status "$in_name" "complete"
}

raster_names=$(ogr2ogr -f CSV -sql "select raster_name from rasters where status = \"not started\" limit $CONCURRENT" /vsistdout/ "$INDEX_GPKG" | tail -n +2)
pids=()

while IFS= read -r raster_name; do
    raster_type=$(match "$raster_name" "CLARA" "FFIBS" "lndchg" "lndtypdiff")
    model=$([ "$raster_type" == "CLARA" ] && echo "CLARA" || echo "ICM")
    scenario=$(match "$raster_name" "S07" "S08")
    group=$([[ "$raster_name" =~ G[0-9]{3} ]] && echo $BASH_REMATCH)
    in_path="$DATA/$model/$scenario/$group/geomorph/output/tif/$raster_name"
    if [ -f "$in_path" ]; then
        "Converting $raster_name..."
        set_status "$raster_name" "in progress"
        convert_raster "$in_path" "$raster_type" &
        pids+=($!)
    else
        echo "Skipping $raster_name..."
    fi
done <<< "$raster_names"

for pid in ${pids[*]}; do
    wait $pid
done
