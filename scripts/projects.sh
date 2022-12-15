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
select project.DisplayID as displayId, 
    project.ProjectName as name,
    max(ProjectTypeCode) as type,
    max(project.Region) as region,
    max(metadata.Description) as description,
    coalesce(min(project.StartYear_FWOA), 21) as yearmin,
    coalesce(max(project.StartYear_FWOA), 50) as yearmax
from (
    select DisplayID,
        ProjectID,
        ElementID,
        ProjectName,
        ProjectTypeCode,
        Region,
        StartYear_FWOA
    from Points
    where ModelGroup = 521
    union select DisplayID,
        ProjectID,
        ElementID,
        ProjectName,
        ProjectTypeCode,
        Region,
        StartYear_FWOA
    from Lines
    where ModelGroup = 521
    union select DisplayID,
        ProjectID,
        ElementID,
        ProjectName,
        ProjectTypeCode,
        Region,
        StartYear_FWOA
    from Polygons
    where ModelGroup = 521
) as project
left join metadata
    on project.DisplayID = metadata.DisplayID
group by project.DisplayID,
    project.ProjectName
order by project.ProjectName
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
ogr2ogr -f CSV \
    -dialect sqlite \
    -sql "$project_sql" \
    -lco SEPARATOR=TAB \
    $STATIC/projects.csv \
    $WORKING/projects.gpkg
