#!/bin/bash

DATA="./data"
WORKING="./working"
TILES="./tiles"

mkdir -p "$WORKING"
mkdir -p "$TILES"

# FFIBS color map
cat > $WORKING/FFIBS.clr << EOF
-9999.999 0 0 0 0
-0.011 0 0 0 0
-0.010 0 100 0
0.150 0 100 0
0.151 1 127 1
1.509 1 127 1
1.510 255 255 0
5.009 255 255 0
5.010 255 165 0
18.009 255 165 0
18.010 255 0 0
25.010 255 0 0
200 100 149 237
300 139 69 19
400 192 192 192
500 175 238 238
500.001 0 0 0
9999.999 0 0 0
EOF

# Land change color map
cat > $WORKING/lndchg.clr << EOF
55 153 193 4
52 69 145 172
51 153 193 4
44 153 193 4
33 153 193 4
32 69 145 172
31 153 193 4
23 38 81 24
22 0 0 0 0
21 38 81 24
13 153 193 4
12 69 145 172
11 153 193 4
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

for in_path in $DATA/MP2023_S*_G*_C000_U00_V00_SLA_N_*_*_W_*.tif; do
    in_name=$(basename "$in_path")
    if [[ "$in_name" =~ .*(FFIBS|lndchg)\.tif ]]; then
        echo "Converting $in_name..."
        raster_type="${BASH_REMATCH[1]}"
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

        # Tile the highest zoom level.
        gdal_translate $working_tif_path $working_tiles_path \
            -of MBTILES -co ZOOM_LEVEL_STRATEGY=UPPER

        # Add lower zoom levels.
        gdaladdo $working_tiles_path -r cubic

        # Move the tiles to the output directory.
        mv $working_tiles_path $out_path
        echo
    fi
done
