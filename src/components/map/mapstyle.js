import bboxPolygon from "@turf/bbox-polygon";
import difference from "@turf/difference";
import { feature, featureCollection } from "@turf/helpers";
import * as config from "../../helpers/config";

function linearZoom(min, max) {
  return ["interpolate", ["linear"], ["zoom"], 6, min, 12, max];
}

function getLayerName(layer, scenario, group, year, subtype) {
  let name = `${layer.name} - ${scenario} - ${group} - Year ${
    layer != "Historical Land Change" ? Math.floor(year / 10) * 10 : year
  }`;
  if (subtype) name += ` - ${layer.subtypeName} ${subtype}`;
  return name;
}

function politicalBoundaryLayers(politicalBoundary) {
  if (!politicalBoundary) return [];
  let prefix = politicalBoundary == "parish" ? "" : "District ";
  return [
    {
      id: "political-boundary-line",
      type: "line",
      source: "Base Map: Vector",
      "source-layer": `${politicalBoundary}_line`,
      paint: {
        "line-color": "#444444",
        "line-dasharray": [2, 1],
        "line-width": 2,
      },
    },
    {
      id: "political-boundary-label",
      type: "symbol",
      source: "Base Map: Vector",
      "source-layer": `${politicalBoundary}_label`,
      layout: {
        "text-field": ["concat", prefix, ["get", "text"]],
        "text-size": 15,
        "text-font": ["Franklin Gothic Demi Regular"],
      },
      paint: {
        "text-color": "#444444",
        "text-halo-blur": 1,
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
      },
    },
  ];
}

function projectLayers(show, filter, model, suffix = "") {
  if (!show) return [];
  const mod = (yesModel, noModel) => (model ? yesModel : noModel);
  const modelStrokeColor = linearZoom(
    "rgba(0, 0, 0, 0.1)",
    "rgba(0, 0, 0, 0.25)"
  );
  const modelStrokeWidth = linearZoom(1, 2);
  const modelFillColor = linearZoom(
    "rgba(0, 0, 0, 0.07)",
    "rgba(0, 0, 0, 0.15)"
  );
  return [
    // Landbridge polygon
    {
      id: `project-polygon-lb${suffix}`,
      type: "fill",
      source: "Base Map: Vector",
      "source-layer": "project_polygon",
      filter: ["all", ["==", ["get", "type"], "LB"], filter],
      paint: {
        "fill-color": mod(modelFillColor, "#5C913A"),
      },
    },
    {
      id: `project-polygon-lb-outline${suffix}`,
      type: "line",
      source: "Base Map: Vector",
      "source-layer": "project_polygon",
      filter: ["all", ["==", ["get", "type"], "LB"], filter],
      paint: { "line-color": modelStrokeColor, "line-width": modelStrokeWidth },
      layout: { visibility: mod("visible", "none") },
    },
    // Marsh creation polygon
    {
      id: `project-polygon-mc${suffix}`,
      type: "fill",
      source: "Base Map: Vector",
      "source-layer": "project_polygon",
      filter: ["all", ["==", ["get", "type"], "MC"], filter],
      paint: mod(
        { "fill-color": modelFillColor },
        { "fill-pattern": "green-dots" }
      ),
    },
    {
      id: `project-polygon-mc-outline${suffix}`,
      type: "line",
      source: "Base Map: Vector",
      "source-layer": "project_polygon",
      filter: ["all", ["==", ["get", "type"], "MC"], filter],
      paint: { "line-color": modelStrokeColor, "line-width": modelStrokeWidth },
      layout: { visibility: mod("visible", "none") },
    },
    // Bank stabilization and structural risk reduction lines
    {
      id: `project-line-bs-or-sr${suffix}`,
      type: "line",
      source: "Base Map: Vector",
      "source-layer": "project_line",
      filter: [
        "all",
        ["in", ["get", "type"], ["literal", ["BS", "OR", "SR"]]],
        filter,
      ],
      paint: {
        "line-color": mod(modelStrokeColor, [
          "case",
          ["==", ["get", "type"], "BS"],
          "#D9A73B",
          ["==", ["get", "type"], "OR"],
          "#EDA482",
          "#404042",
        ]),
        "line-width": mod(modelStrokeWidth, linearZoom(2, 5)),
      },
    },
    // Diversion and hydrologic restoration lines
    {
      id: `project-line-di-hr${suffix}`,
      type: "line",
      source: "Base Map: Vector",
      "source-layer": "project_line",
      filter: [
        "all",
        ["in", ["get", "type"], ["literal", ["DI", "HR"]]],
        filter,
      ],
      paint: {
        "line-color": mod(modelStrokeColor, [
          "case",
          ["==", ["get", "type"], "DI"],
          "#ED6731",
          "#1DBEF0",
        ]),
        "line-dasharray": [2, 1],
        "line-width": mod(modelStrokeWidth, linearZoom(2, 6.75)),
      },
    },
    // Ridge restoration line
    {
      id: `project-line-rr${suffix}`,
      type: "line",
      source: "Base Map: Vector",
      "source-layer": "project_line",
      filter: ["all", ["==", ["get", "type"], "RR"], filter],
      paint: {
        "line-color": mod(modelStrokeColor, "#1C4E7F"),
        "line-width": mod(modelStrokeWidth, linearZoom(1.5, 2.5)),
      },
    },
    // Shoreline protection line
    {
      id: `project-line-sp${suffix}`,
      type: "line",
      source: "Base Map: Vector",
      "source-layer": "project_line",
      filter: ["all", ["==", ["get", "type"], "SP"], filter],
      paint: {
        "line-color": mod(modelStrokeColor, "#19A598"),
        "line-width": mod(modelStrokeWidth, linearZoom(3, 4.5)),
      },
    },
    // Diversion and hydrologic restoration points
    {
      id: `project-point-di-hr${suffix}`,
      type: "circle",
      source: "Base Map: Vector",
      "source-layer": "project_point",
      filter: [
        "all",
        ["in", ["get", "type"], ["literal", ["DI", "HR"]]],
        filter,
      ],
      paint: {
        "circle-color": mod(modelFillColor, "#FFFFFF"),
        "circle-radius": mod(linearZoom(1, 3), linearZoom(2, 5)),
        "circle-stroke-color": mod(modelStrokeColor, [
          "case",
          ["==", ["get", "type"], "DI"],
          "#ED6731",
          "#1DBEF0",
        ]),
        "circle-stroke-width": mod(modelStrokeWidth, linearZoom(1.5, 4)),
      },
    },
    // Structural risk reduction point
    {
      id: `project-point-sr${suffix}`,
      type: "symbol",
      source: "Base Map: Vector",
      "source-layer": "project_point",
      filter: ["all", ["==", ["get", "type"], "SR"], filter],
      paint: {
        "icon-opacity": mod(linearZoom(0.1, 0.3), 1),
      },
      layout: {
        "icon-allow-overlap": true,
        "icon-image": "square",
        "icon-size": linearZoom(0.1, 1),
      },
    },
    // Project labels
    {
      id: `project-label${suffix}`,
      type: "symbol",
      source: "Base Map: Vector",
      "source-layer": "project_label",
      filter,
      minzoom: 9,
      layout: {
        "text-anchor": "top",
        "text-field": ["get", "name"],
        "text-offset": ["literal", [0, 1.5]],
        "text-size": 14,
        "text-font": ["literal", ["Franklin Gothic Demi Regular"]],
      },
      paint: {
        "text-color": "#444444",
        "text-halo-blur": 1,
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
      },
    },
    {
      id: `project-icon${suffix}`,
      type: "symbol",
      source: "Base Map: Vector",
      "source-layer": "project_label",
      filter,
      minzoom: 8,
      layout: {
        "icon-image": ["get", "type"],
        "icon-size": linearZoom(0.5, 2.5),
      },
    },
  ];
}

