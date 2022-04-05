function linearZoom(min, max) {
  return ["interpolate", ["linear"], ["zoom"], 6, min, 12, max];
}

function projectLayers(show, filter, suffix = "") {
  if (!show) return [];
  return [
    // Landbridge polygon
    {
      id: `project-polygon-lb${suffix}`,
      type: "fill",
      source: "Base Map: Vector",
      "source-layer": "project_polygon",
      filter: ["all", ["==", ["get", "type"], "LB"], filter],
      paint: {
        "fill-color": "#5C913A",
      },
    },
    // Marsh creation polygon
    {
      id: `project-polygon-mc${suffix}`,
      type: "fill",
      source: "Base Map: Vector",
      "source-layer": "project_polygon",
      filter: ["all", ["==", ["get", "type"], "MC"], filter],
      paint: {
        "fill-pattern": "green-dots",
      },
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
        "line-color": [
          "case",
          ["==", ["get", "type"], "BS"],
          "#D9A73B",
          ["==", ["get", "type"], "OR"],
          "#EDA482",
          "#404042",
        ],
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
        "line-color": [
          "case",
          ["==", ["get", "type"], "DI"],
          "#ED6731",
          "#1DBEF0",
        ],
        "line-dasharray": [2, 1],
        "line-width": linearZoom(2, 6.75),
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
        "line-color": "#1C4E7F",
        "line-width": linearZoom(1.5, 2.5),
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
        "line-color": "#19A598",
        "line-width": linearZoom(3, 4.5),
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
        "circle-color": "#FFFFFF",
        "circle-radius": linearZoom(3, 6),
        "circle-stroke-color": [
          "case",
          ["==", ["get", "type"], "DI"],
          "#ED6731",
          "#1DBEF0",
        ],
        "circle-stroke-width": linearZoom(2.5, 5),
      },
    },
    // Structural risk reduction point
    {
      id: `project-point-sr${suffix}`,
      type: "symbol",
      source: "Base Map: Vector",
      "source-layer": "project_point",
      filter: ["all", ["==", ["get", "type"], "SR"], filter],
      layout: {
        "icon-allow-overlap": true,
        "icon-image": "black-square",
        "icon-size": linearZoom(0.5, 1),
      },
    },
  ];
}

function rasterTileUrl(serviceUrl, prefix) {
  let sub = `//${prefix}.`;
  return `${serviceUrl.replace("//", sub)}/tiles/{z}/{x}/{y}.png`;
}

export function getStyle(services, mapState, projects) {
  if (services === null) return { version: 8, sources: {}, layers: [] };

  let loc = document.location;

  // Prepare sources.
  const sources = {};
  for (let service of Object.values(services)) {
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

  // Prepare model layers.
  const modelLayers = Object.values(services)
    .filter((service) => service.name.indexOf("Base Map") == -1)
    .map((service) => {
      let [layerName, yearStr] = service.name.split(" - Year ");
      let year = parseInt(yearStr, 10);
      let visibleYear =
        mapState.prevYear !== null ? mapState.prevYear : mapState.year;
      return {
        id: service.name,
        type: "raster",
        source: service.name,
        paint: {
          "raster-fade-duration": 0,
          "raster-opacity":
            layerName == mapState.modelLayer && year == visibleYear ? 1 : 0,
        },
        layout: {
          visibility:
            layerName == mapState.modelLayer &&
            [mapState.year, mapState.prevYear].indexOf(year) != -1
              ? "visible"
              : "none",
        },
      };
    });

  const activeProjects = [
    "in",
    ["get", "project_id"],
    ["literal", projects.map((project) => project.project_id)],
  ];

  const selectedProjectScreen =
    mapState.showProjects && mapState.selectedProjectId != ""
      ? [
          {
            id: "selected-project-screen",
            type: "background",
            paint: {
              "background-color": "#ffffff",
              "background-opacity": 0.7,
            },
          },
        ]
      : [];

  return {
    version: 8,
    sprite: `${loc.origin}/style/sprite`,
    glyphs: `${loc.origin}/style/glyphs/{fontstack}/{range}.pbf`,
    sources,
    transition: {
      duration: 0,
      delay: 0,
    },
    layers: [
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
      ...projectLayers(mapState.showProjects, activeProjects),
      ...selectedProjectScreen,
      ...projectLayers(
        mapState.showProjects && mapState.selectedProjectId != "",
        ["==", ["get", "project_id"], mapState.selectedProjectId],
        "-selected"
      ),
    ],
  };
}
