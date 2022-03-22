export function getStyle(services, mapState) {
	if (services === null) return {version: 8, sources: {}, layers: []};

	let loc = document.location;
	let projectsVisibility = (mapState.showProjects) ? "visible": "none";

	// Prepare sources.
	const sources = {};
	for (let service of Object.values(services)) {
		let source = {
			type: (service.imageType == "pbf") ? "vector" : "raster",
			url: service.url
		};
		if (source.type == "raster") source.tileSize = 256;
		sources[service.name] = source;
	}

	// Prepare model layers.
	const modelLayers = Object.values(services)
		.filter((service) => service.name.indexOf("Base Map") == -1)
		.map((service) => {
			let [layerName, yearStr] = service.name.split(" - Year ");
			let year = parseInt(yearStr);
			let visibleYear = (mapState.prevYear !== null) ?
				mapState.prevYear : mapState.year;
			return {
				id: service.name,
				type: "raster",
				source: service.name,
				paint: {
					"raster-fade-duration": 0,
					"raster-opacity": (layerName == mapState.modelLayer
						&& year == visibleYear) ? 1 : 0
				},
				layout: {
					visibility: (layerName == mapState.modelLayer
						&& [mapState.year, mapState.prevYear].indexOf(year) != -1) ?
						"visible": "none"
				}
			}
		});
	return {
		"version": 8,
		"sprite": `${loc.origin}/style/sprite`,
		"glyphs": `${loc.origin}/style/glyphs/{fontstack}/{range}.pbf`,
		"sources": sources,
		"transition": {
			"duration": 0,
			"delay": 0
		},
		"layers": [
			{
				"id": "state",
				"type": "fill",
				"source": "Base Map: Vector",
				"source-layer": "state",
				"paint": {
					"fill-color": "#d6d6d6"
				}
			},
			{
				"id": "state-screen",
				"type": "fill",
				"source": "Base Map: Vector",
				"source-layer": "state",
				"filter": ["!=", ["get", "abbr"], "LA"],
				"paint": {
					"fill-color": "#ffffff",
					"fill-opacity": 0.4
				}
			},
			{
				"id": "water-not-in-icm",
				"type": "fill",
				"source": "Base Map: Vector",
				"source-layer": "water",
				"paint": {
					"fill-color": "#ffffff"
				}
			},
			{
				"id": "base-raster",
				"type": "raster",
				"source": "Base Map: Raster"
			},
			...modelLayers,
			{
				"id": "levee",
				"type": "line",
				"source": "Base Map: Vector",
				"source-layer": "levee",
				"paint": {
					"line-color": "#939598",
					"line-opacity": 0.5,
					"line-width": 0.667
				}
			},
			{
				"id": "road-secondary",
				"type": "line",
				"source": "Base Map: Vector",
				"source-layer": "road",
				"filter": ["==", ["get", "type"], "S"],
				"paint": {
					"line-color": "#a4a4a4",
					"line-opacity": 0.5,
					"line-width": 1.333
				}
			},
			{
				"id": "road-primary",
				"type": "line",
				"source": "Base Map: Vector",
				"source-layer": "road",
				"filter": ["==", ["get", "type"], "P"],
				"paint": {
					"line-color": "#a4a4a4",
					"line-width": 1.333
				}
			},
			{
				"id": "label",
				"type": "symbol",
				"source": "Base Map: Vector",
				"source-layer": "label",
				"layout": {
					"text-field": ["get", "text"],
					"text-size": ["case", ["==", "community", ["get", "type"]], 16, 13],
					"text-font": ["case",
						["==", "community", ["get", "type"]],
						["literal", ["Franklin Gothic Demi Regular"]],
						["literal", ["Franklin Gothic Book Regular"]]
					],
				},
				"paint": {
					"text-color": "#444444"
				}
			},
			// Landbridge polygon
			{
				"id": "project-polygon-lb",
				"type": "fill",
				"source": "Base Map: Vector",
				"source-layer": "project_polygon",
				"filter": ["all",
					["==", ["get", "active"], 1],
					["==", ["get", "type"], "LB"]
				],
				"paint": {
					"fill-color": "#5C913A"
				},
				"layout": {
					"visibility": projectsVisibility
				}
			},
			// Marsh creation polygon
			{
				"id": "project-polygon-mc",
				"type": "fill",
				"source": "Base Map: Vector",
				"source-layer": "project_polygon",
				"filter": ["all",
					["==", ["get", "active"], 1],
					["==", ["get", "type"], "MC"]
				],
				"paint": {
					"fill-pattern": "green-dots"
				},
				"layout": {
					"visibility": projectsVisibility
				}
			},
			// Bank stabilization line
									{
				"id": "project-line-bs",
				"type": "line",
				"source": "Base Map: Vector",
				"source-layer": "project_line",
				"filter": ["all",
					["==", ["get", "active"], 1],
					["==", ["get", "type"], "BS"]
				],
				"paint": {
					"line-color": "#D9A73B",
					"line-width": 4
				},
				"layout": {
					"visibility": projectsVisibility
				}
			},
			// Diversion line
			{
				"id": "project-line-di",
				"type": "line",
				"source": "Base Map: Vector",
				"source-layer": "project_line",
				"filter": ["all",
					["==", ["get", "active"], 1],
					["==", ["get", "type"], "DI"]
				],
				"paint": {
					"line-color": "#ED6731",
					"line-dasharray": [2, 1],
					"line-width": 6.75
				},
				"layout": {
					"visibility": projectsVisibility
				}
			},
			// Hydrologic restoration line
			{
				"id": "project-line-hr",
				"type": "line",
				"source": "Base Map: Vector",
				"source-layer": "project_line",
				"filter": ["all",
					["==", ["get", "active"], 1],
					["==", ["get", "type"], "HR"]
				],
				"paint": {
					"line-color": "#1DBEF0",
					"line-dasharray": [1, 1],
					"line-width": 5
				},
				"layout": {
					"visibility": projectsVisibility
				}
			},
			// Ridge restoration line
			{
				"id": "project-line-rr",
				"type": "line",
				"source": "Base Map: Vector",
				"source-layer": "project_line",
				"filter": ["all",
					["==", ["get", "active"], 1],
					["==", ["get", "type"], "RR"]
				],
				"paint": {
					"line-color": "#1C4E7F",
					"line-width": 2.5
				},
				"layout": {
					"visibility": projectsVisibility
				}
			},
			// Structural risk reduction line
			{
				"id": "project-line-sr",
				"type": "line",
				"source": "Base Map: Vector",
				"source-layer": "project_line",
				"filter": ["all",
					["==", ["get", "active"], 1],
					["==", ["get", "type"], "SR"]
				],
				"paint": {
					"line-color": "#404042",
					"line-width": 4
				},
				"layout": {
					"visibility": projectsVisibility
				}
			},
			// Diversion point
			{
				"id": "project-point-di",
				"type": "circle",
				"source": "Base Map: Vector",
				"source-layer": "project_point",
				"filter": ["all",
					["==", ["get", "active"], 1],
					["==", ["get", "type"], "DI"]
				],
				"paint": {
					"circle-color": "#FFFFFF",
					"circle-radius": 6,
					"circle-stroke-color": "#ED6731",
					"circle-stroke-width": 5
				},
				"layout": {
					"visibility": projectsVisibility
				}
			},
			// Hydrologic restoration point
			{
				"id": "project-point-hr",
				"type": "circle",
				"source": "Base Map: Vector",
				"source-layer": "project_point",
				"filter": ["all",
					["==", ["get", "active"], 1],
					["==", ["get", "type"], "HR"]
				],
				"paint": {
					"circle-color": "#FFFFFF",
					"circle-radius": 6,
					"circle-stroke-color": "#1DBEF0",
					"circle-stroke-width": 5
				},
				"layout": {
					"visibility": projectsVisibility
				}
			},
			// Structural risk reduction point
			{
				"id": "project-point-sr",
				"type": "symbol",
				"source": "Base Map: Vector",
				"source-layer": "project_point",
				"filter": ["all",
					["==", ["get", "active"], 1],
					["==", ["get", "type"], "SR"]
				],
				"layout": {
					"icon-allow-overlap": true,
					"icon-image": "square",
					"visibility": projectsVisibility
				}
			}
		]
	};
}
