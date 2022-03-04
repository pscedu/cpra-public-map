export function getStyle(layers, tilePort=8080) {
	let loc = document.location;
	let tileBase = "http://vm007.bridges2.psc.edu:8081/services";
	let backgroundLayers = [
		{
			"id": "state",
			"type": "fill",
			"source": "base",
			"source-layer": "state",
			"paint": {
				"fill-color": "#d6d6d6"
			}
		},
		{
			"id": "state-screen",
			"type": "fill",
			"source": "base",
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
			"source": "base",
			"source-layer": "water",
			"paint": {
				"fill-color": "#ffffff"
			}
		},
		{
			"id": "lwi",
			"type": "raster",
			"source": "lwi"
		}
	];
	let foregroundLayers = [
		{
			"id": "levee",
			"type": "line",
			"source": "base",
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
			"source": "base",
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
			"source": "base",
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
			"source": "base",
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
		}
	];
	let projectLayers = [
		// Landbridge polygon
		{
			"id": "project-polygon-lb",
			"type": "fill",
			"source": "base",
			"source-layer": "project_polygon",
			"filter": ["all",
				["==", ["get", "active"], 1],
				["==", ["get", "type"], "LB"]
			],
			"paint": {
				"fill-color": "#5C913A"
			}
		},
		// Marsh creation polygon
		{
			"id": "project-polygon-mc",
			"type": "fill",
			"source": "base",
			"source-layer": "project_polygon",
			"filter": ["all",
				["==", ["get", "active"], 1],
				["==", ["get", "type"], "MC"]
			],
			"paint": {
				"fill-pattern": "green-dots"
			}
		},
		// Bank stabilization line
								{
			"id": "project-line-bs",
			"type": "line",
			"source": "base",
			"source-layer": "project_line",
			"filter": ["all",
				["==", ["get", "active"], 1],
				["==", ["get", "type"], "BS"]
			],
			"paint": {
				"line-color": "#D9A73B",
				"line-width": 4
			}
		},
		// Diversion line
		{
			"id": "project-line-di",
			"type": "line",
			"source": "base",
			"source-layer": "project_line",
			"filter": ["all",
				["==", ["get", "active"], 1],
				["==", ["get", "type"], "DI"]
			],
			"paint": {
				"line-color": "#ED6731",
				"line-dasharray": [2, 1],
				"line-width": 6.75
			}
		},
		// Hydrologic restoration line
		{
			"id": "project-line-hr",
			"type": "line",
			"source": "base",
			"source-layer": "project_line",
			"filter": ["all",
				["==", ["get", "active"], 1],
				["==", ["get", "type"], "HR"]
			],
			"paint": {
				"line-color": "#1DBEF0",
				"line-dasharray": [1, 1],
				"line-width": 5
			}
		},
		// Ridge restoration line
		{
			"id": "project-line-rr",
			"type": "line",
			"source": "base",
			"source-layer": "project_line",
			"filter": ["all",
				["==", ["get", "active"], 1],
				["==", ["get", "type"], "RR"]
			],
			"paint": {
				"line-color": "#1C4E7F",
				"line-width": 2.5
			}
		},
		// Structural risk reduction line
		{
			"id": "project-line-sr",
			"type": "line",
			"source": "base",
			"source-layer": "project_line",
			"filter": ["all",
				["==", ["get", "active"], 1],
				["==", ["get", "type"], "SR"]
			],
			"paint": {
				"line-color": "#404042",
				"line-width": 4
			}
		},
		// Diversion point
		{
			"id": "project-point-di",
			"type": "circle",
			"source": "base",
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
			}
		},
		// Hydrologic restoration point
		{
			"id": "project-point-hr",
			"type": "circle",
			"source": "base",
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
			}
		},
		// Structural risk reduction point
		{
			"id": "project-point-sr",
			"type": "symbol",
			"source": "base",
			"source-layer": "project_point",
			"filter": ["all",
				["==", ["get", "active"], 1],
				["==", ["get", "type"], "SR"]
			],
			"layout": {
				"icon-allow-overlap": true,
				"icon-image": "square"
			}
		}
	];
	let modelLayers = [
		{
			"id": "model",
			"type": "raster",
			"source": "model"
		}
	];
	return {
		"version": 8,
		"sprite": `${loc.origin}/style/sprite`,
		"glyphs": `${loc.origin}/style/glyphs/{fontstack}/{range}.pbf`,
		"sources": {
			"base": {
				"type": "vector",
				"url": `${tileBase}/basemap`
			},
			"model": {
				"type": "raster",
				"url": 'http://vm007.bridges2.psc.edu:8081/services/MP2023_S07_G500_C000_U00_V00_SLA_N_02_52_W_lndchg',
				"tileSize": 256
			},
			"lwi": {
				"type": "raster",
				"url": `${tileBase}/lwi`,
				"tileSize": 256
			}
		},
		"layers": [
			...backgroundLayers,
			...((layers.includes("model")) ? modelLayers : []),
			...foregroundLayers,
			...((layers.includes("projects")) ? projectLayers : [])
		]
	};
}
