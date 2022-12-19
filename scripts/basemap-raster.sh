#!/bin/bash

DATA="./data"
TILES="./tiles"
WORKING="./working"

export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

mkdir -p "$WORKING"
mkdir -p "$TILES"

# Merge the two land-water interface rasters.
gdal_merge.py -o $WORKING/lwi_merged.tif \
    $DATA/MP23_FWA_map_template/commondata/raster_data1/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_lndtyp.tif \
    $DATA/MP23_FWA_map_template/commondata/raster_data/InitialConditionLand-WaterInterface-AtchafalayaBasin.tif

# Colorize the merged land-water interface raster.
cat > $WORKING/lwi.clr << EOF
3 214 214 214
2 255 255 255
1 214 214 214
0 0 0 0 0
EOF
gdaldem color-relief -alpha $WORKING/lwi_merged.tif $WORKING/lwi.clr $WORKING/lwi.tif

# Tile the land-water interface raster.
gdal_translate $WORKING/lwi.tif $TILES/lwi.mbtiles \
    -of MBTILES -co ZOOM_LEVEL_STRATEGY=UPPER \
    -co NAME="Base Map: Raster"
gdaladdo $TILES/basemap-raster.mbtiles -r cubic
