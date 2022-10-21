#!/bin/bash

DATA="./data"
WORKING="./working"
SCRIPTS="./scripts"
STATIC="./src/static"
export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

read -r -d '' project_sql << SQL
select project.DisplayID as displayId, 
    project.ProjectName as name,
    max(ProjectTypeCode) as type,
    max(Region) as region,
    max(metadata.ProjectDescription) as description,
    coalesce(min(ip.year), 21) as yearmin,
    coalesce(max(ip.year), 50) as yearmax
from (
    select DisplayID,
        ProjectID,
        ElementID,
        ProjectName,
        ProjectTypeCode,
        Region,
        Shape as geom
    from Points
    where ActiveProject = 1
    union select DisplayID,
        ProjectID,
        ElementID,
        ProjectName,
        ProjectTypeCode,
        Region,
        Shape as geom
    from Lines
    where ActiveProject = 1
    union select DisplayID,
        ProjectID,
        ElementID,
        ProjectName,
        ProjectTypeCode,
        Region,
        Shape as geom
    from Polygons
    where ActiveProject = 1
) as project
left join metadata
    on project.DisplayID = metadata.DisplayID
left join implementation_period as ip
    on project.ProjectID = ip.ProjectID
        and (ip.ElementID = '' or project.ElementID = ip.ElementID)
group by project.DisplayID,
    project.ProjectName
SQL

# Reproject project data to WGS 84.
ogr2ogr -t_srs "EPSG:4326" \
    $WORKING/projects.gpkg \
    $DATA/ProjectDevelopmentGeodatabase_forMapping.gdb

# Add metadata.
ogr2ogr -append $WORKING/projects.gpkg \
    "$DATA/MP23 Project Metadata and Costs_20220406.xlsx" \
    -nln "metadata" \
    "ProjectMetadata"

# Add implementation period data.
ogr2ogr -append $WORKING/projects.gpkg $DATA/implementation_period.csv

# Export CSV.
ogr2ogr -f CSV \
    -dialect sqlite \
    -sql "$project_sql" \
    -lco SEPARATOR=TAB \
    $STATIC/projects.csv \
    $WORKING/projects.gpkg