function rasterTileUrl(serviceUrl, prefix) {
  let sub = `//${prefix}.`;
  return `${serviceUrl.replace("//", sub)}/tiles/{z}/{x}/{y}.png`;
}

export function getStyle(state) {
  const {
    group,
    politicalBoundary,
    scenario,
    selection,
    services,
    showProjects,
    subtype,
    view,
    year,
  } = state;
  if (services.value === null) return { version: 8, sources: {}, layers: [] };

  const loc = document.location;

  // Prepare sources.
  const sources = {};
  for (let service of Object.values(services.value)) {
    let source;
    if (service.imageType == "pbf") {
      source = {
        type: "vector",
        url: service.url,
      };
    } else {
      source = {
        bounds: [
          -94.00080091962352, 28.70426878930118, -87.51148588666453,
          31.048795426051505,
        ],
        maxzoom: 13,
        type: "raster",
        tiles: [
          rasterTileUrl(service.url, "a"),
          rasterTileUrl(service.url, "b"),
          rasterTileUrl(service.url, "c"),
          rasterTileUrl(service.url, "d"),
        ],
        tileSize: 256,
      };
    }
    if (source.type == "raster") {
      source.tileSize = 256;
    }
    sources[service.name] = source;
  }

  let searchFeatures = [bboxPolygon(config.maxBounds)];
  if (selection.value.polygon)
    searchFeatures = [
      difference(searchFeatures[0], selection.value.polygon),
      feature(selection.value.polygon, { type: "search" }),
    ];
  searchFeatures[0].properties = { type: "screen" };

  sources["search"] = {
    type: "geojson",
    data: featureCollection(searchFeatures),
  };

  // Prepare model layers.
  let prevLayerName = null;
  // mapState.prevYear !== null
  //   ? getLayerName(
  //       layer,
  //       mapState.scenario,
  //       mapState.group,
  //       mapState.prevYear,
  //       mapState.subtype
  //     )
  //   : null;
  let layerName = getLayerName(
    view.value.layer,
    scenario.value,
    group.value,
    year.value,
    subtype.value
  );
  const modelLayers = Object.values(services.value)
    .filter(
      (service) =>
        !(
          service.name.startsWith("Base Map") ||
          service.name.startsWith("Damage")
        )
    )
    .map((service) => {
      return {
        id: service.name,
        type: "raster",
        source: service.name,
        paint: {
          "raster-fade-duration": 0,
          "raster-opacity":
            service.name ===
            (prevLayerName !== null ? prevLayerName : layerName)
              ? 1
              : 0,
        },
        layout: {
          visibility:
            service.name === layerName || service.name === prevLayerName
              ? "visible"
              : "none",
        },
      };
    });

  const damageLayers = [];
  if (view.value.layer.name === "Damage") {
    let damageProp =
      `${subtype.value.toLowerCase()}_` +
      `${scenario.value.toLowerCase()}_${group.value.toLowerCase()}_` +
      `year${year.value}`;
    damageLayers.push({
      id: `damage-polygon`,
      type: "fill",
      source: "Damage: Vector",
      "source-layer": "damage",
      paint: {
        "fill-color": [
          "step",
          ["get", damageProp],
          "#4E7872",
          1000000,
          "#3D9E8B",
          10000000,
          "#6CB686",
          50000000,
          "#B9D1A5",
          100000000,
          "#CDABC9",
          500000000,
          "#A46093",
          1000000000,
          "#77256D",
        ],
      },
    });
  }

  let selectedProjects = null;
  if (selection.value.project)
    selectedProjects = ["==", ["get", "name"], selection.value.project];
  if (selection.value.projectType)
    selectedProjects = ["==", ["get", "type"], selection.value.projectType];

  const showSearch =
    selection.value.polygon ||
    selection.value.project ||
    selection.value.projectType;

  return {
    version: 8,
    sprite: `${loc.origin}/style/sprite?cache=20220630`,
    glyphs: `${loc.origin}/style/glyphs/{fontstack}/{range}.pbf`,
    sources,
    transition: {
      duration: 0,
      delay: 0,
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#ffffff",
        },
      },
      {
        id: "state",
        type: "fill",
        source: "Base Map: Vector",
        "source-layer": "state",
        paint: {
          "fill-color": "#d6d6d6",
        },
      },
      {
        id: "state-screen",
        type: "fill",
        source: "Base Map: Vector",
        "source-layer": "state",
        filter: ["!=", ["get", "abbr"], "LA"],
        paint: {
          "fill-color": "#ffffff",
          "fill-opacity": 0.4,
        },
      },
      {
        id: "water-not-in-icm",
        type: "fill",
        source: "Base Map: Vector",
        "source-layer": "water",
        paint: {
          "fill-color": "#ffffff",
        },
      },
      {
        id: "base-raster",
        type: "raster",
        source: "Base Map: Raster",
      },
      ...modelLayers,
      ...damageLayers,
      {
        id: "levee",
        type: "line",
        source: "Base Map: Vector",
        "source-layer": "levee",
        paint: {
          "line-color": "#939598",
          "line-opacity": 0.5,
          "line-width": 0.667,
        },
      },
      {
        id: "road-secondary",
        type: "line",
        source: "Base Map: Vector",
        "source-layer": "road",
        filter: ["==", ["get", "type"], "S"],
        paint: {
          "line-color": "#a4a4a4",
          "line-opacity": 0.5,
          "line-width": 1.333,
        },
      },
      {
        id: "road-primary",
        type: "line",
        source: "Base Map: Vector",
        "source-layer": "road",
        filter: ["==", ["get", "type"], "P"],
        paint: {
          "line-color": "#a4a4a4",
          "line-width": 1.333,
        },
      },
      {
        id: "label",
        type: "symbol",
        source: "Base Map: Vector",
        "source-layer": "label",
        filter: politicalBoundary.value
          ? ["==", "water", ["get", "type"]]
          : true,
        layout: {
          "text-field": ["get", "text"],
          "text-size": ["case", ["==", "community", ["get", "type"]], 16, 13],
          "text-font": [
            "case",
            ["==", "community", ["get", "type"]],
            ["literal", ["Franklin Gothic Demi Regular"]],
            ["literal", ["Franklin Gothic Book Regular"]],
          ],
        },
        paint: {
          "text-color": "#444444",
        },
      },
      ...projectLayers(
        view.value.layer.name == "Projects" ||
          (group.value !== "G500" && showProjects.value === "true"),
        true,
        view.value.layer.name !== "Projects"
      ),
      {
        id: "search-screen",
        source: "search",
        type: "fill",
        filter: ["==", "screen", ["get", "type"]],
        paint: {
          "fill-color": "#ffffff",
          "fill-opacity": 0.7,
        },
        layout: {
          visibility: showSearch ? "visible" : "none",
        },
      },
      {
        id: "search",
        source: "search",
        type: "line",
        filter: ["==", "search", ["get", "type"]],
        paint: {
          "line-color": "#000000",
          "line-dasharray": [1, 1],
          "line-width": 2,
        },
        layout: {
          visibility: showSearch ? "visible" : "none",
        },
      },
      ...projectLayers(selectedProjects, selectedProjects, false, "-selected"),
      ...politicalBoundaryLayers(politicalBoundary.value),
    ],
  };
}
