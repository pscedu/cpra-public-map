#!/bin/bash

DATA="./data"
TILES="./tiles"
WORKING="./working"

export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

mkdir -p "$WORKING"
mkdir -p "$TILES"

# Colorize the merged land-water interface raster.
cat > $WORKING/lwi.clr << EOF
3 0 0 0 0 0
2 255 255 255
1 0 0 0 0 0
0 0 0 0 0
EOF
gdaldem color-relief -alpha \
    $DATA/MP23_FWA_map_template/commondata/raster_data1/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_lndtyp.tif \
    $WORKING/lwi.clr $WORKING/lwi.tif

# Tile the land-water interface raster.
gdal_translate $WORKING/lwi.tif $TILES/basemap-raster.mbtiles \
    -of MBTILES -co ZOOM_LEVEL_STRATEGY=UPPER \
    -co NAME="Base Map: Raster"
gdaladdo $TILES/basemap-raster.mbtiles -r nearest
