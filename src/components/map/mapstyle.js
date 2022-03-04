function getSources(layers, mapState, servicesUrl) {
	const sources = {
		"base": {
			"type": "vector",
			"url": `${servicesUrl}/basemap-vector`
		},
		"lwi": {
			"type": "raster",
			"url": `${servicesUrl}/basemap-raster`,
			"tileSize": 256
		}
	};
	mapState.visibleLayers.forEach((name) => {
		const layer = layers[name];
		const year = `Year ${mapState.year}`;
		if (layer !== undefined
				&& layer.type == "model"
				&& year in layer.years) sources[name] = {
			type: "raster",
			url: layer.years[year],
			tileSize: 256
		};
	});
	return sources;
}

function getBackgroundLayers() {
	return [
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
}


function getForegroundLayers() {
	return [
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
}
function getProjectLayers(layers, mapState) {
	if (!mapState.visibleLayers.includes("Projects")) return [];
	return [
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
}


function getModelLayers(layers, mapState) {
	const year = `Year ${mapState.year}`;
	return mapState.visibleLayers
		.filter(name => layers[name] !== undefined
			&& layers[name].type == "model"
			&& year in layers[name].years)
		.map((name) => {
			return {
				id: name,
				type: "raster",
				source: name
			};
		});
}


export function getStyle(servicesUrl, layers, mapState) {
	let loc = document.location;
	return {
		"version": 8,
		"sprite": `${loc.origin}/style/sprite`,
		"glyphs": `${loc.origin}/style/glyphs/{fontstack}/{range}.pbf`,
		"sources": getSources(layers, mapState, servicesUrl),
		"transition": {
			"duration": 0,
			"delay": 0
		},
		"layers": [
			...getBackgroundLayers(layers, mapState),
			...getModelLayers(layers, mapState),
			...getForegroundLayers(layers, mapState),
			...getProjectLayers(layers, mapState)
		]
	};
}
