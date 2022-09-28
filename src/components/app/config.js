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
export const views = {
  "land-change": {
    title: "Land Change",
    layer: "Land Change",
  },
  "vegetation-type": {
    title: "Vegetation Type",
    layer: "Vegetation Type",
  },
  "flood-depth": {
    title: "Flood Depth",
    layer: "Flood Depth",
  },
  damage: {
    title: "Damage",
    layer: "Damage",
  },
  projects: {
    title: "Projects",
    layer: "Projects",
  },
  "slide-0": {
    title: "Introduction",
    layer: "Historical Land Change",
  },
  "slide-1": {
    title: "Environmental Change Over Time",
    layer: "Land Change",
  },
  "slide-2": {
    title: "Land Change",
    layer: "Land Change",
  },
  "slide-3": {
    title: "Flood Depths",
    layer: "Flood Depth",
  },
  "slide-4": {
    title: "Damage",
    layer: "Damage",
  },
  "slide-5": {
    title: "Projects",
    layer: "Projects",
  },
  "slide-6": {
    title: "Land Change",
    layer: "Land Change",
  },
  "slide-7": {
    title: "Flood Depths",
    layer: "Flood Depth",
  },
  "slide-8": {
    title: "Damage",
    layer: "Damage",
  },
  "slide-9": {
    title: "Navigating the Candidate Project Map",
    layer: "Projects",
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
