export const fireEvent = (name, detail) => {
  const event = new CustomEvent(name, { detail });
  window.dispatchEvent(event);
};

export const getProjectResult = (project) => {
  return {
    type: "project",
    name: project.name,
    category: "Project",
    haystack: normalizeText(project.name),
    bounds: [project.xmin, project.ymin, project.xmax, project.ymax].map(
      parseFloat
    ),
    selection: {
      project: project.project_id,
    },
  };
};

export const getProjectTypeResult = (typeKey, projectTypes) => {
  return {
    type: "project-type",
    name: projectTypes[typeKey],
    category: "Project Type",
    haystack: normalizeText(projectTypes[typeKey]),
    selection: {
      projectType: typeKey,
    },
  };
};

export const getRegionResult = (region) => {
  return {
    type: "region",
    name: region,
    category: "Region",
    haystack: normalizeText(region),
    selection: { region },
  };
};

export const normalizeText = (text) =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, "");
