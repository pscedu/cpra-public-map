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

export const fireEvent = (name, detail) => {
  const event = new CustomEvent(name, { detail });
  window.dispatchEvent(event);
};

export const getProjectResult = (project) => {
  return {
    type: "project",
    name: project.name,
    category: "Project",
    haystack: normalizeText(project.name),
    bounds: [project.xmin, project.ymin, project.xmax, project.ymax].map(
      parseFloat
    ),
    selection: {
      project: project.name,
    },
  };
};

export const getProjectTypeResult = (typeKey, projectTypes) => {
  return {
    type: "project-type",
    name: projectTypes[typeKey],
    category: "Project Type",
    haystack: normalizeText(projectTypes[typeKey]),
    selection: {
      projectType: typeKey,
    },
  };
};

export const getRegionResult = (region) => {
  return {
    type: "region",
    name: region,
    category: "Region",
    haystack: normalizeText(region),
    selection: { region },
  };
};

window.dataLayer = window.dataLayer || [];
export const internal = window.location.hostname.search("mpdv") === -1;
export function gtag() {
  if (internal) console.log("gtag", arguments);
  window.dataLayer.push(arguments);
}

export const normalizeText = (text) =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, "");

export const mapToImage = (style, bounds, width, height, scaleFactor) => {
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

    map.on("load", () => {
      resolve(map.getCanvas().toDataURL());
      map.remove();
      document.body.removeChild(container);
    });
  });
};
