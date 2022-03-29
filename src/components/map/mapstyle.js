function linear_zoom(min, max) {
  return ["interpolate", ["linear"], ["zoom"], 6, min, 12, max];
}

export function getStyle(services, mapState, projects) {
  if (services === null) return { version: 8, sources: {}, layers: [] };

  let loc = document.location;
  let projectsVisibility = mapState.showProjects ? "visible" : "none";

  // Prepare sources.
  const sources = {};
  for (let service of Object.values(services)) {
    let source = {
      type: service.imageType == "pbf" ? "vector" : "raster",
      url: service.url,
    };
    if (source.type == "raster") source.tileSize = 256;
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
      // Landbridge polygon
      {
        id: "project-polygon-lb",
        type: "fill",
        source: "Base Map: Vector",
        "source-layer": "project_polygon",
        filter: ["all", ["==", ["get", "type"], "LB"], activeProjects],
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "project_id"], mapState.activeProjectId],
            "#683796",
            "#5C913A",
          ],
        },
        layout: {
          visibility: projectsVisibility,
        },
      },
      // Marsh creation polygon
      {
        id: "project-polygon-mc",
        type: "fill",
        source: "Base Map: Vector",
        "source-layer": "project_polygon",
        filter: ["all", ["==", ["get", "type"], "MC"], activeProjects],
        paint: {
          "fill-pattern": [
            "case",
            ["==", ["get", "project_id"], mapState.activeProjectId],
            "purple-dots",
            "green-dots",
          ],
        },
        layout: {
          visibility: projectsVisibility,
        },
      },
      // Bank stabilization and structural risk reduction lines
      {
        id: "project-line-bs-sr",
        type: "line",
        source: "Base Map: Vector",
        "source-layer": "project_line",
        filter: [
          "all",
          ["in", ["get", "type"], ["literal", ["BS", "SR"]]],
          activeProjects,
        ],
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "project_id"], mapState.activeProjectId],
            "#683796",
            ["==", ["get", "type"], "BS"],
            "#D9A73B",
            "#404042",
          ],
          "line-width": linear_zoom(2, 5),
        },
        layout: {
          visibility: projectsVisibility,
        },
      },
      // Diversion and hydrologic restoration lines
      {
        id: "project-line-di-hr",
        type: "line",
        source: "Base Map: Vector",
        "source-layer": "project_line",
        filter: [
          "all",
          ["in", ["get", "type"], ["literal", ["DI", "HR"]]],
          activeProjects,
        ],
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "project_id"], mapState.activeProjectId],
            "#683796",
            ["==", ["get", "type"], "DI"],
            "#ED6731",
            "#1DBEF0",
          ],
          "line-dasharray": [2, 1],
          "line-width": linear_zoom(2, 6.75),
        },
        layout: {
          visibility: projectsVisibility,
        },
      },
      // Ridge restoration line
      {
        id: "project-line-rr",
        type: "line",
        source: "Base Map: Vector",
        "source-layer": "project_line",
        filter: ["all", ["==", ["get", "type"], "RR"], activeProjects],
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "project_id"], mapState.activeProjectId],
            "#683796",
            "#1C4E7F",
          ],
          "line-width": linear_zoom(1.5, 2.5),
        },
        layout: {
          visibility: projectsVisibility,
        },
      },
      // Diversion and hydrologic restoration points
      {
        id: "project-point-di-hr",
        type: "circle",
        source: "Base Map: Vector",
        "source-layer": "project_point",
        filter: [
          "all",
          ["in", ["get", "type"], ["literal", ["DI", "HR"]]],
          activeProjects,
        ],
        paint: {
          "circle-color": "#FFFFFF",
          "circle-radius": linear_zoom(3, 6),
          "circle-stroke-color": [
            "case",
            ["==", ["get", "project_id"], mapState.activeProjectId],
            "#683796",
            ["==", ["get", "type"], "DI"],
            "#ED6731",
            "#1DBEF0",
          ],
          "circle-stroke-width": linear_zoom(2.5, 5),
        },
        layout: {
          visibility: projectsVisibility,
        },
      },
      // Structural risk reduction point
      {
        id: "project-point-sr",
        type: "symbol",
        source: "Base Map: Vector",
        "source-layer": "project_point",
        filter: ["all", ["==", ["get", "type"], "SR"], activeProjects],
        layout: {
          "icon-allow-overlap": true,
          "icon-image": [
            "case",
            ["==", ["get", "project_id"], mapState.activeProjectId],
            "purple-square",
            "black-square",
          ],
          "icon-size": linear_zoom(0.5, 1),
          visibility: projectsVisibility,
        },
      },
    ],
  };
}
