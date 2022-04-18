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
    $DATA/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_lndtyp.tif \
    $DATA/InitialConditionLand-WaterInterface-AtchafalayaBasin.tif

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

# Convert vector layers to GeoJSON.
read -r -d '' road_sql << SQL
select fullname as name,
    forMapping_Type as type
from Basemap_TIGER_Roads
where forMapping_Type in ('P', 'S')
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$road_sql" \
    $WORKING/road.geojson $DATA/backgroundlayers_formapping_arcmap.gdb

read -r -d '' levee_sql << SQL
select SHAPE
from Basemap_Levees
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$levee_sql" \
    $WORKING/levee.geojson $DATA/backgroundlayers_formapping_arcmap.gdb

read -r -d '' water_sql << SQL
select SHAPE
from Basemap_GOM_WaterOutsideModel
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$water_sql" \
    $WORKING/water.geojson $DATA/backgroundlayers_formapping_arcmap.gdb

read -r -d '' state_sql << SQL
select State as abbr
from Basemap_GOM_States
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$state_sql" \
    $WORKING/state.geojson $DATA/backgroundlayers_formapping_arcmap.gdb

read -r -d '' community_label_sql << SQL
select replace(replace(replace(replace(TextString, X'0A', ' '), X'0D', ' '),
        '  ', ' '), '  ', ' ') as text,
    'community' as type,
    SHAPE
from Ref_Communities_CoastwideLocations
SQL
ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$community_label_sql" \
    $WORKING/label.geojson $DATA/productionmap_formapping_arcmap.gdb

read -r -d '' water_label_sql << SQL
select replace(replace(replace(replace(TextString, X'0A', ' '), X'0D', ' '),
        '  ', ' '), '  ', ' ') as text,
    'water' as type,
    SHAPE
from Ref_Waterbodies_CoastwideLocations
SQL
ogr2ogr -append -t_srs "EPSG:4326" -dialect sqlite -sql "$water_label_sql" \
    $WORKING/label.geojson $DATA/productionmap_formapping_arcmap.gdb


read -r -d '' project_sql << SQL
select replace(replace(replace(replace(replace(lower(ProjectName),
        ' ', '-'), '.', ''), '''', ''), '/', '-'), '---', '-') as project_id,
    case when ProjectTypeCode = 'IP' then (
        case when ProjectName = 'Manchac Wetland Restoration and Maurepas Landbridge'
                then 'MC' 
            when ElementTypeCode = 'MC' and ProjectName like "%Landbridge%" then 'LB'
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
    $WORKING/project_point.geojson $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "${project_sql/LAYER/Lines}" \
    $WORKING/project_line.geojson $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "${project_sql/LAYER/Polygons}" \
    $WORKING/project_polygon.geojson $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

read -r -d '' parish_label_sql << SQL
select NAME as text,
    st_pointonsurface(geometry) as geom
from tl_2021_us_county
where STATEFP = '22'
SQL
ogr2ogr -t_srs "EPSG:4326" -dialect "sqlite" -sql "$parish_label_sql" \
    $WORKING/parish_label.geojson \
    /vsizip/$DATA/tl_2021_us_county.zip/tl_2021_us_county.shp

ogr2ogr -t_srs "EPSG:4326" -where "STATEFP = '22'" \
    $WORKING/parish.geojson /vsizip/$DATA/tl_2021_us_county.zip/tl_2021_us_county.shp

python3 ./scripts/poly2line.py $WORKING/parish.geojson $WORKING/parish_line.geojson

read -r -d '' uscd_label_sql << SQL
select cast(cast(CD116FP as integer) as character(3)) as text,
    st_pointonsurface(geometry) as geom
from tl_2021_us_cd116
where STATEFP = '22'
SQL
ogr2ogr -t_srs "EPSG:4326" -dialect "sqlite" -sql "$uscd_label_sql" \
    $WORKING/uscd_label.geojson /vsizip/$DATA/tl_2021_us_cd116.zip/tl_2021_us_cd116.shp

ogr2ogr -t_srs "EPSG:4326" -where "STATEFP = '22'" \
    $WORKING/uscd.geojson /vsizip/$DATA/tl_2021_us_cd116.zip/tl_2021_us_cd116.shp

python3 ./scripts/poly2line.py $WORKING/uscd.geojson $WORKING/uscd_line.geojson

read -r -d '' lash_label_sql << SQL
select cast(cast(SLDLST as integer) as character(3)) as text,
    st_pointonsurface(geometry) as geom
from tl_2021_22_sldl
where FUNCSTAT = 'N'
SQL
ogr2ogr -t_srs "EPSG:4326" -dialect "sqlite" -sql "$lash_label_sql" \
    $WORKING/lash_label.geojson /vsizip/$DATA/tl_2021_22_sldl.zip/tl_2021_22_sldl.shp

ogr2ogr -t_srs "EPSG:4326" -where "FUNCSTAT = 'N'" \
    $WORKING/lash.geojson /vsizip/$DATA/tl_2021_22_sldl.zip/tl_2021_22_sldl.shp

python3 ./scripts/poly2line.py $WORKING/lash.geojson $WORKING/lash_line.geojson

read -r -d '' lass_label_sql << SQL
select cast(cast(SLDUST as integer) as character(3)) as text,
    centroid(geometry) as geom
from tl_2021_22_sldu
where FUNCSTAT = 'N'
SQL
ogr2ogr -t_srs "EPSG:4326" -dialect "sqlite" -sql "$lass_label_sql" \
    $WORKING/lass_label.geojson /vsizip/$DATA/tl_2021_22_sldu.zip/tl_2021_22_sldu.shp

ogr2ogr -t_srs "EPSG:4326" -where "FUNCSTAT = 'N'" \
    $WORKING/lass.geojson /vsizip/$DATA/tl_2021_22_sldu.zip/tl_2021_22_sldu.shp

python3 ./scripts/poly2line.py $WORKING/lass.geojson $WORKING/lass_line.geojson

# Generate vector tiles.
echo "Generating vector tiles..."
tippecanoe -zg -o $TILES/basemap-vector.mbtiles \
    --force \
    --coalesce-densest-as-needed \
    --extend-zooms-if-still-dropping \
    --base-zoom=7 \
    -n "Base Map: Vector" \
    $WORKING/parish_label.geojson \
    $WORKING/uscd_label.geojson \
    $WORKING/lash_label.geojson \
    $WORKING/lass_label.geojson \
    $WORKING/parish_line.geojson \
    $WORKING/uscd_line.geojson \
    $WORKING/lash_line.geojson \
    $WORKING/lass_line.geojson \
    $WORKING/project_point.geojson \
    $WORKING/project_line.geojson \
    $WORKING/project_polygon.geojson \
    $WORKING/label.geojson \
    $WORKING/road.geojson \
    $WORKING/levee.geojson \
    $WORKING/water.geojson \
    $WORKING/state.geojson
