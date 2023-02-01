import { createContext } from "preact";
import { batch, computed, effect, signal } from "@preact/signals";
import bbox from "@turf/bbox";
import Fuse from "fuse.js";
import { hashSignal } from "./hash";
import { getStyle } from "./mapstyle";
import {
  fetchCSV,
  getLocalResults,
  getMapPadding,
  getOsmResults,
  getOsmSelection,
  gtag,
  internal,
} from "./utils";
import * as config from "./config";
import { buildCatalog } from "./catalog";

let layerInfoCache = null;

export function createState() {
  // SIGNALS
  const aep = hashSignal("aep", "0.2");
  const damage = hashSignal("damage", "eadd");
  const group = hashSignal("group", "fwoa");
  const scenario = hashSignal("scenario", "lower");
  const showProjects = hashSignal(
    "show-projects",
    true,
    (val) => (val ? "true" : "false"),
    (val) => val === "true"
  );
  const viewName = hashSignal("view", "slide-0");
  const year = hashSignal("year", 50, (val) => val.toString(), parseInt);

  const catalog = signal(null);
  const drawerOpen = signal(true);
  const introOpen = signal(viewName.peek() === "slide-0");
  const map = signal(null);
  const prevEntry = signal(null);
  const printing = signal(false);
  const projects = signal([]);
  const searchIndex = signal([]);
  const searchResult = signal(null);
  const searchResults = signal([]);
  const searchText = signal("");
  const services = signal(null);

  // COMPUTED SIGNALS
  const entry = computed(() => {
    if (!catalog.value || !view.value) return null;
    return catalog.value.select({
      aep: aep.value,
      damage: damage.value,
      group: group.value,
      layer: view.value.layer,
      scenario: scenario.value,
      year: year.value,
    });
  });

  const fuse = computed(() =>
    searchIndex.value.length
      ? new Fuse(searchIndex.value, {
          keys: [
            { name: "name", weight: 0.8 },
            { name: "category", weight: 0.2 },
          ],
        })
      : null
  );

  const projectMap = computed(() => {
    const projectMap = {};
    projects.value.forEach((proj) => (projectMap[proj.displayId] = proj));
    return projectMap;
  });

  const project = computed(() => projectMap.value[selection.value.project]);

  const searchIndexMap = computed(() => {
    const result = {};
    searchIndex.value.forEach((row) => (result[row.id] = row));
    return result;
  });

  const selection = computed(() =>
    searchResult.value
      ? searchResult.value.selection ||
        getOsmSelection(searchResult.value.details)
      : {}
  );

  const storySlide = computed(() =>
    viewName.value.startsWith("slide-")
      ? parseInt(viewName.value.replace("slide-", ""), 10)
      : null
  );

  const view = computed(() => config.views[viewName]);

  // EFFECTS
  // Load projects from CSV.
  effect(async () => (projects.value = await fetchCSV(config.projectListUrl)));

  // Load search index from CSV.
  effect(async () => {
    const rows = await fetchCSV(config.searchIndexUrl);
    searchIndex.value = rows.map((row) => {
      const [idKey, idValue] = row.id.split(":");
      return {
        id: row.id,
        type: idKey,
        category: row.type,
        name: row.name,
        bounds: [row.xmin, row.ymin, row.xmax, row.ymax],
        selection: {
          [idKey]: idValue,
        },
      };
    });
  });

  // Load services.
  effect(async () => {
    const res = await fetch(config.servicesUrl);
    services.value = await res.json();
    catalog.value = buildCatalog(services.value);
  });

  // Perform a search when text changes.
  effect(async () => {
    const url = new URL(config.geocodeUrl);
    url.searchParams.append("q", searchText.value);
    url.searchParams.append("addressdetails", "1");
    url.searchParams.append("polygon_geojson", "1");
    const req = fetch(url.toString());
    const results = getLocalResults(searchText.value, fuse.value);
    const res = await req;
    results.push(
      ...getOsmResults(await res.json(), config.searchExcludedCategories)
    );
    searchResults.value = results.slice(0, 8);
  });

  // Update the map and search results when the selected search result changes.
  effect(() => {
    const result = searchResult.value;
    batch(() => {
      if (result) {
        let bounds = result.bounds;
        if (selection.value.polygon) bounds = bbox(selection.value.polygon);
        if (bounds) mapFitBounds(bounds);
        if (result.type === "project") drawerOpen.value = true;
        gtag("event", "select_content", {
          content_type: (result.category || "OSM").toLowerCase(),
          item_id: result.name,
        });
      } else {
        // Reset search when the result is cleared.
        searchText.value = "";
      }
      searchResults.value = [];
    });
  });

  // Track analytics when the view changes.
  const baseUrl = window.location.href.replace(window.location.hash, "");
  let analyticsStarted = false;
  effect(() => {
    if (!analyticsStarted) {
      // Send initial analytics configuration.
      gtag("js", new Date());
      gtag("config", "G-B9C4QG8HKV", {
        debug_mode: internal,
        send_page_view: false,
        traffic_type: internal ? "internal" : "external",
      });
      analyticsStarted = true;
    }
    // Generate an analytics page view when the view changes.
    gtag("set", "page_location", `${baseUrl}#view=${viewName.value}`);
    gtag("set", "page_title", config.views[viewName.value].title);
    gtag("event", "page_view");
    if (viewName.value === "slide-0") gtag("event", "tutorial_begin");
    if (viewName.value === "slide-9") gtag("event", "tutorial_complete");
  });

  // Store information about the previous layer.
  // effect(() => {
  //   prevLayerInfo.value = (view.value.layer.nullYears || []).includes(
  //     year.value
  //   )
  //     ? null
  //     : layerInfoCache;
  //   layerInfoCache = [
  //     view.value.layer,
  //     scenario.value,
  //     group.value,
  //     year.value,
  //     subtype.value,
  //   ];
  // });

  // Add map event handlers.
  effect(() => {
    if (!map.value) return;

    // Unset the previous layer when the map becomes idle.
    map.value.on("idle", () => (prevEntry.value = null));

    // Set layer click handlers.
    ["search-screen", "search-inner", "search-outer"].forEach((layer) =>
      map.value.on("click", layer, () => clearSearch())
    );
    config.projectLayers.forEach((layerName) => {
      map.value.on(
        "click",
        layerName,
        (e) =>
          (searchResult.value =
            searchIndexMap.value[
              `project:${e.features[0].properties.display_id}`
            ])
      );
      map.value.on(
        "mousemove",
        layerName,
        () => (map.value.getCanvas().style.cursor = "pointer")
      );
      map.value.on(
        "mouseleave",
        layerName,
        () => (map.value.getCanvas().style.cursor = "")
      );
    });
  });

  // Update the map style when the state changes.
  effect(() => {
    if (map.value)
      map.value.setStyle(
        getStyle({
          entry,
          prevEntry,
          selection,
          services,
          showProjects,
        })
      );
  });

  // FUNCTIONS
  const clearProject = (e) => {
    e.preventDefault();
    searchResult.value = null;
  };

  const clearSearch = () => {
    batch(() => {
      searchResult.value = null;
      searchText.value = "";
      searchResults.value = [];
    });
  };

  const endTour = () => {
    batch(() => {
      drawerOpen.value = true;
      setView("land-change");
    });
  };

  const mapFitBounds = (bounds) => {
    if (map.value)
      map.value.fitBounds(bounds, {
        padding: getMapPadding(),
      });
  };

  const mapResize = () => {
    if (map.value) map.value.resize();
  };

  const setSearchResult = (key) => {
    searchResult.value = searchIndexMap.value[key] || null;
  };

  const setView = (targetViewName) => {
    const view = config.views[targetViewName];
    batch(() => {
      viewName.value = targetViewName;
      if (view.aep !== undefined) aep.value = view.aep;
      if (view.damage !== undefined) damage.value = view.damage;
      if (view.group !== undefined) group.value = view.group;
      if (view.scenario !== undefined) scenario.value = view.scenario;
      if (view.year !== undefined) year.value = view.year;
    });
  };

  const startTour = () => {
    batch(() => {
      searchResult.value = null;
      drawerOpen.value = true;
      setView("slide-0");
    });
    mapFitBounds(config.mapDefaults.bounds);
  };

  return {
    aep,
    catalog,
    clearProject,
    clearSearch,
    damage,
    drawerOpen,
    endTour,
    entry,
    fuse,
    group,
    introOpen,
    map,
    mapFitBounds,
    mapResize,
    printing,
    project,
    projectMap,
    projects,
    scenario,
    searchIndex,
    searchResult,
    searchResults,
    searchText,
    selection,
    services,
    setSearchResult,
    setView,
    showProjects,
    startTour,
    storySlide,
    view,
    viewName,
    year,
  };
}

export const State = createContext();
