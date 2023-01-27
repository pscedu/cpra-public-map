import { catalogSchema as levels } from "../helpers/config";

function makeCatalogEntries(service) {
  const entries = [];
  const parts = service.url.split("/").pop().split("_");
  if (service.url.match(/MP2023_/g)) {
    const year = parseInt(parts[9], 10);
    entries.push({
      aep: parts[12] == "aep" ? parseFloat(parts[11]).toFixed(1) : null,
      damage: null,
      group: { G500: "fwoa", G516: "fwa", G520: "fwoa", G521: "fwa" }[parts[2]],
      layer: {
        depths50: "flood-depth",
        FFIBS: "vegetation-type",
        lndchg: "land-change",
        lndtypdiff: "land-change",
      }[parts[13] || parts[11]],
      scenario: { S07: "lower", S08: "higher" }[parts[1]],
      serviceType: "raster",
      url: service.url,
      year: parts[10] == "CLARA" ? (year == 1 ? 0 : year) : year - 2,
    });
    // Create entries for land change year 0, since they don't have a raster image.
    if (entries[0].year === 10 && entries[0].layer === "land-change")
      entries.push({
        ...entries[0],
        serviceType: null,
        url: null,
        year: 0,
      });
  } else if (service.url.match(/historical_land_change/g)) {
    entries.push({
      aep: null,
      damage: null,
      group: null,
      layer: "historical-land-change",
      scenario: null,
      serviceType: "raster",
      url: service.url,
      year: parseInt(parts[3], 10),
    });
  } else if (service.url.match(/damage-vector/g)) {
    for (let year = 0; year <= 50; year += 10) {
      for (let group of ["fwoa", "fwa"]) {
        for (let scenario of ["lower", "higher"]) {
          for (let damage of ["eadd", "easd"]) {
            entries.push({
              aep: null,
              damage,
              group,
              layer: "damage",
              scenario,
              serviceType: "vector",
              url: service.url,
              vectorProperty: [
                damage == "eadd" ? "ead" : "easd",
                scenario == "lower" ? "s07" : "s08",
                group == "fwoa" ? "g500" : "g516",
                `year${year}`,
              ].join("_"),
              year,
            });
          }
        }
      }
    }
  } else if (service.url.match(/basemap-vector/g)) {
    for (let year = 0; year < 51; year++)
      entries.push({
        aep: null,
        damage: null,
        group: null,
        layer: "projects",
        scenario: null,
        serviceType: "vector",
        url: service.url,
        year,
      });
  }
  return entries;
}

export function buildCatalog(services) {
  const choicesCache = {};
  const index = {};
  const entries = {};

  // The levelObjRefs array is used to assign an index to a level object in the
  // catalog tree. This index is used as a key in the choicesCache object, since
  // objects cannot be used as keys in another object.
  const levelObjRefs = [];

  // Iterate over groups and group members.
  for (let service of services) {
    for (let entry of makeCatalogEntries(service)) {
      // Add the layer to the layers object, which is indexed by the GeoServer
      // layer name.
      entries[entry.id] = entry;

      // Build/traverse the catalog index, and insert the new entry.
      let current = index;
      for (let level of levels.slice(0, levels.length - 1)) {
        const value = entry[level.prop];
        current[value] = current[value] || {};
        current = current[value];
      }
      current[entry[levels[levels.length - 1].prop]] = entry;
    }
  }

  console.log(index);

  const getChoices = (obj, level) => {
    if (!levelObjRefs.includes(obj)) levelObjRefs.push(obj);
    const ref = levelObjRefs.indexOf(obj);
    if (choicesCache[ref] === undefined)
      choicesCache[ref] = Object.keys(obj).sort(level.sort);
    return choicesCache[ref];
  };

  const select = (options = {}, levelProp) => {
    let current = index;
    for (let level of levels) {
      if (levelProp === level.prop) return current;
      current =
        current[options[level.prop]] ||
        current[level.default] ||
        current[getChoices(current, level)[0]];
    }
    return current;
  };

  const choices = (options, level) => {
    const current = select(options, level.prop);
    return getChoices(current, level);
  };

  const get = (id) => entries[id];
  return { choices, get, select };
}
