#!/bin/bash

DATA="./data"
WORKING="./working"
SCRIPTS="./scripts"
STATIC="./src/static"
export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

read -r -d '' project_sql << SQL
select 'project:' || project.DisplayID as id,
    project.ProjectName as name,
    'Project' as type,
    st_minx(st_collect(geom)) as xmin,
    st_miny(st_collect(geom)) as ymin,
    st_maxx(st_collect(geom)) as xmax,
    st_maxy(st_collect(geom)) as ymax
from (
    select DisplayID,
        ProjectName,
        Shape as geom
    from Points
    where ActiveProject = 1
    union select DisplayID,
        ProjectName,
        Shape as geom
    from Lines
    where ActiveProject = 1
    union select DisplayID,
        ProjectName,
        Shape as geom
    from Polygons
    where ActiveProject = 1
) as project
group by project.DisplayID,
    project.ProjectName
SQL

read -r -d '' project_type_sql << SQL
select 'project-type:' || lower(project.ProjectTypeCode) as id,
    project.ProjectTypeCode as name,
    'Project Type' as type,
    st_minx(st_collect(geom)) as xmin,
    st_miny(st_collect(geom)) as ymin,
    st_maxx(st_collect(geom)) as xmax,
    st_maxy(st_collect(geom)) as ymax
from (
    select ProjectTypeCode,
        Shape as geom
    from Points
    where ActiveProject = 1
    union select ProjectTypeCode,
        Shape as geom
    from Lines
    where ActiveProject = 1
    union select ProjectTypeCode,
        Shape as geom
    from Polygons
    where ActiveProject = 1
) as project
group by ProjectTypeCode
SQL

read -r -d '' region_sql << SQL
select 'region:' || lower(BASIN) as id,
    UNIT as name,
    'Region' as type,
    st_minx(st_collect(geom)) as xmin,
    st_miny(st_collect(geom)) as ymin,
    st_maxx(st_collect(geom)) as xmax,
    st_maxy(st_collect(geom)) as ymax
from MP2023_regions
group by BASIN, UNIT
SQL

read -r -d '' parish_sql << SQL
select 'parish:' || COUNTYFP as id,
    NAME as name,
    'Parish' as type,
    st_minx(st_collect(geom)) as xmin,
    st_miny(st_collect(geom)) as ymin,
    st_maxx(st_collect(geom)) as xmax,
    st_maxy(st_collect(geom)) as ymax
from parish
group by COUNTYFP, NAME
SQL

read -r -d '' uscd_sql << SQL
select 'uscd:' || CD116FP as id,
    NAMELSAD as name,
    'US Congressional District' as type,
    st_minx(st_collect(geom)) as xmin,
    st_miny(st_collect(geom)) as ymin,
    st_maxx(st_collect(geom)) as xmax,
    st_maxy(st_collect(geom)) as ymax
from uscd
group by CD116FP, NAMELSAD
SQL

read -r -d '' lash_sql << SQL
select 'lash:' || SLDLST as id,
    NAMELSAD as name,
    'LA State House District' as type,
    st_minx(st_collect(geom)) as xmin,
    st_miny(st_collect(geom)) as ymin,
    st_maxx(st_collect(geom)) as xmax,
    st_maxy(st_collect(geom)) as ymax
from lash
group by SLDLST, NAMELSAD
SQL

read -r -d '' lass_sql << SQL
select 'lass:' || SLDUST as id,
    NAMELSAD as name,
    'LA State House District' as type,
    st_minx(st_collect(geom)) as xmin,
    st_miny(st_collect(geom)) as ymin,
    st_maxx(st_collect(geom)) as xmax,
    st_maxy(st_collect(geom)) as ymax
from lass
group by SLDUST, NAMELSAD
SQL

# Reproject project data to WGS 84.
ogr2ogr -t_srs "EPSG:4326" \
    $WORKING/search.gpkg \
    $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

# Reproject region data to WGS 84.
ogr2ogr -append -t_srs "EPSG:4326" \
    $WORKING/search.gpkg \
    /vsizip/$DATA/MP_Regions_Shapefile.zip/MP_Regions_Shapefile/MP2023_regions.shp

# Reproject parish data to WGS 84.
ogr2ogr -append -t_srs "EPSG:4326" -where "STATEFP = '22'" \
    $WORKING/search.gpkg \
    -nln parish \
    -nlt MultiPolygon \
    /vsizip/$DATA/tl_2021_us_county.zip/tl_2021_us_county.shp

# Reproject US congressional district data to WGS 84.
ogr2ogr -append -t_srs "EPSG:4326" -where "STATEFP = '22'" \
    $WORKING/search.gpkg \
    -nln uscd \
    -nlt MultiPolygon \
    /vsizip/$DATA/tl_2021_us_cd116.zip/tl_2021_us_cd116.shp

# Reproject LA state house data to WGS 84.
ogr2ogr -append -t_srs "EPSG:4326" -where "FUNCSTAT = 'N'" \
    $WORKING/search.gpkg \
    -nln lash \
    -nlt MultiPolygon \
    /vsizip/$DATA/tl_2021_22_sldl.zip/tl_2021_22_sldl.shp

# Reproject LA state senate data to WGS 84.
ogr2ogr -append -t_srs "EPSG:4326" -where "FUNCSTAT = 'N'" \
    $WORKING/search.gpkg \
    -nln lass \
    -nlt MultiPolygon \
    /vsizip/$DATA/tl_2021_22_sldu.zip/tl_2021_22_sldu.shp

# Export CSV.
ogr2ogr -dialect sqlite -sql "$project_sql" \
    $STATIC/search.csv \
    $WORKING/search.gpkg

ogr2ogr -append -dialect sqlite -sql "$project_type_sql" \
    $STATIC \
    -nln search \
    $WORKING/search.gpkg

ogr2ogr -append -dialect sqlite -sql "$region_sql" \
    $STATIC \
    -nln search \
    $WORKING/search.gpkg

ogr2ogr -append -dialect sqlite -sql "$parish_sql" \
    $STATIC \
    -nln search \
    $WORKING/search.gpkg

ogr2ogr -append -dialect sqlite -sql "$uscd_sql" \
    $STATIC \
    -nln search \
    $WORKING/search.gpkg

ogr2ogr -append -dialect sqlite -sql "$lash_sql" \
    $STATIC \
    -nln search \
    $WORKING/search.gpkg

ogr2ogr -append -dialect sqlite -sql "$lass_sql" \
    $STATIC \
    -nln search \
    $WORKING/search.gpkg