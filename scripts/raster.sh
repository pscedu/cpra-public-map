#!/bin/bash

DATA="./data"
WORKING="./working"
TILES="./tiles"

mkdir -p "$WORKING"
mkdir -p "$TILES"

# CLARA color map
cat > $WORKING/CLARA.clr << EOF
-9999.999 0 0 0 0
-0.001 0 0 0 0
0.000 114 141 151
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

convert_raster () {
    in_path="$1"
    raster_type="$2"
    raster_name="$3"
    mask="$4"
    out_name="$5"
    in_name=$(basename "$in_path")

    echo "Converting $in_name..."
    color_path="$WORKING/$raster_type.clr"

    if [ -z "$out_name" ]; then
        out_name="${in_name%.tif}.mbtiles"
    fi
    out_path="$TILES/$out_name"
    working_tif_path="$WORKING/working.tif"
    working_tiles_path="$WORKING/$out_name"

    # Colorize the raster.
    gdaldem color-relief -alpha $in_path $color_path $working_tif_path

    # Set the coordinate system.
    gdal_edit.py -a_srs "EPSG:26915" $working_tif_path

    # Mask excluded ecoregions.
    gdal_rasterize -b 1 -b 2 -b 3 -b 4 -burn 0 \
        -where "ecoregion in ('ATB', 'UVR')" \
        "/vsizip/$DATA/MP23_Ecoregions_withAtch.zip" $working_tif_path

    if [ ! -z "$mask" ]; then
        gdal_rasterize -b 1 -b 2 -b 3 -b 4 -burn 0 "$mask" $working_tif_path
    fi

    # Tile the highest zoom level.
    gdal_translate $working_tif_path $working_tiles_path \
        -of MBTILES -co ZOOM_LEVEL_STRATEGY=UPPER \
        -co NAME="$raster_name"

    # Add lower zoom levels.
    gdaladdo $working_tiles_path -r nearest

    # Move the tiles to the output directory.
    mv $working_tiles_path $out_path
    echo
}

# Process land change rasters
for in_path in $DATA/MP2023_S*_G*_C000_U00_V00_SLA_*_02_*2_W_lndchg.tif; do
    s=$(basename "$in_path" | cut -d "_" -f2)
    g=$(basename "$in_path" | cut -d "_" -f3)
    year=$(($(basename "$in_path" | cut -d "_" -f10)-2))
    convert_raster $in_path "lndchg" "Land Change - $s - $g - Year $year"
done

# Process land type diff rasters
for in_path in $DATA/MP2023_S*_G*_C000_U00_V00_SLA_*_02_*2_W_lndtypdiff.tif; do
    s=$(basename "$in_path" | cut -d "_" -f2)
    g=$(basename "$in_path" | cut -d "_" -f3)
    year=$(($(basename "$in_path" | cut -d "_" -f10)-2))
    convert_raster $in_path "lndtypdiff" "Land Change - $s - $g - Year $year"
done

# Process vegatation type rasters
for in_path in $DATA/MP2023_S*_G*_C000_U00_V00_SLA_*_*_*2_W_FFIBS.tif; do
    s=$(basename "$in_path" | cut -d "_" -f2)
    g=$(basename "$in_path" | cut -d "_" -f3)
    year=$(($(basename "$in_path" | cut -d "_" -f10)-2))
    convert_raster $in_path "FFIBS" "Vegetation Type - $s - $g - Year $year"
done

# Create a combined river and lake mask for flood depth.
ogr2ogr $WORKING/flood_depth_mask.gpkg \
    "/vsizip/$DATA/Lake_Mask.zip/Lake Mask/lake_mask_for_mapping.shp" \
    -nln flood_depth_mask

ogr2ogr -append $WORKING/flood_depth_mask.gpkg \
    /vsizip/$DATA/MississippiRiver_mask_for_mapping.zip/MississippiRiver_mask_for_mapping/MississippiRiver_mask_for_mapping.shp \
    -nln flood_depth_mask

# Process flood depth rasters
for in_path in $DATA/MP2023_S*_G*_C000_U00_V00_SLA_*_*_*_CLARA_*_aep_depths_ft.tif
do
    s=$(basename "$in_path" | cut -d "_" -f2)
    g=$(basename "$in_path" | cut -d "_" -f3)
    year=$(basename "$in_path" | cut -d "_" -f10)
    [[ "$year" == "01" ]] && year="0"
    exceedance=$(basename "$in_path" | cut -d "_" -f12)
    raster_name="Flood Depth - $s - $g - Year $year - Exceedance Probability $exceedance"
    convert_raster $in_path "CLARA" "$raster_name" \
        "$WORKING/flood_depth_mask.gpkg"
done

# Process historical land change rasters
loss_breakpoints=(0 1 3 5 8 13 19)
years=(1932 1956 1975 1985 1995 2006 2015)
gain_start=20

for i in "${!loss_breakpoints[@]}"; do
    loss_breakpoint=${loss_breakpoints[i]}
    gain_breakpoint=$(($gain_start + $loss_breakpoint - 1))
    year=${years[i]}

    in_path="$DATA/historic_land_change/sim_3381_persistent_change_spatial_data_092616.img"
    raster_type="historical_land_change_${year}"
    raster_name="Historical Land Change - S07 - G500 - Year $year"

    cat > "$WORKING/$raster_type.clr" << EOF
0 0 0 0 0
0.1 69 145 172
$loss_breakpoint.2 69 145 172
$loss_breakpoint.3 214 214 214
$(($gain_start - 1)).4 214 214 214
$(($gain_start - 1)).5 38 81 24
$gain_breakpoint.6 38 81 24
$gain_breakpoint.7 0 0 0 0
9999 0 0 0 0
EOF

    convert_raster $in_path "$raster_type" "$raster_name" "" "$raster_type.mbtiles"
done
