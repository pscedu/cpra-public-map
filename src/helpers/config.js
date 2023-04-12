// Descending sort function for catalog levels.
const sortDesc = (a, b) => (a < b ? 1 : -1);
// Catalog level definition objects.
export const catalogSchema = [
  {
    prop: "layer",
    name: "Layer",
    format: (value) =>
      ({
        damage: "Damage",
        "flood-depth": "Flood Depth",
        "land-change": "Land Change",
        projects: "Projects",
        "vegetation-type": "Vegetation Type",
      }[value]),
  },
  {
    prop: "group",
    name: "Plan Implementation Scenario",
    format: (value) =>
      ({
        fwoa: "Without Plan",
        fwa: "With Plan",
      }[value]),
    sort: sortDesc,
  },
  {
    prop: "scenario",
    name: "Environmental Scenario",
    format: (value) =>
      ({
        lower: "Lower",
        higher: "Higher",
      }[value]),
    sort: sortDesc,
  },
  {
    prop: "aep",
    name: "Annual Exceedance Probability",
    format: (value) => (value ? value.toString() : ""),
    sort: (a, b) => (parseFloat(a) < parseFloat(b) ? 1 : -1),
  },
  {
    prop: "damage",
    name: "Damage Metric",
    format: (value) =>
      ({
        eadd: "Dollars",
        easd: "Structures",
      }[value]),
  },
  {
    prop: "vegetation",
    name: "Vegetation Index",
    format: (value) =>
      ({
        ffibs: "FFIBS",
        vct: "VCT",
      }[value]),
  },
  {
    prop: "year",
    name: "Year",
    sort: (a, b) => (parseInt(a, 10) > parseInt(b, 10) ? 1 : -1),
  },
];
// Transform the catalog schema array into an object indexed by property name.
export const catalogLevels = catalogSchema.reduce(
  (obj, level) => ({ ...obj, [level.prop]: level }),
  {}
);
const colorSwatch = (color) =>
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' " +
  `width='50' height='20'><rect fill='${color.replace(
    "#",
    "%23"
  )}' x='0' y='0' height='20' width='50' /></svg>`;
export const serviceBaseUrl = "https://tiles.mpdv.coastal.la.gov/services";
export const servicesUrl = "/services.json";
export const projectListUrl = "/projects.csv";
export const projectFactSheetBaseUrl =
  "https://coastal.la.gov/wp-content/uploads/2023/01/";
export const searchIndexUrl = "/search.csv";
export const geocodeUrl = "https://mpdv.coastal.la.gov/nominatim/search";
export const websiteUrl =
  "https://coastal.la.gov/our-plan/2023-coastal-master-plan/";
