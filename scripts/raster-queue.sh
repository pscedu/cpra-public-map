#!/bin/bash

raster_names=$(cat "$1")
base_path="$PROJECT/raster-root"
tiles_path="$PROJECT/tiles-new"
cog_path="$PROJECT/cog"
scripts_dir=$(realpath "$(dirname "$0")")

match() {
    for value in "${@:2}"; do
        if [[ "$1" == *"$value"* ]]; then
            echo "$value"
        fi
    done
}

while IFS= read -r raster_name; do
    raster_type=$(match "$raster_name" "CLARA" "FFIBS" "lndchg" "lndtypdiff" "VCT")
    mask_path="$PROJECT/data/mask-$raster_type.tif"

    if [ "$raster_type" == "CLARA" ]; then
        in_path="$base_path/CLARA/outputs/tif/$raster_name"
    else
        scenario=$(match "$raster_name" "S07" "S08")
        group=$([[ "$raster_name" =~ G[0-9]{3} ]] && echo $BASH_REMATCH)
        in_path="$base_path/ICM/$scenario/$group/geomorph/output/tif/$raster_name"
    fi

    out_path="$tiles_path/${raster_name%.tif}.mbtiles"

    if [ -f "$in_path" ]; then
        if [ -f "$out_path" ]; then
            echo "Skipping $raster_name..."
        else
            echo "Scheduling $raster_name..."
            sbatch -N 1 -p RM-shared -t 00:10:00 --ntasks-per-node=1 \
                "$scripts_dir/gdal-singularity.sh" \
                "$scripts_dir/raster-convert.sh" \
                "$in_path" "$out_path" \
                "$cog_path/$raster_name" "$mask_path" "$raster_type"
        fi
     else
        echo "Missing $raster_name..."
    fi
done <<< "$raster_names"
