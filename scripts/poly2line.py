import json
import sys

def make_feature(coords):
    return {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "LineString",
            "coordinates": coords
        }
    }

def poly2line(in_name, out_name):
    """Convert (multi)polygons to lines, removing overlapping segments."""
    with open(in_name, "r") as in_file:
        in_fc = json.load(in_file)

    out_features = []
    segments = set()
    for in_feature in in_fc["features"]:
        geom = in_feature["geometry"]
        is_single = geom["type"] == "Polygon"
        polygons = [geom["coordinates"]] if is_single else geom["coordinates"]

        for polygon in polygons:
            for ring in polygon:
                coords = []
                prev_point = ring[0]
                for point in (ring[1:] + ring[:2]):
                    seg = tuple(sorted([tuple(point), tuple(prev_point)]))
                    if seg not in segments:
                        if not coords:
                            coords.append(prev_point)
                        coords.append(point)
                        segments.add(seg)
                    elif coords:
                        out_features.append(make_feature(coords))
                        coords = []
                    prev_point = point


    out_fc = {
        "type": "FeatureCollection",
        "features": out_features
    }
    with open(out_name, "w") as out_file:
        json.dump(out_fc, out_file)

if __name__ == "__main__":
    poly2line(sys.argv[1], sys.argv[2])