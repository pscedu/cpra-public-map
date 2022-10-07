import { createContext } from "preact";
import { computed, effect, signal } from "@preact/signals";
import { hashSignal } from "./hash";
import {
  fireEvent,
  getProjectResult,
  getProjectTypeResult,
  getRegionResult,
} from "./utils";
import * as config from "./config";

export function createState() {
  console.log("createState");
  // SIGNALS
  const group = hashSignal("group", "G500");
  const politicalBoundary = hashSignal("political-boundary", null);
  const scenario = hashSignal("scenario", "S07");
  const showProjects = hashSignal(
    "show-stations",
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
  const selection = signal({});
  const printing = signal(false);
  const projects = signal([]);
  const services = signal(null);

  // COMPUTED SIGNALS
  const projectMap = computed(() => {
    const projectMap = {};
    projects.value.forEach((proj) => (projectMap[proj.name] = proj));
    return projectMap;
  });

  const project = computed(() => projectMap[selection.value.project]);

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
      project.select = () =>
        fireEvent("searchSelectResult", {
          result: getProjectResult(project),
        });
      return project;
    });
  });

  // Load services.
  effect(async () => {
    const res = await fetch(config.servicesUrl);
    services.value = await res.json();
  });

  // useLayoutEffect(() => {
  //   fireEvent("mapResize");
  // }, [drawerOpen]);

  // const prevSubypes = {};
  // const selectValue = (values, currentValue) => {
  //   if (values.includes(currentValue) || !values.length) return currentValue;
  //   return values[0];
  // };

  //   if (mapState.subtype) prevSubypes[layer] = mapState.subtype;
  //   let year = currentSlide.props.year || mapState.year;
  //   if (mapState.view !== "projects" && mapState.view !== "slide-0")
  //     year = Math.floor(year / 10) * 10;
  //   updateMapState({
  //     group: selectValue(
  //       layer.groups || [],
  //       currentSlide.props.group || mapState.group
  //     ),
  //     scenario: selectValue(
  //       layer.scenarios || [],
  //       currentSlide.props.scenario || mapState.scenario
  //     ),
  //     subtype:
  //       (layer.subtypes || []).length > 0
  //         ? prevSubypes[layer.name] || layer.subtypes[0]
  //         : null,
  //     year,
  //   });
  // }, [currentIdx]);

  // FUNCTIONS
  const setStorySlide = (idx) =>
    (viewName.value = idx === null ? "land-change" : `slide-${idx}`);

  const startTour = () => {
    fireEvent("searchClearResult");
    fireEvent("mapFitBounds", {
      bounds: config.mapDefaults.bounds,
      options: {
        padding: config.mapDefaults.padding,
      },
    });
    setStorySlide(0);
    // gtag("event", "tutorial_begin");
  };

  const endTour = () => setStorySlide(null);

  const clearProject = (e) => {
    e.preventDefault();
    fireEvent("searchClearResult");
  };

  return {
    clearProject,
    drawerOpen,
    endTour,
    group,
    introOpen,
    map,
    politicalBoundary,
    printing,
    project,
    projectMap,
    projects,
    scenario,
    searchIndex,
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
