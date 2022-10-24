#!/bin/bash

DATA="./data"
TILES="./tiles"
WORKING="./working"

export GDAL_CACHEMAX="80%"
export GDAL_NUM_THREADS="ALL_CPUS"

mkdir -p "$WORKING"
mkdir -p "$TILES"

# Convert vector layers to GeoJSON.
read -r -d '' damage_sql << SQL
select community_id,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g500_year0,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g500_year10,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g500_year20,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g500_year30,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g500_year40,
	cast(round(sum(case when year = 50 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g500_year50,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g500_year0,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g500_year10,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g500_year20,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g500_year30,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g500_year40,
	cast(round(sum(case when year = 50 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g500_year50,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g603_year0,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g603_year10,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g603_year20,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g603_year30,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g603_year40,
	cast(round(sum(case when year = 50 then p50_EAD_ST else 0 end)) as integer) as ead_s07_g603_year50,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g603_year0,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g603_year10,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g603_year20,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g603_year30,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g603_year40,
	cast(round(sum(case when year = 50 then p50_EAD_ST else 0 end)) as integer) as ead_s08_g603_year50,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g500_year0,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g500_year10,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g500_year20,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g500_year30,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g500_year40,
	cast(round(sum(case when year = 50 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g500_year50,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g500_year0,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g500_year10,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g500_year20,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g500_year30,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g500_year40,
	cast(round(sum(case when year = 50 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g500_year50,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g603_year0,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g603_year10,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g603_year20,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g603_year30,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g603_year40,
	cast(round(sum(case when year = 50 then p50_EAD_ST else 0 end)) as integer) as easd_s07_g603_year50,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g603_year0,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g603_year10,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g603_year20,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g603_year30,
	cast(round(sum(case when year = 1 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g603_year40,
	cast(round(sum(case when year = 50 then p50_EAD_ST else 0 end)) as integer) as easd_s08_g603_year50,
	st_difference(st_union(community.geom), mask.geom) as geom
from damage
join community
	on damage.community_id = community.MP_Community_ID
join (
	select st_collect(geom) as geom
	from river_mask
	group by true
) as mask
	on true
group by community_id
SQL
ogr2ogr -t_srs "EPSG:4326" -sql "$damage_sql" \
    $WORKING/damage.geojson $DATA/damage.gpkg

# Generate vector tiles.
echo "Generating vector tiles..."
tippecanoe -zg -o $TILES/damage-vector.mbtiles \
    --force \
    --coalesce-densest-as-needed \
    --extend-zooms-if-still-dropping \
    --base-zoom=7 \
    -n "Damage: Vector" \
    $WORKING/damage.geojson