export const contactEmail = ["mai", ["masterplan", "la.gov"].join("@")].join(
  "lto:"
);
export const maxBounds = [-91.215 - 5, 29.41 - 3.5, -91.215 + 5, 29.41 + 3.5];
export const projectLayers = [
  "project-polygon-di",
  "project-polygon-di-outline",
  "project-polygon-lb",
  "project-polygon-mc",
  "project-line-bs",
  "project-line-sr",
  "project-line-di-hr",
  "project-line-rr",
  "project-line-sp",
  "project-point-di-hr",
  "project-point-sr",
  "project-icon",
  "project-icon-dot",
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
export const regions = {
  ba: "Barataria",
  cc: "Central Coast",
  ch: "Chenier Plain",
  po: "Pontchartrain",
  te: "Terrebonne",
};
export const regionsLookup = Object.keys(regions).reduce(
  (obj, k) => ({ ...obj, [regions[k]]: k }),
  {}
);
export const legends = {
  eadd: {
    title: "Damage: EADD",
    images: [
      "#DDC5E0",
      "#CCAAD1",
      "#B282BA",
      "#A064A9",
      "#5D4795",
      "#423575",
      "#221F53",
    ].map(colorSwatch),
    labels: [
      "$0 to < $1M",
      "$1M to < $10M",
      "$10M to < $50M",
      "$50M to < $100M",
      "$100M to < $500M",
      "$500M to < $1B",
      "$1B or more",
    ],
  },
  easd: {
    title: "Damage: EASD",
    images: [
      "#FEDB9E",
      "#FBBC76",
      "#F7903B",
      "#F36F41",
      "#DC4840",
      "#BA233E",
      "#701231",
    ].map(colorSwatch),
    labels: [
      "0 to 49",
      "50 to 99",
      "100 to 249",
      "250 to 499",
      "500 to 999",
      "1,000 to 4,999",
      "5,000 or more",
    ],
  },
  "flood-depth": {
    title: "Flood Depth",
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
  "historical-land-change": {
    title: "Historical Land Change",
    images: ["#4591ac", "#265118"].map(colorSwatch),
    labels: ["Persistent Land Loss", "Persistent Land Gain"],
  },
  "land-change": {
    title: "Land Change",
    images: ["#4591ac", "#00f0f0", "#99c104", "#265118"].map(colorSwatch),
    labels: ["Land Loss", "Induced Loss", "Land Maintained", "Land Gain"],
  },
  projects: {
    title: "Projects",
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
  ffibs: {
    title: "Vegetation Type: FFIBS",
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
  vct: {
    title: "Vegetation Type: VCT",
    images: [
      "#a6cecf",
      "#1f78b4",
      "#b2df8a",
      "#5ba02c",
      "#fb9a99",
      "#e31a1c",
      "#fdbf6f",
      "#ff7f00",
      "#cab2d6",
      "#6a3d9a",
      "#ffff99",
      "#005a00",
      "#ff80ff",
      "#7f5f1e",
      "#8cf0f0",
    ].map(colorSwatch),
    labels: [
      "Maidencane",
      "Three-Square",
      "Rosseau Cane",
      "Paspalum",
      "Wiregrass",
      "Bulltongue",
      "Needlerush",
      "Bulrush",
      "Brackish Mix",
      "Oystergrass",
      "Saltgrass",
      "Bottomland Hardwood Forest + Swamp Forest",
      "Barrier Island Vegetation",
      "Unvegetated",
      "Flotant",
    ],
  },
};

export const views = {
  "land-change": {
    title: "Land Change",
    layer: "land-change",
  },
  "vegetation-type": {
    title: "Vegetation Type",
    layer: "vegetation-type",
  },
  "flood-depth": {
    title: "Flood Depth",
    layer: "flood-depth",
  },
  damage: {
    title: "Damage",
    layer: "damage",
  },
  projects: {
    title: "Projects",
    layer: "projects",
  },
  "slide-0": {
    title: "A History of Change",
    layer: "historical-land-change",
    group: "fwoa",
    scenario: "lower",
    year: 1932,
  },
  "slide-1": {
    title: "A Continuing Crisis",
    layer: "land-change",
    group: "fwoa",
    scenario: "lower",
    year: 0,
  },
  "slide-2": {
    title: "Land Change Without Action",
    layer: "land-change",
    group: "fwoa",
    scenario: "lower",
    year: 0,
  },
  "slide-3": {
    title: "Flood Depth Without Action",
    layer: "flood-depth",
    group: "fwoa",
    scenario: "lower",
    aed: "10.0",
    year: 0,
  },
  "slide-4": {
    title: "Expected Annual Damage Without Action",
    layer: "damage",
    group: "fwoa",
    scenario: "lower",
    damage: "eadd",
    year: 0,
  },
  "slide-5": {
    title: "Taking Action",
    layer: "projects",
    year: 0,
  },
  "slide-6": {
    title: "Land Change With the Master Plan",
    layer: "land-change",
    group: "fwa",
    scenario: "lower",
    year: 0,
  },
  "slide-7": {
    title: "Flood Depth With the Master Plan",
    layer: "flood-depth",
    group: "fwa",
    scenario: "lower",
    aep: "10.0",
    year: 0,
  },
  "slide-8": {
    title: "Expected Annual Damage With the Master Plan",
    layer: "damage",
    group: "fwa",
    scenario: "lower",
    damage: "eadd",
    year: 0,
  },
  "slide-9": {
    title: "Time to Explore",
    layer: "projects",
    year: 50,
  },
};
export const controls = {
  aep: {
    type: "buttons",
    label: "Annual Exceedance Probability",
    tooltip:
      "<p>To estimate future flooding potential, we included a range of storm intensities, sizes, and landfall locations across the coast. This information, along with the relative likelihood of each storm occurring, gave us a rough idea of how flooding could occur across Louisiana’s coast over the next 50 years.</p><p>To put these figures in context, Hurricane Katrina (2005) produced storm surge that rated as a 100-year event in Plaquemines and St Bernard Parish, while as a 50-year event in Orleans Parish. Hurricane Rita (2005) produced storm surge that rated as 100-year event in Terrebonne, St. Mary, and Vermillion. Hurricane Ike (2008) produced a storm surge that rated as a 50-year event in Cameron Parish.</p>",
  },
  damage: {
    type: "buttons",
    label: "Damage Metric",
    tooltip:
      "<p>Future storm surge-based flooding damages can be estimated by considering flood depths and the number and type of assets flooded in events across the coast. The cost of these damages in dollars is called Estimated Annual Damages, Dollars or EADD. Another way to quantify damages is to count how many whole and partial structures are damaged from an event and sum them to determine Estimated Annual Structural Damage, or EASD.</p><p>Both damage metrics are projected over time and for different scenarios and event AEPs.</p>",
  },
  group: {
    type: "buttons",
    label: "Plan Implementation Scenario",
    tooltip:
      "<p>Select <strong>Without Plan</strong> to look at model outputs projecting the future if we do not implement any of the projects recommended in the 2023 Coastal Master Plan. Select <strong>With Plan</strong> to look at model outputs with the final plan projects in place.</p>",
  },
  projects: {
    type: "checkbox",
    level: "showProjects",
    label: "Show plan projects",
    disabled: (state) => state.group.value === "fwoa",
  },
  scenario: {
    type: "buttons",
    label: "Environmental Scenario",
    tooltip:
      "<p>Because we don&apos;t know what the future will bring, the 2023 Coastal Master Plan developed different environmental scenarios to capture possible coastal conditions. These scenarios reflect the different ways that future conditions could affect our ability to protect communities and build land.</p><p><strong>Lower Scenario:</strong> Assumes moderate changes in the factors over the next 50 years, including moderate rates of sea level rise and subsidence.</p><p><strong>Higher Scenario:</strong> Assumes more dramatic changes in the factors over the next 50 years, particularly higher rates of sea level rise and subsidence.</p><p>Factors included in future environmental scenarios: Sea level rise, subsidence, storm intensity, rainfall, tributary hydrology, temperature, and evapotranspiration.</p><p>More information on the environmental scenarios used for project selection in the 2023 Coastal Master Plan can be found in Appendix B.</p>",
  },
  vegetation: {
    type: "buttons",
    label: "Vegetation Index",
    tooltip:
      "<p>Wetland vegetation is responsive to changes in the environment, such as increases to salinity or inundation levels over time. Over 50 years the distribution of different wetland vegetation classes will shift and change, impacting habitats and ecosystems. The projects selected for the 2023 Coastal Master Plan support a variety of vegetation types coastwide.</p>",
  },
  year: {
    type: "year",
    label: "Year",
    tooltip:
      "<p>Use the time slider to explore model outputs from initial conditions to 50 years into the future. Data is available at 10-year increments.</p>",
  },
  yearimplementation: {
    type: "year",
    level: "year",
    label: "Implementation Year",
    tooltip:
      "<p>Use the time slider to view projects planned for the selected range of years.</p>",
  },
};
export const mapDefaults = {
  bounds: [-93.845, 29.09, -89.175, 30.395],
};
export const layerExtents = {
  lash: [-94.043357, 28.855122, -88.758384, 33.01962],
  lass: [-94.043357, 28.855122, -88.758384, 33.01962],
  parish: [-94.043357, 28.855122, -88.758384, 33.01962],
  region: [-93.929393, 28.854357, -88.758337, 30.482013],
  uscd: [-94.043357, 28.855122, -88.758384, 33.01962],
};
export const printText = {
  group: {
    fwoa: "Future Without Action",
    fwa: "Future With Action",
  },
  layer: {
    damage: "Damage",
    "flood-depth": "Flood Depth",
    "land-change": "Land Change from Initial Conditions",
    projects: "Plan Projects",
    "vegetation-type": "Vegetation Type",
  },
  scenario: {
    lower: "Lower Environmental Scenario",
    higher: "Higher Environmental Scenario",
  },
};

export const searchExcludedCategories = ["railway"];
