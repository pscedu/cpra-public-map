#!/bin/bash

raster_names=$(cat "$1")
base_path="$PROJECT/raster-root"
tiles_path="$PROJECT/tiles-new"
cog_path="$PROJECT/cog"
scripts_dir=$(realpath "$(dirname "$0")")

function join_by { local IFS="$1"; shift; echo "$*"; }

while IFS= read -r raster_name; do
    IFS='_' read -r -a name_parts <<< "$raster_name"
    parts_length="${#name_parts[@]}"
    type_index=$([[ "$parts_length" > 12 ]] && echo "10" || echo "11")
    raster_type="${name_parts[$type_index]%.tif}"
    mask_path="$PROJECT/data/mask-$raster_type.tif"

    scenario=${name_parts[1]}
    group=${name_parts[2]}
    uncertainty=${name_parts[4]}
    start_year=${name_parts[8]}
    end_year=${name_parts[9]}

    if [ "$raster_type" == "CLARA" ]; then
        in_path="$base_path/CLARA/outputs/tif/$raster_name"
        start_year=$(($start_year + 2))
        end_year=$(($end_year + 2))
    else
        in_path="$base_path/ICM/$scenario/$group/geomorph/output/tif/$raster_name"
    fi

    out_scenario=$([[ "$scenario" == "S07" ]] && echo "Lower" || echo "Higher")
    out_group=$([[ "$group" =~ G500|G520 ]] && echo "FWOA" || echo "FWMP")
    out_type=$(join_by "_" ${name_parts[@]:$type_index:20})
    out_start_year=$(printf "%02d" $start_year)
    out_end_year=$(printf "%02d" $end_year)

    out_name="MP2023_${out_scenario}_${out_group}_${uncertainty}_${out_start_year}_${out_end_year}_${out_type%.tif}"
    out_path="$tiles_path/$out_name.mbtiles"

    if [ -f "$in_path" ]; then
        if [ -f "$out_path" ]; then
            echo "Skipping $raster_name..."
        else
            echo "Scheduling $raster_name..."
            sbatch -N 1 -p RM-shared -t 00:10:00 --ntasks-per-node=1 \
                "$scripts_dir/gdal-singularity.sh" \
                "$scripts_dir/raster-convert.sh" \
                "$in_path" "$out_path" "$cog_path/$out_name.tif" \
                "$mask_path" "$raster_type"
        fi
     else
        echo "Missing $raster_name..."
    fi
done <<< "$raster_names"
