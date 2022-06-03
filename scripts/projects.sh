#!/bin/bash

DATA="./data"
WORKING="./working"
STATIC="./src/static"
export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

read -r -d '' project_sql << SQL
select ProjectName as name,
    max(ProjectTypeCode) as type,
    max(Region) as region,
    st_minx(st_collect(geom)) as xmin,
    st_miny(st_collect(geom)) as ymin,
    st_maxx(st_collect(geom)) as xmax,
    st_maxy(st_collect(geom)) as ymax
from (
    select ProjectName,
        ProjectTypeCode,
        Region,
        Shape as geom
    from Points
    where ActiveProject = 1
    union select ProjectName,
        ProjectTypeCode,
        Region,
        Shape as geom
    from Lines
    where ActiveProject = 1
    union select ProjectName,
        ProjectTypeCode,
        Region,
        Shape as geom
    from Polygons
    where ActiveProject = 1
)
group by ProjectName
SQL

# Reproject project data to WGS 84.
ogr2ogr -t_srs "EPSG:4326" \
    $WORKING/projects.gpkg \
    $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

# Export CSV.
ogr2ogr -dialect sqlite -sql "$project_sql" \
    $STATIC/projects.csv \
    $WORKING/projects.gpkg