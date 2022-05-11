import { useEffect, useState } from "preact/hooks";
import { fireEvent, getProjectResult, normalizeText } from "../../utils";
import { projectTypes } from "./config";

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
    const projectTypeItems = Object.keys(projectTypes).map((typeKey) => {
      return {
        type: "project-type",
        name: projectTypes[typeKey],
        category: "Project Type",
        haystack: normalizeText(projectTypes[typeKey]),
        selection: {
          projectType: typeKey,
        },
      };
    });
    const regions = [];
    const projectItems = (projects || []).map((project) => {
      if (!regions.includes(project.region)) regions.push(project.region);
      return getProjectResult(project);
    });
    regions.sort();
    const regionItems = regions.map((region) => {
      return {
        type: "region",
        name: region,
        category: "Region",
        haystack: normalizeText(region),
        selection: { region },
      };
    });
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
