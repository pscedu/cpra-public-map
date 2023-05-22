#!/bin/bash

DATA="./data"
WORKING="./working"
TILES="./tiles"

export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

mkdir -p "$WORKING"
mkdir -p "$TILES"

ecoregion_mask_tif="$WORKING/mask-ecoregion.tif"
water_mask_tif="$WORKING/mask-water.tif"

# Mask excluded ecoregions.
cp $DATA/blank.tif $ecoregion_mask_tif
gdal_rasterize -b 1 -burn 0 \
  -where "ecoregion in ('ATB', 'UVR')" \
  "/vsizip/$DATA/MP23_Ecoregions_withAtch.zip" $ecoregion_mask_tif

# Mask polders.
gdal_rasterize -b 1 -burn 0 \
  "/vsizip/$DATA/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_polders.shp.zip" \
  $ecoregion_mask_tif

# Mask water from initial conditions raster.
gdal_calc.py --calc="A!=2" --type=Byte \
  --co="COMPRESS=LZW" --overwrite --hideNoData --extent=union \
  --outfile="$water_mask_tif" \
  -A "$DATA/MP2023_S00_G500_C000_U00_V00_SLA_I_00_00_W_lndtyp.tif" \
  -B "$DATA/blank.tif"  # Used to get the correct extent

# Mask water outside model.
gdal_rasterize -b 1 -burn 0 \
    -l "GOM_WaterOutsideModel" \
    "$DATA/BackgroundLayers_forMapping.gdb" $water_mask_tif
