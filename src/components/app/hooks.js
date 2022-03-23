import { useEffect, useState } from "preact/hooks";

const normalizeText = (text) => text.toLowerCase().replace(/[^a-z0-9 ]/g, "");

export function useProjects(projectsUrl) {
  const [projects, setProjects] = useState([]);
  const [projectFilters, setProjectFilters] = useState({
    name: "",
  });
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
        return project;
      });

      setProjects(allProjects);
    })();
  }, [projectsUrl]);

  let needles = normalizeText(projectFilters.name)
    .split(" ")
    .filter((part) => part.length);

  let filteredProjects = projects.filter((project) => {
    if (needles.length == 0) return true;
    let haystack = normalizeText(project.name);
    for (let needle of needles)
      if (haystack.indexOf(needle) === -1) return false;
    return true;
  });

  return [filteredProjects, projectFilters, setProjectFilters];
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
