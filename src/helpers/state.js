import { createContext } from "preact";
import { batch, computed, effect, signal } from "@preact/signals";
import bbox from "@turf/bbox";
import { hashSignal } from "./hash";
import {
  getLocalResults,
  getMapPadding,
  getOsmResults,
  getOsmSelection,
  getProjectResult,
  getProjectTypeResult,
  getRegionResult,
  gtag,
  internal,
  selectValue,
} from "./utils";
import * as config from "./config";

export function createState() {
  // SIGNALS
  const group = hashSignal("group", "G500");
  const politicalBoundary = hashSignal("political-boundary", null);
  const scenario = hashSignal("scenario", "S07");
  const showProjects = hashSignal(
    "show-projects",
    true,
    (val) => (val ? "true" : "false"),
    (val) => val === "true"
  );
  const subtype = hashSignal("subtype", null);
  const viewName = hashSignal("view", "slide-0");
  const year = hashSignal("year", 50, (val) => val.toString(), parseInt);

  const drawerOpen = signal(true);
  const introOpen = signal(viewName.peek() === "slide-0");
  const map = signal(null);
  const printing = signal(false);
  const projects = signal([]);
  const searchResult = signal(null);
  const searchResults = signal([]);
  const searchText = signal("");
  const services = signal(null);

  // COMPUTED SIGNALS
  const projectMap = computed(() => {
    const projectMap = {};
    projects.value.forEach((proj) => (projectMap[proj.name] = proj));
    return projectMap;
  });

  const project = computed(() => projectMap[selection.value.project]);

  const selection = computed(() =>
    searchResult.value
      ? searchResult.value.selection ||
        getOsmSelection(searchResult.value.details)
      : {}
  );

  const searchIndex = computed(() => {
    const projectTypeItems = Object.keys(config.projectTypes).map((pt) =>
      getProjectTypeResult(pt, config.projectTypes)
    );
    const regions = [];
    const projectItems = (projects.value || []).map((project) => {
      if (!regions.includes(project.region)) regions.push(project.region);
      return getProjectResult(project);
    });
    regions.sort();
    const regionItems = regions.map(getRegionResult);
    return [...projectTypeItems, ...regionItems, ...projectItems];
  });

  const storySlide = computed(() =>
    viewName.value.startsWith("slide-")
      ? parseInt(viewName.value.replace("slide-", ""), 10)
      : null
  );

  const view = computed(() => config.views[viewName]);

  // EFFECTS
  // Load projects from CSV.
  effect(async () => {
    const res = await fetch(config.projectListUrl);
    const rows = (await res.text())
      .split("\n")
      .filter((row) => row.length)
      .map((row) =>
        row
          .split(/(?!\B"[^"]*),(?![^"]*"\B)/g)
          .map((cell) => cell.replace(/"/g, ""))
      );
    const headers = rows.shift();

    projects.value = rows.map((row) => {
      let project = {};
      for (let i in headers) project[headers[i]] = row[i];
      project.select = (type) => {
        if (type === "type") {
          searchResult.value = getProjectTypeResult(
            project.type,
            config.projectTypes
          );
        } else if (type === "region") {
          searchResult.value = getRegionResult(project.region);
        } else {
          searchResult.value = getProjectResult(project);
        }
      };
      return project;
    });
  });

  // Load services.
  effect(async () => {
    const res = await fetch(config.servicesUrl);
    services.value = await res.json();
  });

  // Synchronize layer signals with available choices.
  const prevSubypes = {};
  effect(() => {
    const layer = view.value.layer;
    if (subtype.value) prevSubypes[viewName.value] = subtype.value;
    batch(() => {
      group.value = selectValue(layer.groups, view.value.group || group.value);
      scenario.value = selectValue(
        layer.scenarios,
        view.value.scenario || scenario.value
      );
      subtype.value = selectValue(
        layer.subtypes,
        view.value.subtype || subtype.value || prevSubypes[layer.name]
      );
      year.value = selectValue(layer.years, view.value.year || year.value);
    });
  });

  // Perform a search when text changes.
  effect(async () => {
    const url = new URL(config.geocodeUrl);
    url.searchParams.append("q", searchText.value);
    url.searchParams.append("addressdetails", "1");
    url.searchParams.append("polygon_geojson", "1");
    const req = fetch(url.toString());
    const results = getLocalResults(searchText.value, searchIndex.value);
    const res = await req;
    results.push(
      ...getOsmResults(await res.json(), config.searchExcludedCategories)
    );
    searchResults.value = results.slice(0, 5);
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
      setStorySlide(null);
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

  const setStorySlide = (idx) =>
    (viewName.value = idx === null ? "land-change" : `slide-${idx}`);

  const startTour = () => {
    batch(() => {
      searchResult.value = null;
      drawerOpen.value = true;
      setStorySlide(0);
    });
    mapFitBounds(config.mapDefaults.bounds);
  };

  return {
    clearProject,
    clearSearch,
    drawerOpen,
    endTour,
    group,
    introOpen,
    map,
    mapFitBounds,
    mapResize,
    politicalBoundary,
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
    setStorySlide,
    showProjects,
    startTour,
    storySlide,
    subtype,
    view,
    viewName,
    year,
  };
}

export const State = createContext();
