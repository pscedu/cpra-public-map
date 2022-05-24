import { useEffect, useState } from "preact/hooks";
import {
  fireEvent,
  getProjectResult,
  getProjectTypeResult,
  getRegionResult,
} from "../../utils";
import { projectTypes } from "./config";

const toFloat = (value) => parseFloat(value.replace(/[^0-9.]/g, ""));

export function useModelLayers(services) {
  const [modelLayers, setModelLayers] = useState(null);
  useEffect(() => {
    if (!services) return;
    const layers = {};
    for (let service of Object.values(services)) {
      if (service.name.indexOf("Base Map") != -1) continue;
      let [name, year, subtype] = service.name.split(" - ");
      let layer = (layers[name] = layers[name] || {
        name,
        subtypes: [],
        years: [],
      });
      layer.years.push(year.replace("Year ", ""));
      if (subtype && !layer.subtypes.includes(subtype))
        layer.subtypes.push(subtype);
    }
    for (let layer of Object.values(layers))
      if (layer.subtypes)
        layer.subtypes.sort((a, b) => toFloat(a) - toFloat(b));
    setModelLayers(layers);
  }, [services]);
  return modelLayers;
}

export function useProjects(projectsUrl) {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    (async () => {
      let res = await fetch(projectsUrl);
      let rows = (await res.text())
        .split("\n")
        .filter((row) => row.length)
        .map((row) => row.split(","));
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
