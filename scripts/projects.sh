#!/bin/bash

DATA="./data"
WORKING="./working"
SCRIPTS="./scripts"
STATIC="./src/static"
export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

# Load .env file.
export $(cat .env | xargs)

read -r -d '' project_sql << SQL
select project.DisplayID as display_id, 
    project.ProjectName as name,
    max(ProjectTypeCode) as type,
    max(Region) as region,
    max(metadata.Description) as description,
    coalesce(min(project.StartYear_FWOA), 21) as yearmin,
    coalesce(max(project.StartYear_FWOA), 50) as yearmax,
    st_minx(st_collect(geom)) as xmin,
    st_miny(st_collect(geom)) as ymin,
    st_maxx(st_collect(geom)) as xmax,
    st_maxy(st_collect(geom)) as ymax
from (
    select DisplayID,
        ProjectID,
        ElementID,
        ProjectName,
        ProjectTypeCode,
        Region,
        StartYear_FWOA,
        Shape as geom
    from Points
    where ModelGroup = 516
    union select DisplayID,
        ProjectID,
        ElementID,
        ProjectName,
        ProjectTypeCode,
        Region,
        StartYear_FWOA,
        Shape as geom
    from Lines
    where ModelGroup = 516
    union select DisplayID,
        ProjectID,
        ElementID,
        ProjectName,
        ProjectTypeCode,
        Region,
        StartYear_FWOA,
        Shape as geom
    from Polygons
    where ModelGroup = 516
) as project
left join metadata
    on project.DisplayID = metadata.DisplayID
group by project.DisplayID,
    project.ProjectName
SQL

# Reproject project data to WGS 84.
ogr2ogr -t_srs "EPSG:4326" \
    $WORKING/projects.gpkg \
    $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

# Add metadata.
ogr2ogr -append $WORKING/projects.gpkg \
    PG:"dbname='$PG_DB' host='$PG_HOST' user='$PG_USER' password='$PG_PASSWORD'" \
    -nln "metadata" \
    "pct.ProjectMetadata"

# Export CSV.
ogr2ogr -dialect sqlite -sql "$project_sql" \
    $STATIC/projects.csv \
    $WORKING/projects.gpkg