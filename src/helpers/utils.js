import SphericalMercator from "@mapbox/sphericalmercator";

export const bufferPoint = (xDeg, yDeg, radius, segments = 32) => {
  const sm = new SphericalMercator();
  const [x, y] = sm.forward([xDeg, yDeg]);
  const ring = [];
  for (let i = 0; i <= segments; i++) {
    let angle = (2 * Math.PI * i) / segments;
    ring.push(
      sm.inverse([radius * Math.cos(angle) + x, radius * Math.sin(angle) + y])
    );
  }
  return { type: "Polygon", coordinates: [ring] };
};

export function getLocalResults(text, fuse, limit = 5) {
  let res = fuse
    ? fuse.search(text, { limit }).map((result) => result.item)
    : [];
  return res;
}

export function getOsmResults(json, excludedCategories) {
  return json
    .filter(
      (result) =>
        excludedCategories.indexOf(result.category) === -1 &&
        // Eliminate duplicate parish results.
        !(
          result.category === "boundary" &&
          result.type === "administrative" &&
          result.address.county &&
          result.display_name.match(/,/g).length === 1
        )
    )
    .map((result) => {
      return {
        type: "osm",
        name: "",
        category: result.display_name,
        details: result,
      };
    });
}

export function getOsmSelection(details) {
  const polygon =
    details.category == "boundary"
      ? details.geojson
      : bufferPoint(parseFloat(details.lon), parseFloat(details.lat), 1609);
  return { polygon };
}

export function getMapPadding() {
  const slides = document.getElementById("slides");
  return {
    top: 50,
    right: 50,
    bottom:
      slides && window.innerWidth >= 700
        ? window.innerHeight - slides.offsetTop + 50
        : 50,
    left: 50,
  };
}

// Tab-delimited CSV parsing
export async function fetchCSV(url) {
  const res = await fetch(url);
  const rows = (await res.text())
    .split("\n")
    .filter((row) => row.length)
    .map((row) =>
      row.split("\t").map((cell) => cell.replace(/(^")|("$)/g, ""))
    );
  const headers = rows.shift();
  return rows.map((row) => {
    const obj = {};
    for (let i in headers) obj[headers[i]] = row[i];
    return obj;
  });
}

// Analytics
window.dataLayer = window.dataLayer || [];
export const internal = window.location.hostname.search("mpdv") === -1;
export function gtag() {
  if (internal) console.log("gtag", arguments);
  window.dataLayer.push(arguments);
}
