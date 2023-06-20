#!/bin/bash

# Use the local disk as the working directory.
WORKING="$LOCAL"

# Dedicate 75% of the availabe RAM to cache.
export GDAL_CACHEMAX="1500"

# Tell GDAL to use a single thread.
export GDAL_NUM_THREADS="1"

# CLARA color map
cat > $WORKING/CLARA.clr << EOF
-9999.999 0 0 0 0
0.999 0 0 0 0
1.000 114 141 151
3.999 114 141 151
4.000 115 183 234
6.999 115 183 234
7.000 153 217 167
9.999 153 217 167
10.000 248 216 139
12.999 248 216 139
13.000 233 176 35
15.999 233 176 35
16.000 229 101 36
20.999 229 101 36
21.000 183 56 101
9999.999 183 56 101
EOF

# FFIBS color map
cat > $WORKING/FFIBS.clr << EOF
-9999.999 0 0 0 0
-0.001 0 0 0 0
0.000 94 130 58
0.199 94 130 58
0.200 218 232 109
1.999 218 232 109
2.000 146 203 232
4.999 146 203 232
5.000 115 87 83
16.999 115 87 83
17.000 6 121 210
198.999 6 121 210
199.000 255 255 255
9999.999 255 255 255
EOF

# Land change color map
cat > $WORKING/lndchg.clr << EOF
55 0 0 0 0
52 69 145 172
51 0 0 0 0
44 0 0 0 0
33 0 0 0 0
32 69 145 172
31 0 0 0 0
23 38 81 24
22 0 0 0 0
21 38 81 24
13 0 0 0 0
12 69 145 172
11 0 0 0 0
0 0 0 0 0
EOF

# Land type diff color map
cat > $WORKING/lndtypdiff.clr << EOF
-9999 0 0 0 0
111 0 0 0 0
112 0 240 240
113 0 0 0 0
121 153 193 4
122 69 145 172
123 153 193 4
131 0 0 0 0
132 0 240 240
133 0 0 0 0
211 38 81 24
212 0 240 240
213 38 81 24
221 38 81 24
222 0 0 0 0
223 38 81 24
231 38 81 24
232 0 240 240
233 38 81 24
311 0 0 0 0
312 0 240 240
313 0 0 0 0
321 153 193 4
322 69 145 172
323 153 193 4
331 0 0 0 0
332 0 240 240
333 0 0 0 0
444 0 0 0 0
511 0 0 0 0
512 0 240 240
513 0 0 0 0
515 0 0 0 0
521 153 193 4
522 69 145 172
523 153 193 4
525 153 193 4
531 0 0 0 0
532 0 240 240
533 0 0 0 0
535 0 0 0 0
551 0 0 0 0
552 0 240 240
553 0 0 0 0
555 0 0 0 0
EOF

# VCT color map
cat > $WORKING/VCT.clr << EOF
-9999 0 0 0 0
0 0 0 0 0
1 166 206 207
2 31 120 180
3 178 223 138
4 91 160 44
5 251 154 153
6 227 26 28
7 253 191 111
8 255 127 0
9 202 178 214
10 106 61 154
11 255 255 153
12 0 90 0
13 255 128 255
14 255 255 255
200 255 255 255
300 127 95 30
400 0 0 0 0
500 140 240 240
9999 255 255 255
EOF

get_data_type() {
    [[ "lndchg lndtypdiff VCT" =~ (^|[[:space:]])$1($|[[:space:]]) ]] \
        && echo "Int16" || echo "Float32"
}

in_path="$1"
out_path="$2"
cog_path="$3"
mask_path="$4"
raster_type="$5"
in_name=$(basename "$in_path")
out_name=$(basename "$out_path")
raster_name="${in_name%.tif}"
color_path="$WORKING/$raster_type.clr"
data_type=$(get_data_type "$raster_type")
working_masked_path="$WORKING/${raster_name}_masked.tif"
working_cog_path="$WORKING/${raster_name}_cog.tif"
working_tif_path="$WORKING/$raster_name.tif"
working_tiles_path="$WORKING/$out_name"

# Apply the mask layer.
gdal_calc.py --calc="numpy.where(B==1, A, -9998)" \
    --extent="intersect" --co="COMPRESS=LZW" \
    --outfile="$working_masked_path" \
    --type="$data_type" \
    -A "$in_path" \
    -B "$mask_path"

# Set the nodata value.
gdal_edit.py -a_nodata -9999 -stats $working_masked_path

# Create the COG.
gdal_translate $working_masked_path $working_cog_path -of COG -co "RESAMPLING=NEAREST"

# Copy the COG to the output directory and remove it from the working directory.
cp $working_cog_path $cog_path
rm $working_cog_path

# Colorize the raster.
gdaldem color-relief -alpha $working_masked_path $color_path $working_tif_path \
    -of GTiff -co "COMPRESS=LZW"

# Set the coordinate system.
gdal_edit.py -a_srs "EPSG:26915" $working_tif_path

# Tile the highest zoom level.
gdal_translate $working_tif_path $working_tiles_path \
    -of MBTILES -co ZOOM_LEVEL_STRATEGY=UPPER \
    -co NAME="$raster_name"

# Remove the working TIF file.
rm $working_tif_path

# Add lower zoom levels.
gdaladdo $working_tiles_path -r nearest

# Copy the tiles to the output directory.
cp $working_tiles_path $out_path
