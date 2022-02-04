#!/bin/bash

DATA="./data"
TILES="./tiles"
export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

# Colorize land type raster.
cat > $DATA/lndtyp.clr << EOF
5 0 155 127
4 128 128 128
3 255 255 0
2 0 0 139
1 0 100 0
0 0 0 0 0
EOF
gdaldem color-relief -alpha \
    $DATA/MP2023_S07_G500_C000_U00_V00_SLA_N_52_52_W_lndtyp30.xyz \
    $DATA/lndtyp.clr \
    $DATA/lndtyp.tif

# Tile the land type raster.
gdal_edit.py -a_srs "EPSG:26915" $DATA/lndtyp.tif
gdal_translate $DATA/lndtyp.tif $TILES/lndtyp.mbtiles \
    -of MBTILES -co ZOOM_LEVEL_STRATEGY=UPPER
gdaladdo $TILES/lndtyp.mbtiles -r cubic
