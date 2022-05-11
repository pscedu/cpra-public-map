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

export const normalizeText = (text) =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, "");
