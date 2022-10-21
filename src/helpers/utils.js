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

export const selectValue = (values, currentValue) => {
  values = values || [];
  if (values.includes(currentValue)) return currentValue;
  return values.length ? values[0] : null;
};

export const normalizeText = (text) =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, "");

const drawLogo = (canvas, dpi, logoImage, margin = 0.5) => {
  const ctx = canvas.getContext("2d");
  const targetWidth = dpi * 0.5;
  const targetHeight = (logoImage.height * targetWidth) / logoImage.width;
  ctx.drawImage(
    logoImage,
    canvas.width - dpi * margin - targetWidth,
    canvas.height - dpi * margin - targetHeight,
    targetWidth,
    targetHeight
  );
};

const drawText = ({
  ctx,
  text,
  fontFamily,
  fontSize,
  fontWeight,
  color,
  x,
  y,
}) => {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};

const drawTitles = (glCanvas, dpi, titles, margin = 0.5) => {
  const canvas = document.createElement("canvas");
  canvas.height = glCanvas.height;
  canvas.width = glCanvas.width;

  const ctx = canvas.getContext("2d");
  const options = {
    color: "#005371",
    ctx,
    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
    x: margin * dpi,
  };

  // Copy map image to 2D canvas.
  ctx.drawImage(glCanvas, 0, 0);

  const lines = [];
  for (let title of titles.primary)
    lines.push({
      ...options,
      fontSize: (18 * dpi) / 72,
      fontWeight: "bold",
      lineHeight: 1.1,
      text: title.toUpperCase(),
    });

  for (let title of titles.secondary)
    lines.push({
      ...options,
      fontSize: (12 * dpi) / 72,
      fontWeight: "normal",
      lineHeight: 1.1,
      text: title.toUpperCase(),
    });

  lines.reverse();
  let y = canvas.height - dpi * margin;
  lines.forEach((line, i) => {
    if (i > 0) y -= line.fontSize * line.lineHeight;
    drawText({ ...line, y });
  });

  return canvas;
};

const loadImage = (url) => {
  const img = new Image();
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
    img.src = url;
  });
};

const loadPrintMap = (style, bounds, width, height) => {
  return new Promise((resolve) => {
    let container = document.createElement("div");
    container.style.height = `${height}px`;
    container.style.left = "-9999px";
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.width = `${width}px`;
    document.body.appendChild(container);

    // eslint-disable-next-line no-undef
    let map = new maplibregl.Map({
      bounds,
      container,
      fadeDuration: 0,
      interactive: false,
      preserveDrawingBuffer: true,
      style,
    });

    map.on("load", () => resolve(map));
  });
};

export const mapToImage = async ({
  style,
  bounds,
  dpi,
  width,
  height,
  scaleFactor,
  titles,
}) => {
  style.layers.forEach((layer) => {
    if (layer.type === "raster") {
      layer.paint = layer.paint || {};
      layer.paint["raster-fade-duration"] = 0;
    }
    for (let category of ["layout", "paint"]) {
      if (!layer[category]) continue;
      for (let propName in layer[category]) {
        let value = layer[category][propName];
        if (
          propName.endsWith("-radius") ||
          propName.endsWith("-size") ||
          propName.endsWith("-width")
        ) {
          if (value[0] == "interpolate") {
            layer[category][propName][4] = value[4] * scaleFactor;
            layer[category][propName][6] = value[4] * scaleFactor;
          } else {
            layer[category][propName] = ["*", value, scaleFactor];
          }
        }
      }
    }
  });

  const [map, logoImage] = await Promise.all([
    loadPrintMap(style, bounds, width, height),
    loadImage("/assets/images/logo.png"),
  ]);
  const canvas = drawTitles(map.getCanvas(), dpi, titles);
  drawLogo(canvas, dpi, logoImage);
  const dataUrl = canvas.toDataURL();
  const container = map.getContainer();
  map.remove();
  document.body.removeChild(container);
  return dataUrl;
};

export function getLocalResults(text, searchIndex) {
  let needles = normalizeText(text)
    .split(" ")
    .filter((part) => part.length);

  return searchIndex.filter((entry) => {
    if (needles.length == 0) return false;
    for (let needle of needles)
      if (entry.haystack.indexOf(needle) === -1) return false;
    return true;
  });
}

export function getOsmResults(json, excludedCategories) {
  return json
    .filter((result) => excludedCategories.indexOf(result.category) === -1)
    .map((result) => {
      const addr = result.address;
      let primary = addr[result.category];
      let secondary =
        addr.neighbourhood || addr.town || addr.city || addr.county || null;
      if (!primary)
        primary = [addr.house_number, addr.road]
          .filter((part) => part !== undefined)
          .join(" ");

      if (primary == "") {
        primary = secondary;
        secondary = null;
      }
      return {
        type: "osm",
        name: primary,
        category: secondary,
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
    bottom: slides ? window.innerHeight - slides.offsetTop + 50 : 50,
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
      row
        .split("\t")
        .map((cell) =>
          /^[-0-9]/.test(cell)
            ? parseFloat(cell)
            : cell.replace(/(^")|("$)/g, "")
        )
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
