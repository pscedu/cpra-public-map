#!/bin/bash

DATA="./data"
TILES="./tiles"
export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

# Merge the two land-water interface rasters.
gdal_merge.py -o $DATA/lwi_merged.tif \
    $DATA/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_lndtyp.tif \
    $DATA/InitialConditionLand-WaterInterface-AtchafalayaBasin.tif

# Colorize the merged land-water interface raster.
cat > $DATA/lwi.clr << EOF
3 214 214 214
2 255 255 255
1 214 214 214
0 0 0 0 0
EOF
gdaldem color-relief -alpha $DATA/lwi_merged.tif $DATA/lwi.clr $DATA/lwi.tif

# Tile the land-water interface raster.
gdal_translate $DATA/lwi.tif $TILES/lwi.mbtiles \
    -of MBTILES -co ZOOM_LEVEL_STRATEGY=UPPER
gdaladdo $TILES/lwi.mbtiles -r cubic

# Convert vector layers to GeoJSON.
read -r -d '' road_sql << SQL
select fullname as name,
    forMapping_Type as type
from Basemap_TIGER_Roads
where forMapping_Type in ('P', 'S')
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$road_sql" \
    $DATA/road.geojson $DATA/backgroundlayers_formapping_arcmap.gdb

read -r -d '' levee_sql << SQL
select SHAPE
from Basemap_Levees
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$levee_sql" \
    $DATA/levee.geojson $DATA/backgroundlayers_formapping_arcmap.gdb

read -r -d '' water_sql << SQL
select SHAPE
from Basemap_GOM_WaterOutsideModel
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$water_sql" \
    $DATA/water.geojson $DATA/backgroundlayers_formapping_arcmap.gdb

read -r -d '' state_sql << SQL
select State as abbr
from Basemap_GOM_States
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$state_sql" \
    $DATA/state.geojson $DATA/backgroundlayers_formapping_arcmap.gdb

# TODO: Add annotations centroids for labels.

read -r -d '' project_point_sql << SQL
select ProjectName as name,
    ProjectNumber as project_number,
    MasterPlan as plan,
    Region as region,
    ProjectTypeCode as type,
    ActiveProject as active
from Points
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$project_point_sql" \
    $DATA/project_point.geojson $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

read -r -d '' project_line_sql << SQL
select ProjectName as name,
    ProjectNumber as project_number,
    MasterPlan as plan,
    Region as region,
    ProjectTypeCode as type,
    ActiveProject as active
from Lines
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$project_line_sql" \
    $DATA/project_line.geojson $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

read -r -d '' project_polygon_sql << SQL
select ProjectName as name,
    ProjectNumber as project_number,
    MasterPlan as plan,
    Region as region,
    ProjectTypeCode as type,
    ActiveProject as active
from Polygons
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$project_polygon_sql" \
    $DATA/project_polygon.geojson $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

# Generate vector tiles.
echo "Generating vector tiles..."
tippecanoe -zg -o $TILES/basemap.mbtiles \
    --force \
    --coalesce-densest-as-needed \
    --extend-zooms-if-still-dropping \
    --base-zoom=7 \
    $DATA/project_point.geojson \
    $DATA/project_line.geojson \
    $DATA/project_polygon.geojson \
    $DATA/road.geojson \
    $DATA/levee.geojson \
    $DATA/water.geojson \
    $DATA/state.geojson
