const colorSwatch = (color) =>
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' " +
  `width='50' height='20'><rect fill='${color.replace(
    "#",
    "%23"
  )}' x='0' y='0' height='20' width='50' /></svg>`;
export const servicesUrl = "https://tiles.mpdv-23.bridges2.psc.edu/services";
export const projectListUrl = "/projects.csv";
export const geocodeUrl = "https://mpdv-23.bridges2.psc.edu/nominatim/search";
export const websiteUrl =
  "https://coastal.la.gov/our-plan/2023-coastal-master-plan/";
export const contactEmail = ["mai", ["masterplan", "la.gov"].join("@")].join(
  "lto:"
);
export const maxBounds = [-91.215 - 5, 29.41 - 3, -91.215 + 5, 29.41 + 3];
export const projectLayers = [
  "project-polygon-lb",
  "project-polygon-mc",
  "project-line-bs-or-sr",
  "project-line-di-hr",
  "project-line-rr",
  "project-line-sp",
  "project-point-di-hr",
  "project-point-sr",
  "project-icon",
  "project-label",
];
export const projectTypes = {
  BH: "Barrier Island Restoration",
  BS: "Bank Stabilization",
  DI: "Diversion",
  HR: "Hydrologic Restoration",
  IP: "Integrated Project",
  LB: "Landbridge",
  MC: "Marsh Creation",
  NR: "Non-Structural Risk Reduction",
  OR: "Oyster Reef Restoration",
  RR: "Ridge Restoration",
  SP: "Shoreline Protection",
  SR: "Structural Risk Reduction",
};
export const projectTypeDescriptions = {
  BH: "Barrier Island/Headland Restoration is the creation and restoration of dune, beach, and back barrier marsh to restore or augment offshore barrier islands and headlands.",
  BS: "Bank Stabilization is the onshore placement of earthen fill and vegetation planting designed to reduce wave energies and maintain shorelines in open bays, lakes, and bayous.",
  DI: "Diversions use channels and/or structures to divert sediment and fresh water from the Mississippi and Atchafalaya Rivers into adjacent basins.",
  HR: "Hydrologic Restoration conveys fresh water to areas that have been cut off by man-made features or prevents the intrusion of salt water into fresh areas through man-made channels and eroded wetlands.",
  LB: "Land Bridge establishes new wetlands in deep and shallow open water across basins to maintain estuarine gradient through sediment dredging and placement.",
  MC: "Marsh Creation establishes new wetlands in open water areas such as bays, ponds, and canals through sediment dredging and placement.",
  NR: "Non-Structural Risk Reduction projects elevate and floodproof buildings and help property owners prepare for flooding or move out of areas of high flood risk.",
  OR: "Oyster Barrier Reefs are bioengineered to improve oyster propagation and serve as breakwaters to attenuate wave energies.",
  RR: "Ridge Restoration uses dredging, sediment placement, and vegetative plantings to restore natural ridge functions in basins.",
  SP: "Shoreline Protection provided by near-shore rock breakwaters reduces wave energies on shorelines surrounding open bays, lakes, sounds, and bayous.",
  SR: "Structural Risk Reduction projects reduce flood risk by acting as physical barriers against storm surge. These systems can include earthen levees, floodwalls, floodgates, and pumping stations.",
};
export const legends = {
  "Damage: EAD": {
    images: [
      "#4E7872",
      "#3D9E8B",
      "#6CB686",
      "#B9D1A5",
      "#CDABC9",
      "#A46093",
      "#77256D",
    ].map(colorSwatch),
    labels: [
      "$0 to < $1M",
      "$1M to < $10M",
      "$10M to < $50M",
      "$50M to < $100M",
      "$100M to < $500M",
      "$500M to < $1B",
      "$1B to < $3B",
    ],
  },
  "Flood Depth": {
    images: [
      "#728D97",
      "#73B7EA",
      "#99D9A7",
      "#F8D88B",
      "#E9B023",
      "#E56524",
      "#B73865",
    ].map(colorSwatch),
    labels: [
      "1 to < 4 feet",
      "4 to < 7 feet",
      "7 to < 10 feet",
      "10 to < 13 feet",
      "13 to < 16 feet",
      "16 to < 21 feet",
      "21+ feet",
    ],
  },
  "Historical Land Change": {
    images: ["#4591ac", "#265118"].map(colorSwatch),
    labels: ["Persistent Land Loss", "Persistent Land Gain"],
  },
  "Land Change": {
    images: ["#4591ac", "#265118"].map(colorSwatch),
    labels: ["Land Loss", "Land Gain"],
  },
  Projects: {
    images: [
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='20'><line x1='0' y1='10' x2='50' y2='10' stroke='%23ED6731' stroke-width='5' stroke-dasharray='9 4' /><circle fill='white' stroke='%23ED6731' stroke-width='4' cx='25' cy='10' r='6'/></svg>",
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='20'><line x1='0' y1='10' x2='50' y2='10' stroke='%231DBEF0' stroke-width='5' stroke-dasharray='9 4' /><circle fill='white' stroke='%231DBEF0' stroke-width='4' cx='25' cy='10' r='6'/></svg>",
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='20'><line x1='0' y1='10' x2='50' y2='10' stroke='%23404042' stroke-width='3' /><rect fill='white' stroke='%23404042' stroke-width='1' x='21' y='6' height='8' width='8' /></svg>",
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='20'><line x1='0' y1='10' x2='50' y2='10' stroke='%23D9A73B' stroke-width='3' /></svg>",
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='20'><line x1='0' y1='10' x2='50' y2='10' stroke='%231C4E7F' stroke-width='2' /></svg>",
      colorSwatch("#5c913a"),
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='20'><rect fill='%23e8ee9c' x='0' y='0' height='20' width='50' /><circle fill='%2394b147' stroke-width='4' cx='0' cy='0' r='3.5'/><circle fill='%2394b147' stroke-width='4' cx='20' cy='0' r='3.5'/><circle fill='%2394b147' stroke-width='4' cx='40' cy='0' r='3.5'/><circle fill='%2394b147' stroke-width='4' cx='10' cy='10' r='3.5'/><circle fill='%2394b147' stroke-width='4' cx='30' cy='10' r='3.5'/><circle fill='%2394b147' stroke-width='4' cx='50' cy='10' r='3.5'/><circle fill='%2394b147' stroke-width='4' cx='0' cy='20' r='3.5'/><circle fill='%2394b147' stroke-width='4' cx='20' cy='20' r='3.5'/><circle fill='%2394b147' stroke-width='4' cx='40' cy='20' r='3.5'/></svg>",
    ],
    labels: [
      "Diversion",
      "Hydrologic Restoration",
      "Structural Risk Reduction",
      "Bank Stabilization",
      "Ridge Restoration",
      "Landbridge",
      "Marsh Creation",
    ],
    tooltips: [
      projectTypeDescriptions.DI,
      projectTypeDescriptions.HR,
      projectTypeDescriptions.SR,
      projectTypeDescriptions.BS,
      projectTypeDescriptions.BH,
      projectTypeDescriptions.OR,
      projectTypeDescriptions.RR,
      projectTypeDescriptions.SP,
      projectTypeDescriptions.LB,
      projectTypeDescriptions.MC,
    ],
  },
  "Vegetation Type": {
    images: ["#5E823A", "#DAE86D", "#92CBE8", "#735753", "#0679D2"].map(
      colorSwatch
    ),
    labels: [
      "Fresh Forest",
      "Fresh Marsh",
      "Intermediate Marsh",
      "Brackish Marsh",
      "Saline Marsh",
    ],
  },
};
export const layers = {
  damage: {
    groups: ["G500", "G603"],
    name: "Damage",
    legend: legends["Damage"],
    nullYears: [],
    scenarios: ["S07", "S08"],
    subtypes: ["EAD", "EASD"],
    type: "vector",
    years: [0, 10, 20, 30, 40, 50],
  },
  floodDepth: {
    groups: ["G500"],
    name: "Flood Depth",
    legend: legends["Land Change"],
    nullYears: [],
    scenarios: ["S07", "S08"],
    subtypeName: "Exceedance Probability",
    subtypes: ["10.0", "2.0", "1.0", "0.2"],
    type: "raster",
    years: [0, 10, 20, 30, 40, 50],
  },
  historicalLandChange: {
    groups: ["G500"],
    name: "Historical Land Change",
    legend: legends["Historical Land Change"],
    nullYears: [1932],
    scenarios: ["S07"],
    type: "raster",
    years: [1932, 1956, 1975, 1985, 1995, 2006, 2015],
  },
  landChange: {
    groups: ["G500", "G603"],
    name: "Land Change",
    legend: legends["Land Change"],
    nullYears: [0],
    scenarios: ["S07", "S08"],
    type: "raster",
    years: [0, 10, 20, 30, 40, 50],
  },
  projects: {
    groups: ["G500"],
    name: "Projects",
    legend: legends["Projects"],
    nullYears: [0],
    scenarios: ["S07", "S08"],
    type: "vector",
    years: [...Array(51).keys()],
  },
  vegetationType: {
    groups: ["G500", "G603"],
    name: "Vegetation Type",
    legend: legends["Vegetation Type"],
    nullYears: [],
    scenarios: ["S07", "S08"],
    type: "raster",
    years: [0, 10, 20, 30, 40, 50],
  },
};
export const views = {
  "land-change": {
    title: "Land Change",
    layer: layers.landChange,
  },
  "vegetation-type": {
    title: "Vegetation Type",
    layer: layers.vegetationType,
  },
  "flood-depth": {
    title: "Flood Depth",
    layer: layers.floodDepth,
  },
  damage: {
    title: "Damage",
    layer: layers.damage,
  },
  projects: {
    title: "Projects",
    layer: layers.projects,
  },
  "slide-0": {
    title: "Introduction",
    layer: layers.historicalLandChange,
    group: "G500",
    scenario: "S07",
    year: 2015,
  },
  "slide-1": {
    title: "Environmental Change Over Time",
    layer: layers.landChange,
    group: "G500",
    scenario: "S07",
    year: 0,
  },
  "slide-2": {
    title: "Land Change",
    layer: layers.landChange,
    group: "G500",
    scenario: "S07",
    year: 50,
  },
  "slide-3": {
    title: "Flood Depth",
    layer: layers.floodDepth,
    group: "G500",
    scenario: "S07",
    year: 50,
  },
  "slide-4": {
    title: "Damage",
    layer: layers.damage,
    group: "G500",
    scenario: "S07",
    year: 50,
  },
  "slide-5": {
    title: "Projects",
    layer: layers.projects,
  },
  "slide-6": {
    title: "Land Change",
    layer: layers.landChange,
    group: "G603",
    scenario: "S07",
    year: 50,
  },
  "slide-7": {
    title: "Flood Depth",
    layer: layers.floodDepth,
    group: "G603",
    scenario: "S07",
    year: 50,
  },
  "slide-8": {
    title: "Damage",
    layer: layers.damage,
    group: "G603",
    scenario: "S07",
    year: 50,
  },
  "slide-9": {
    title: "Next Steps",
    layer: layers.projects,
  },
};
export const controls = {
  aep: {
    type: "buttons",
    stateVariable: "subtype",
    label: "Annual Exceedance Probability",
    choices: layers.floodDepth.subtypes.map((subtype) => [subtype, subtype]),
    tooltip:
      "Flood events are often reported in annual exceedance probability (AEP), which is the likelihood of a given flood event occurring in a year. For example, a very intense flood might be classified as a 500-year event, which means that it has a 1/500 chance (or 0.2% chance) of occurring in any given year. Use the buttons below to view the anticipated flood risk resulting from different possible events.",
  },
  damage: {
    type: "buttons",
    stateVariable: "subtype",
    label: "Damage Metric",
    choices: [
      ["EAD", "Dollars"],
      ["EASD", "Structures"],
    ],
  },
  group: {
    type: "buttons",
    label: "Project Implementation Scenario",
    choices: [
      ["G500", "Without Further Action"],
      ["G603", "With 2023 Master Plan"],
    ],
    tooltip:
      "Select <strong>Future Without Action</strong> to view model results in a scenario without construction and/or operation of the recommended projects from the 2023 Coastal Master Plan. Select <strong>With 2023 Master Plan</strong> to view model results with implementation of the recommended projects from the 2023 Coastal Master Plan (i.e. assuming construction and operation of coastal restoration and flood protection projects as recommended in the Master Plan).",
  },
  projects: {
    type: "checkbox",
    stateVariable: "showProjects",
    label: "Show candidate projects",
    disabled: (state) => state.group.value === "G500",
  },
  scenario: {
    type: "buttons",
    label: "Environmental Scenario",
    choices: [
      ["S07", "Lower"],
      ["S08", "Higher"],
    ],
    tooltip:
      "Future land change and flood risk depends on environmental factors including precipitation, sea level rise, and land subsidence rates. Given the uncertainty in predicting environmental factors, the Louisiana Coastal Master Plan considers many possible future scenarios. Use the buttons below to view model results under a <strong>Lower Scenario</strong> (representing lower rates of sea level rise, land subsidence, etc.) and a <strong>Higher Scenario</strong> (representing higher rates of sea level rise, land subsidence, etc.).",
  },
  year: {
    type: "year",
    tooltip:
      "The Louisiana Coastal Master Plan utilizes technical models to predict coastal land change and flood risk over a 50-year period. Use the slider below to view decadal model results from initial conditions to 50 years into the future.",
  },
};
export const mapDefaults = {
  bounds: [-93.845, 29.09, -89.175, 30.395],
  padding: {
    top: 50,
    right: 50,
    bottom: 300,
    left: 50,
  },
};
export const printText = {
  group: {
    G500: "Future Without Action",
    G603: "Future With Action",
  },
  layer: {
    "Land Change": "Land Change from Initial Conditions",
    Projects: "Candidate Projects",
  },
  scenario: {
    S07: "Lower Project Selection Scenario",
    S08: "Higher Project Selection Scenario",
  },
};
