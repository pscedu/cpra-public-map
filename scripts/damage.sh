#!/bin/bash

DATA="./data"
TILES="./tiles"
WORKING="./working"

export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

mkdir -p "$WORKING"
mkdir -p "$TILES"

# Load .env file.
export $(cat .env | xargs)

# Convert vector layers to GeoJSON.
read -r -d '' damage_sql << SQL
select "CommunityID" as community_id,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 1 then "EAD_50" else 0 end)) as bigint) as ead_s07_g500_year0,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 10 then "EAD_50" else 0 end)) as bigint) as ead_s07_g500_year10,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 20 then "EAD_50" else 0 end)) as bigint) as ead_s07_g500_year20,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 30 then "EAD_50" else 0 end)) as bigint) as ead_s07_g500_year30,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 40 then "EAD_50" else 0 end)) as bigint) as ead_s07_g500_year40,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 50 then "EAD_50" else 0 end)) as bigint) as ead_s07_g500_year50,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 1 then "EAD_50" else 0 end)) as bigint) as ead_s08_g500_year0,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 500 and "Year_FWOA" = 10 then "EAD_50" else 0 end)) as bigint) as ead_s08_g500_year10,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 500 and "Year_FWOA" = 20 then "EAD_50" else 0 end)) as bigint) as ead_s08_g500_year20,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 500 and "Year_FWOA" = 30 then "EAD_50" else 0 end)) as bigint) as ead_s08_g500_year30,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 500 and "Year_FWOA" = 40 then "EAD_50" else 0 end)) as bigint) as ead_s08_g500_year40,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 500 and "Year_FWOA" = 50 then "EAD_50" else 0 end)) as bigint) as ead_s08_g500_year50,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 1 then "EAD_50" else 0 end)) as bigint) as ead_s07_g516_year0,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 515 and "Year_FWOA" = 10 then "EAD_50" else 0 end)) as bigint) as ead_s07_g516_year10,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 515 and "Year_FWOA" = 20 then "EAD_50" else 0 end)) as bigint) as ead_s07_g516_year20,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 516 and "Year_FWOA" = 30 then "EAD_50" else 0 end)) as bigint) as ead_s07_g516_year30,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 516 and "Year_FWOA" = 40 then "EAD_50" else 0 end)) as bigint) as ead_s07_g516_year40,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 516 and "Year_FWOA" = 50 then "EAD_50" else 0 end)) as bigint) as ead_s07_g516_year50,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 1 then "EAD_50" else 0 end)) as bigint) as ead_s08_g516_year0,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 515 and "Year_FWOA" = 10 then "EAD_50" else 0 end)) as bigint) as ead_s08_g516_year10,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 515 and "Year_FWOA" = 20 then "EAD_50" else 0 end)) as bigint) as ead_s08_g516_year20,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 516 and "Year_FWOA" = 30 then "EAD_50" else 0 end)) as bigint) as ead_s08_g516_year30,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 516 and "Year_FWOA" = 40 then "EAD_50" else 0 end)) as bigint) as ead_s08_g516_year40,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 516 and "Year_FWOA" = 50 then "EAD_50" else 0 end)) as bigint) as ead_s08_g516_year50,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 1 then "EASD_50" else 0 end)) as bigint) as easd_s07_g500_year0,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 10 then "EASD_50" else 0 end)) as bigint) as easd_s07_g500_year10,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 20 then "EASD_50" else 0 end)) as bigint) as easd_s07_g500_year20,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 30 then "EASD_50" else 0 end)) as bigint) as easd_s07_g500_year30,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 40 then "EASD_50" else 0 end)) as bigint) as easd_s07_g500_year40,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 50 then "EASD_50" else 0 end)) as bigint) as easd_s07_g500_year50,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 1 then "EASD_50" else 0 end)) as bigint) as easd_s08_g500_year0,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 500 and "Year_FWOA" = 10 then "EASD_50" else 0 end)) as bigint) as easd_s08_g500_year10,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 500 and "Year_FWOA" = 20 then "EASD_50" else 0 end)) as bigint) as easd_s08_g500_year20,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 500 and "Year_FWOA" = 30 then "EASD_50" else 0 end)) as bigint) as easd_s08_g500_year30,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 500 and "Year_FWOA" = 40 then "EASD_50" else 0 end)) as bigint) as easd_s08_g500_year40,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 500 and "Year_FWOA" = 50 then "EASD_50" else 0 end)) as bigint) as easd_s08_g500_year50,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 1 then "EASD_50" else 0 end)) as bigint) as easd_s07_g516_year0,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 515 and "Year_FWOA" = 10 then "EASD_50" else 0 end)) as bigint) as easd_s07_g516_year10,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 515 and "Year_FWOA" = 20 then "EASD_50" else 0 end)) as bigint) as easd_s07_g516_year20,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 516 and "Year_FWOA" = 30 then "EASD_50" else 0 end)) as bigint) as easd_s07_g516_year30,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 516 and "Year_FWOA" = 40 then "EASD_50" else 0 end)) as bigint) as easd_s07_g516_year40,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 516 and "Year_FWOA" = 50 then "EASD_50" else 0 end)) as bigint) as easd_s07_g516_year50,
	cast(round(sum(case when "Scenario" = 7 and "ModelGroup" = 500 and "Year_FWOA" = 1 then "EASD_50" else 0 end)) as bigint) as easd_s08_g516_year0,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 515 and "Year_FWOA" = 10 then "EASD_50" else 0 end)) as bigint) as easd_s08_g516_year10,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 515 and "Year_FWOA" = 20 then "EASD_50" else 0 end)) as bigint) as easd_s08_g516_year20,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 516 and "Year_FWOA" = 30 then "EASD_50" else 0 end)) as bigint) as easd_s08_g516_year30,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 516 and "Year_FWOA" = 40 then "EASD_50" else 0 end)) as bigint) as easd_s08_g516_year40,
	cast(round(sum(case when "Scenario" = 8 and "ModelGroup" = 516 and "Year_FWOA" = 50 then "EASD_50" else 0 end)) as bigint) as easd_s08_g516_year50
