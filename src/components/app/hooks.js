import { useEffect, useState } from "preact/hooks";
import {
  fireEvent,
  getProjectResult,
  getProjectTypeResult,
  getRegionResult,
} from "../../utils";
import { projectTypes } from "./config";
import { getHashObject, getHashString } from "./hash";

const toFloat = (value) => parseFloat(value.replace(/[^0-9.]/g, ""));

export function useHashState(defaults, excluded = []) {
  const [value, setValue] = useState(getHashObject(defaults));

  const updateValue = (changes) => {
    const newValue = { ...value, ...changes };
    setValue(newValue);
    try {
      window.history.replaceState(
        window.history.state,
        "",
        getHashString(newValue, defaults, excluded)
      );
    } catch (SecurityError) {}
  };

  useEffect(() => {
    window.addEventListener(
      "hashchange",
      () => {
        const newValue = getHashObject(defaults);
        let changed =
          Object.keys(value).filter((k) => newValue[k] !== value[k]).length > 0;
        if (changed) setValue(newValue);
      },
      false
    );
  }, []);

  return [value, updateValue];
}

export function useHashVar(name, defaultValue) {
  const defaults = {};
  defaults[name] = defaultValue;
  const [obj, updateObj] = useHashState(defaults);
  const setValue = (value) => {
    const updates = {};
    updates[name] = value;
    updateObj(updates);
  };
  return [obj[name], setValue];
}

export function useLayers(services) {
  const [layers, setLayers] = useState(null);
  useEffect(() => {
    if (!services) return;
    const specs = {};
    for (let service of Object.values(services)) {
      if (
        service.name.startsWith("Base Map") ||
        service.name.startsWith("Damage")
      )
        continue;
      let [name, scenario, group, year, subtype] = service.name.split(" - ");
      let layer = (specs[name] = specs[name] || {
        name,
        groups: [],
        scenarios: [],
        subtypes: [],
        years: [],
      });
      layer.years.push(year.replace("Year ", ""));
      if (group && !layer.groups.includes(group)) layer.groups.push(group);
      if (scenario && !layer.scenarios.includes(scenario))
        layer.scenarios.push(scenario);
      if (subtype && !layer.subtypes.includes(subtype))
        layer.subtypes.push(subtype);
    }
    for (let layer of Object.values(specs))
      if (layer.subtypes)
        layer.subtypes.sort((a, b) => toFloat(a) - toFloat(b));

    specs["Projects"] = { name: "Projects", years: [] };
    specs["Damage"] = { name: "Projects", years: [] };
    setLayers(specs);
  }, [services]);
  return layers;
}

export function useProjects(projectsUrl) {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    (async () => {
      let res = await fetch(projectsUrl);
      let rows = (await res.text())
        .split("\n")
        .filter((row) => row.length)
        .map((row) =>
          row
            .split(/(?!\B"[^"]*),(?![^"]*"\B)/g)
            .map((cell) => cell.replace(/"/g, ""))
        );
      let headers = rows.shift();

      let allProjects = rows.map((row) => {
        let project = {};
        for (let i in headers) project[headers[i]] = row[i];
        project.select = () =>
          fireEvent("searchSelectResult", {
            result: getProjectResult(project),
          });
        return project;
      });
      setProjects(allProjects);
    })();
  }, [projectsUrl]);

  return projects;
}

export function useSearchIndex(projects) {
  const [searchIndex, setSearchIndex] = useState([]);
  useEffect(() => {
    const projectTypeItems = Object.keys(projectTypes).map((pt) =>
      getProjectTypeResult(pt, projectTypes)
    );
    const regions = [];
    const projectItems = (projects || []).map((project) => {
      if (!regions.includes(project.region)) regions.push(project.region);
      return getProjectResult(project);
    });
    regions.sort();
    const regionItems = regions.map(getRegionResult);
    setSearchIndex([...projectTypeItems, ...regionItems, ...projectItems]);
  }, [projects]);
  return searchIndex;
}

export function useServices(servicesUrl) {
  const [services, setServices] = useState(null);
  useEffect(() => {
    (async () => {
      let services = await fetch(servicesUrl);
      setServices(await services.json());
    })();
  }, [servicesUrl]);
  return services;
}
