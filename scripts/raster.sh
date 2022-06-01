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

# Land type color map
cat > $WORKING/lndtyp.clr << EOF
5 0 155 127
4 128 128 128
3 255 255 0
2 0 0 139
1 0 100 0
0 0 0 0 0
EOF

convert_raster () {
    in_path="$1"
    raster_type="$2"
    raster_name="$3"
    mask="$4"
    in_name=$(basename "$in_path")

    echo "Converting $in_name..."
    color_path="$WORKING/$raster_type.clr"
    out_name="${in_name%.tif}.mbtiles"
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
for in_path in $DATA/MP2023_S*_G*_C000_U00_V00_SLA_O_02_*2_W_lndchg.tif; do
    year=$(($(basename "$in_path" | cut -d "_" -f10)-2))
    convert_raster $in_path "lndchg" "Land Change - Year $year"
done

# Process vegatation type rasters
for in_path in $DATA/MP2023_S*_G*_C000_U00_V00_SLA_N_*_*2_W_FFIBS.tif; do
    year=$(($(basename "$in_path" | cut -d "_" -f10)-2))
    convert_raster $in_path "FFIBS" "Vegegation Type - Year $year"
done

# Process flood depth rasters
for in_path in $DATA/MP2023_S*_G500_C000_U00_V00_SLA_O_*_*_CLARA_*_aep_depths_ft.tif
do
    year=$(basename "$in_path" | cut -d "_" -f10)
    [[ "$year" == "01" ]] && year="0"
    exceedance=$(basename "$in_path" | cut -d "_" -f12)
    raster_name="Flood Depth - Year $year - Exceedance Probability $exceedance"
    convert_raster $in_path "CLARA" "$raster_name" \
        "/vsizip/$DATA/Lake_Mask.zip/Lake Mask/lake_mask_for_mapping.shp"
done