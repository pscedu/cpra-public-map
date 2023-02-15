#!/bin/bash

singularity exec \
    --bind "$LOCAL:$LOCAL" \
    --bind "$RAMDISK:$RAMDISK" \
    docker://osgeo/gdal:ubuntu-small-latest \
    "$@"