from clara.risk
where "FragilityScenario" = 1
	and "PumpingID" = 0.5
group by "CommunityID"
SQL

ogr2ogr -t_srs "EPSG:4326" -sql "$damage_sql" \
    $WORKING/damage.gpkg \
		PG:"dbname='$PG_DB' host='$PG_HOST' user='$PG_USER' password='$PG_PASSWORD'" \
		-nln "damage"

ogr2ogr -append -t_srs "EPSG:4326" \
    $WORKING/damage.gpkg \
		$DATA/Community_Splits_20220823.gdb \
		-nln "community" \
		"MP2023_Communities_CLARA_split_20220823_FINAL_ID"

ogr2ogr -append -t_srs "EPSG:4326" \
    $WORKING/damage.gpkg \
		/vsizip/$DATA/MississippiRiver_mask_for_mapping.zip/MississippiRiver_mask_for_mapping/MississippiRiver_mask_for_mapping.shp \
		-nln "mask"

ogr2ogr -append \
		$WORKING/damage.gpkg \
		$DATA/community_splits_names.csv \
		-nln "community_name"

read -r -d '' combined_sql << SQL
select damage.*,
	community_name.display_name,
	st_difference(st_union(community.SHAPE), mask_dissolve.geom) as geom
from damage
join community
	on damage.community_id = community.MP_Community_ID
join community_name
	on damage.community_id = community_name.community_id
join (
	select st_collect(geom) as geom
	from mask
	group by true
) as mask_dissolve
	on true
group by damage.community_id
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$combined_sql" \
	$WORKING/damage.geojson \
	-nln damage \
	$WORKING/damage.gpkg

read -r -d '' damage_point_sql << SQL
select community_id,
	ead_s07_g500_year0,
	ead_s07_g500_year10,
	ead_s07_g500_year20,
	ead_s07_g500_year30,
	ead_s07_g500_year40,
	ead_s07_g500_year50,
	ead_s08_g500_year0,
	ead_s08_g500_year10,
	ead_s08_g500_year20,
	ead_s08_g500_year30,
	ead_s08_g500_year40,
	ead_s08_g500_year50,
	ead_s07_g516_year0,
	ead_s07_g516_year10,
	ead_s07_g516_year20,
	ead_s07_g516_year30,
	ead_s07_g516_year40,
	ead_s07_g516_year50,
	ead_s08_g516_year0,
	ead_s08_g516_year10,
	ead_s08_g516_year20,
	ead_s08_g516_year30,
	ead_s08_g516_year40,
	ead_s08_g516_year50,
	easd_s07_g500_year0,
	easd_s07_g500_year10,
	easd_s07_g500_year20,
	easd_s07_g500_year30,
	easd_s07_g500_year40,
	easd_s07_g500_year50,
	easd_s08_g500_year0,
	easd_s08_g500_year10,
	easd_s08_g500_year20,
	easd_s08_g500_year30,
	easd_s08_g500_year40,
	easd_s08_g500_year50,
	easd_s07_g516_year0,
	easd_s07_g516_year10,
	easd_s07_g516_year20,
	easd_s07_g516_year30,
	easd_s07_g516_year40,
	easd_s07_g516_year50,
	easd_s08_g516_year0,
	easd_s08_g516_year10,
	easd_s08_g516_year20,
	easd_s08_g516_year30,
	easd_s08_g516_year40,
	easd_s08_g516_year50,
	display_name,
	st_pointonsurface(geometry) as geom
from damage
SQL

ogr2ogr -t_srs "EPSG:4326" -dialect sqlite -sql "$damage_point_sql" \
	$WORKING/damage_point.geojson \
	-nln damage_point \
	$WORKING/damage.geojson

# Generate vector tiles.
echo "Generating vector tiles..."
tippecanoe -zg -o $TILES/damage-vector.mbtiles \
    --force \
    --coalesce-densest-as-needed \
    --extend-zooms-if-still-dropping \
    --base-zoom=7 \
    -n "Damage: Vector" \
    $WORKING/damage.geojson \
		$WORKING/damage_point.geojson
