#!/bin/bash

DATA="./data"
WORKING="./working"
SCRIPTS="./scripts"
STATIC="./src/static"
export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

read -r -d '' project_sql << SQL
select projects.name,
    projects.type,
    projects.region,
    metadata.ProjectDescription as description,
    projects.xmin,
    projects.ymin,
    projects.xmax,
    projects.ymax
from projects
left join metadata
    on projects.display_id = metadata.DisplayID
SQL

# Reproject project data to WGS 84.
ogr2ogr -t_srs "EPSG:4326" \
    $WORKING/projects.gpkg \
    $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

# Export CSV.
ogr2ogr -dialect sqlite -sql "$project_sql" \
    $STATIC/projects.csv \
    $SCRIPTS/projects.vrt