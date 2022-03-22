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
    -of MBTILES -co ZOOM_LEVEL_STRATEGY=UPPER \
    -co NAME="Base Map: Raster"
gdaladdo $TILES/basemap-raster.mbtiles -r cubic

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

read -r -d '' community_label_sql << SQL
select replace(replace(replace(replace(TextString, X'0A', ' '), X'0D', ' '),
        '  ', ' '), '  ', ' ') as text,
    'community' as type,
    SHAPE
from Ref_Communities_CoastwideLocations
SQL
ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$community_label_sql" \
    $DATA/label.geojson $DATA/productionmap_formapping_arcmap.gdb

read -r -d '' water_label_sql << SQL
select replace(replace(replace(replace(TextString, X'0A', ' '), X'0D', ' '),
        '  ', ' '), '  ', ' ') as text,
    'water' as type,
    SHAPE
from Ref_Waterbodies_CoastwideLocations
SQL
ogr2ogr -append -t_srs "EPSG:4326" -dialect sqlite -sql "$water_label_sql" \
    $DATA/label.geojson $DATA/productionmap_formapping_arcmap.gdb


read -r -d '' project_sql << SQL
select replace(replace(replace(replace(replace(lower(ProjectName),
        ' ', '-'), '.', ''), '''', ''), '/', '-'), '---', '-') as project_id,
    case when ProjectTypeCode = 'IP' then (
        case when ElementTypeCode = 'MC' and ProjectName like "%Landbridge%" then 'LB'
            when ElementTypeCode in ('CH', 'CL') then 'HR'
            when ElementTypeCode in ('EL', 'GA', 'PL', 'PW') then 'SR'
            when ElementTypeCode in ('BS', 'MC', 'OR', 'RR', 'SP') then ElementTypeCode
            else 'IP' end
        ) else ProjectTypeCode end as type,
    Shape as geom
from LAYER
where ActiveProject = 1
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "${project_sql/LAYER/Points}" \
    $DATA/project_point.geojson $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "${project_sql/LAYER/Lines}" \
    $DATA/project_line.geojson $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "${project_sql/LAYER/Polygons}" \
    $DATA/project_polygon.geojson $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

# Generate vector tiles.
echo "Generating vector tiles..."
tippecanoe -zg -o $TILES/basemap-vector.mbtiles \
    --force \
    --coalesce-densest-as-needed \
    --extend-zooms-if-still-dropping \
    --base-zoom=7 \
    -n "Base Map: Vector" \
    $DATA/project_point.geojson \
    $DATA/project_line.geojson \
    $DATA/project_polygon.geojson \
    $DATA/label.geojson \
    $DATA/road.geojson \
    $DATA/levee.geojson \
    $DATA/water.geojson \
    $DATA/state.geojson
