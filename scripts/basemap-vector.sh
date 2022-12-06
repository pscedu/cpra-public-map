#!/bin/bash

DATA="./data"
TILES="./tiles"
WORKING="./working"

export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

mkdir -p "$WORKING"
mkdir -p "$TILES"

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

ogr2ogr -s_srs "EPSG:4326" -t_srs "EPSG:4326" \
    -oo KEEP_GEOM_COLUMNS=NO -oo X_POSSIBLE_NAMES=x -oo Y_POSSIBLE_NAMES=y \
    $WORKING/label.geojson $DATA/labels.csv

read -r -d '' project_sql << SQL
select ProjectName as name,
    DisplayID as display_id,
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
from LAYER as project
where ModelGroup = 516 and ImplementationPeriod = 1
SQL

read -r -d '' project_label_sql << SQL
select name,
    display_id,
    type,
    st_pointonsurface(st_collect(geom)) as geom
from (
    ${project_sql/LAYER/Points}
    union ${project_sql/LAYER/Lines}
    union ${project_sql/LAYER/Polygons})
as points group by name,
    display_id,
    type
SQL

# Reproject project data to WGS 84.
ogr2ogr -t_srs "EPSG:4326" \
    $WORKING/projects.gpkg \
    $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

ogr2ogr -dialect sqlite -sql "${project_sql/LAYER/Points}" \
    $WORKING/project_point.geojson $WORKING/projects.gpkg

ogr2ogr -dialect sqlite -sql "${project_sql/LAYER/Lines}" \
    $WORKING/project_line.geojson $WORKING/projects.gpkg

ogr2ogr -dialect sqlite \
    -sql "select name, display_id, type, st_union(geom) as geom from (${project_sql/LAYER/Polygons}) as polygons group by name, display_id, type" \
    $WORKING/project_polygon.geojson $WORKING/projects.gpkg

ogr2ogr -dialect sqlite -sql "$project_label_sql" \
    $WORKING/project_label.geojson $WORKING/projects.gpkg

# Prepare search layers.
read -r -d '' region_sql << SQL
select lower(BASIN) as id,
    geometry as geom
from MP2023_regions
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$region_sql" -dialect sqlite \
    $WORKING/region.geojson \
    /vsizip/$DATA/MP_Regions_Shapefile.zip/MP_Regions_Shapefile/MP2023_regions.shp

read -r -d '' parish_sql << SQL
select COUNTYFP as id
from tl_2021_us_county
where STATEFP = '22'
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$parish_sql" \
    $WORKING/parish.geojson \
    /vsizip/$DATA/tl_2021_us_county.zip/tl_2021_us_county.shp

read -r -d '' uscd_sql << SQL
select CD116FP as id
from tl_2021_us_cd116
where STATEFP = '22'
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$uscd_sql" \
    $WORKING/uscd.geojson \
    /vsizip/$DATA/tl_2021_us_cd116.zip/tl_2021_us_cd116.shp

read -r -d '' lash_sql << SQL
select SLDLST as id
from tl_2021_22_sldl
where FUNCSTAT = 'N'
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$lash_sql" \
    $WORKING/lash.geojson \
    /vsizip/$DATA/tl_2021_22_sldl.zip/tl_2021_22_sldl.shp

read -r -d '' lass_sql << SQL
select SLDUST as id
from tl_2021_22_sldu
where FUNCSTAT = 'N'
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$lass_sql" \
    $WORKING/lass.geojson \
    /vsizip/$DATA/tl_2021_22_sldu.zip/tl_2021_22_sldu.shp

# Generate polygons for areas outside the searchable geometries.
# This is necessary to create the overlay effect on the map.
read -r -d '' parish_sql << SQL
select ST_Difference(ST_Envelope(ST_Collect(geometry)), ST_Collect(geometry)) as geom
from tl_2021_us_county
where STATEFP = '22'
group by true
SQL
ogr2ogr -t_srs "EPSG:4326" -dialect "sqlite" -sql "$parish_sql" \
    $WORKING/outer.gpkg \
    -nln parish \
    /vsizip/$DATA/tl_2021_us_county.zip/tl_2021_us_county.shp

read -r -d '' uscd_sql << SQL
select ST_Difference(ST_Envelope(ST_Collect(geometry)), ST_Collect(geometry)) as geom
from tl_2021_us_cd116
where STATEFP = '22'
group by true
SQL
ogr2ogr -append -t_srs "EPSG:4326" -dialect "sqlite" -sql "$uscd_sql" \
    $WORKING/outer.gpkg \
    -nln uscd \
    /vsizip/$DATA/tl_2021_us_cd116.zip/tl_2021_us_cd116.shp

read -r -d '' lash_sql << SQL
select ST_Difference(ST_Envelope(ST_Collect(geometry)), ST_Collect(geometry)) as geom
from tl_2021_22_sldl
where FUNCSTAT = 'N'
group by true
SQL
ogr2ogr -append -t_srs "EPSG:4326" -dialect "sqlite" -sql "$lash_sql" \
    $WORKING/outer.gpkg \
    -nln lash \
    /vsizip/$DATA/tl_2021_22_sldl.zip/tl_2021_22_sldl.shp

read -r -d '' lass_sql << SQL
select ST_Difference(ST_Envelope(ST_Collect(geometry)), ST_Collect(geometry)) as geom
from tl_2021_22_sldu
where FUNCSTAT = 'N'
group by true
SQL
ogr2ogr -append -t_srs "EPSG:4326" -dialect "sqlite" -sql "$lass_sql" \
    $WORKING/outer.gpkg \
    -nln lass \
    /vsizip/$DATA/tl_2021_22_sldu.zip/tl_2021_22_sldu.shp

read -r -d '' region_sql << SQL
select ST_Difference(ST_Buffer(ST_Envelope(ST_Collect(geometry)), 0), ST_Buffer(ST_Collect(geometry), 0)) as geom
from MP2023_regions
group by true
SQL
ogr2ogr -append -t_srs "EPSG:4326" -dialect "sqlite" -sql "$region_sql" \
    $WORKING/outer.gpkg \
    -nln region \
    /vsizip/$DATA/MP_Regions_Shapefile.zip/MP_Regions_Shapefile/MP2023_regions.shp

read -r -d '' outer_sql << SQL
select 'parish' as type,
    geom
from parish
union select 'uscd' as type,
    geom
from uscd
union select 'lash' as type,
    geom
from lash
union select 'lass' as type,
    geom
from lass
union select 'region' as type,
    geom
from region
SQL
ogr2ogr -t_srs "EPSG:4326" -dialect "sqlite" -sql "$outer_sql" \
    $WORKING/outer.geojson \
    -nln outer \
    $WORKING/outer.gpkg

# Generate vector tiles.
echo "Generating vector tiles..."
tippecanoe -zg -o $TILES/basemap-vector.mbtiles \
    --force \
    --coalesce-densest-as-needed \
    --extend-zooms-if-still-dropping \
    --base-zoom=7 \
    -n "Base Map: Vector" \
    $WORKING/parish.geojson \
    $WORKING/uscd.geojson \
    $WORKING/lash.geojson \
    $WORKING/lass.geojson \
    $WORKING/region.geojson \
    $WORKING/outer.geojson \
    $WORKING/project_label.geojson \
    $WORKING/project_point.geojson \
    $WORKING/project_line.geojson \
    $WORKING/project_polygon.geojson \
    $WORKING/label.geojson \
    $WORKING/road.geojson \
    $WORKING/levee.geojson \
    $WORKING/water.geojson \
    $WORKING/state.geojson
