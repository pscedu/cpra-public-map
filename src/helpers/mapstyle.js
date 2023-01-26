import bboxPolygon from "@turf/bbox-polygon";
import difference from "@turf/difference";
import { feature, featureCollection } from "@turf/helpers";
import * as config from "./config";

function damageStepExpression(divisor, maxLength, suffix) {
  return [
    "concat",
    [
      "number-format",
      ["/", ["var", "rounded"], divisor],
      { "min-fraction-digits": ["-", maxLength, ["var", "digits"]] },
    ],
    suffix,
  ];
}

function linearZoom(min, max) {
  return ["interpolate", ["linear"], ["zoom"], 6, min, 12, max];
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
    // Diversion polygon
    {
      id: `project-polygon-di${suffix}`,
      type: "fill",
      source: "Base Map: Vector",
      "source-layer": "project_polygon",
      filter: ["all", ["==", ["get", "type"], "DI"], filter],
      paint: {
        "fill-color": mod(modelFillColor, "#000000"),
        "fill-opacity": mod(1, 0),
      },
    },
    // Diversion polygon outline
    {
      id: `project-polygon-di-outline${suffix}`,
      type: "line",
      source: "Base Map: Vector",
      "source-layer": "project_polygon",
      filter: ["all", ["==", ["get", "type"], "DI"], filter],
      paint: {
        "line-color": mod(modelStrokeColor, "#ed6731"),
        "line-dasharray": [2, 1],
        "line-width": mod(modelStrokeWidth, linearZoom(1, 3)),
      },
    },
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
    // Bank stabilization lines
    {
      id: `project-line-bs${suffix}`,
      type: "line",
      source: "Base Map: Vector",
      "source-layer": "project_line",
      filter: ["all", ["==", ["get", "type"], "BS"], filter],
      paint: {
        "line-color": mod(modelStrokeColor, "#D9A73B"),
        "line-width": mod(modelStrokeWidth, linearZoom(2, 5)),
      },
    },
    // Structural risk reduction lines
    {
      id: `project-line-sr${suffix}`,
      type: "line",
      source: "Base Map: Vector",
      "source-layer": "project_line",
      filter: ["all", ["==", ["get", "type"], "SR"], filter],
      paint: {
        "line-color": "#404042",
        "line-width": linearZoom(2, 5),
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
        "icon-opacity": 1,
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
      filter: ["all", ["!=", ["get", "type"], "OR"], filter],
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
      filter: ["all", ["!=", ["get", "type"], "OR"], filter],
      minzoom: 10,
      layout: {
        "icon-image": ["get", "type"],
        "icon-size": linearZoom(0.5, 2.5),
      },
    },
    {
      id: `project-icon-dot${suffix}`,
      type: "circle",
      source: "Base Map: Vector",
      "source-layer": "project_label",
      filter: ["all", ["!=", ["get", "type"], "OR"], filter],
      maxzoom: 10,
      minzoom: 8,
      paint: {
        "circle-color": [
          "match",
          ["get", "type"],
          "BH",
          "#a2e5e0",
          "BS",
          "#e7a62c",
          "DI",
          "#ea6833",
          "HR",
          "#30bded",
          "LB",
          "#5c913e",
          "MC",
          "#d3df3a",
          "NS",
          "#64668b",
          "OR",
          "#eca583",
          "RR",
          "#204e7e",
          "SP",
          "#18a899",
          "SR",
          "#414143",
          "#c8c8c8",
        ],
        "circle-radius": linearZoom(2, 12),
        "circle-stroke-color": "#FFFFFF",
        "circle-stroke-width": 1,
      },
    },
  ];
}

function rasterTileUrl(serviceUrl, prefix) {
  let sub = `//${prefix}.`;
  return `${serviceUrl.replace("//", sub)}/tiles/{z}/{x}/{y}.png`;
}

export function getStyle({
  entry,
  prevEntry,
  selection,
  services,
  showProjects,
}) {
  if (!services.value) return { version: 8, sources: {}, layers: [] };

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

  // Selected projects
  const selectionType = Object.keys(selection.value)[0];
  let selectedProjects = null;
  if (selection.value.project)
    selectedProjects = ["==", ["get", "display_id"], selection.value.project];
  if (selection.value["project-type"])
    selectedProjects = [
      "==",
      ["get", "type"],
      selection.value["project-type"].toUpperCase(),
    ];

  // Search geometries
  let searchFeatures = [];
  if (selectedProjects) {
    searchFeatures.push(bboxPolygon(config.maxBounds));
  } else if (selectionType) {
    const polygon =
      selection.value.polygon ||
      bboxPolygon(config.layerExtents[selectionType]);
    searchFeatures.push(difference(bboxPolygon(config.maxBounds), polygon));
    if (selection.value.polygon)
      searchFeatures.push(feature(selection.value.polygon, { type: "search" }));
  }
  if (searchFeatures.length) searchFeatures[0].properties = { type: "screen" };

  sources.search = {
    type: "geojson",
    data: featureCollection(searchFeatures),
  };

  // Prepare search layers.
  const searchLayers = [];
  const searchPaint = {
    "line-color": "#000000",
    "line-dasharray": [1, 1],
    "line-width": 2,
  };
  const searchScreenPaint = {
    "fill-color": "#ffffff",
    "fill-opacity": 0.7,
  };
  if (searchFeatures.length) {
    searchLayers.push({
      id: "search-screen",
      source: "search",
      type: "fill",
      filter: ["==", "screen", ["get", "type"]],
      paint: searchScreenPaint,
    });
    if (config.layerExtents[selectionType])
      searchLayers.push(
        {
          id: "search-outer",
          source: "Base Map: Vector",
          "source-layer": "outer",
          type: "fill",
          filter: ["==", selectionType, ["get", "type"]],
          paint: searchScreenPaint,
        },
        {
          id: "search-inner",
          source: "Base Map: Vector",
          "source-layer": selectionType,
          type: "fill",
          filter: ["!=", selection.value[selectionType], ["get", "id"]],
          paint: searchScreenPaint,
        }
      );
    if (searchFeatures.length > 1) {
      searchLayers.push({
        id: "search",
        source: "search",
        type: "line",
        filter: ["==", "search", ["get", "type"]],
        paint: searchPaint,
      });
    } else if (config.layerExtents[selectionType]) {
      searchLayers.push({
        id: "search",
        source: "Base Map: Vector",
        "source-layer": selectionType,
        type: "line",
        filter: ["==", selection.value[selectionType], ["get", "id"]],
        paint: searchPaint,
      });
    }
  }

  // Prepare model layers.
  let prevEntryUrl = prevEntry && prevEntry.value ? prevEntry.value.url : null;
  let entryUrl = entry && entry.value ? entry.value.url : null;
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
            service.url === (prevEntryUrl !== null ? prevEntryUrl : entryUrl)
              ? 1
              : 0,
        },
        layout: {
          visibility:
            service.url === entryUrl || service.url === prevEntryUrl
              ? "visible"
              : "none",
        },
      };
    });

  const damageLayers = [];
  const damageLabels = [];
  const damageOutlines = [];
  const eadRamp = [
    "#DDC5E0",
    1000000,
    "#CCAAD1",
    10000000,
    "#B282BA",
    50000000,
    "#A064A9",
    100000000,
    "#5D4795",
    500000000,
    "#423575",
    1000000000,
    "#221F53",
  ];
  const easdRamp = [
    "#FEDB9E",
    50,
    "#FBBC76",
    100,
    "#F7903B",
    250,
    "#F36F41",
    500,
    "#DC4840",
    1000,
    "#BA233E",
    5000,
    "#701231",
  ];
  if (entry.value.layer === "damage") {
    const damageProp = entry.value.vectorProperty;
    const damageValueExpression = [
      "let",
      "digits",
      ["length", ["to-string", ["get", damageProp]]],
      [
        "let",
        "rounded",
        [
          "*",
          [
            "round",
            [
              "*",
              ["get", damageProp],
              ["^", 10, ["*", -1, ["-", ["var", "digits"], 3]]],
            ],
          ],
          ["^", 10, ["-", ["var", "digits"], 3]],
        ],
        [
          "step",
          ["var", "digits"],
          ["to-string", ["var", "rounded"]],
          4,
          damageStepExpression(1000, 6, "K"),
          7,
          damageStepExpression(1000000, 9, "M"),
          10,
          damageStepExpression(1000000000, 12, "B"),
        ],
      ],
    ];
    const isEadd = entry.value.damage || "eadd" === "eadd";
    const damageLabelExpression = isEadd
      ? ["concat", "$", damageValueExpression]
      : damageValueExpression;
    damageLayers.push({
      id: `damage-polygon`,
      type: "fill",
      source: "Damage: Vector",
      "source-layer": "damage",
      paint: {
        "fill-color": [
          "step",
          ["get", damageProp],
          ...(isEadd ? eadRamp : easdRamp),
        ],
      },
    });
    damageOutlines.push({
      id: `damage-outline`,
      type: "line",
      source: "Damage: Vector",
      "source-layer": "damage",
      paint: {
        "line-color": isEadd
          ? linearZoom("#999999", "#444444")
          : linearZoom("#DDDDDD", "#666666"),
        "line-width": linearZoom(0.5, 3),
      },
    });
    damageLabels.push({
      id: `damage-label`,
      type: "symbol",
      source: "Damage: Vector",
      "source-layer": "damage_point",
      minzoom: 10,
      layout: {
        "text-field": damageLabelExpression,
        "text-size": 14,
        "text-font": ["Franklin Gothic Demi Regular"],
        "text-overlap": "always",
      },
      paint: {
        "text-color": "#222222",
        "text-halo-blur": 0.5,
        "text-halo-color": "rgba(255, 255, 255, 1)",
        "text-halo-width": 1,
      },
    });
  }

  const isHLC = entry.value.layer === "historical-land-change";
  const maskLayers = [
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
  ];

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
      ...(isHLC ? maskLayers : []),
      ...modelLayers,
      ...damageLayers,
      ...(isHLC ? [] : maskLayers),
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
      ...damageOutlines,
      ...projectLayers(
        entry.value.layer == "projects" ||
          (entry.value.group !== "fwoa" && showProjects.value),
        ["<=", ["get", "year"], entry.value.year],
        entry.value.layer !== "Projects"
      ),
      ...searchLayers,
      ...projectLayers(selectedProjects, selectedProjects, false, "-selected"),
      {
        id: "label",
        type: "symbol",
        source: "Base Map: Vector",
        "source-layer": "label",
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
      ...damageLabels,
    ],
  };
}
