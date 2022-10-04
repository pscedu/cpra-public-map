import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { fireEvent, getProjectTypeResult, getRegionResult } from "../../utils";
import style from "./style.css";

const ProjectList = ({ projects, projectTypeDescriptions, projectTypes }) => {
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const selectProject = (e, project) => {
    e.preventDefault();
    project.select();
  };

  const selectProjectType = (e, project) => {
    e.preventDefault();
    fireEvent("searchSelectResult", {
      result: getProjectTypeResult(project.type, projectTypes),
    });
  };

  const selectRegion = (e, project) => {
    e.preventDefault();
    fireEvent("searchSelectResult", {
      result: getRegionResult(project.region),
    });
  };

  const projectRows = filteredProjects.map((project) => (
    <tr
      key={project.name}
      class={`${style.project} project-type-icon-${project.type.toLowerCase()}`}
    >
      <td class={style.name}>
        <a href="#" onClick={(e) => selectProject(e, project)}>
          {project.name}
        </a>
      </td>
      <td class={style.type} title={projectTypeDescriptions[project.type]}>
        <a href="#" onClick={(e) => selectProjectType(e, project)}>
          {projectTypes[project.type]}
        </a>
      </td>
      <td class={style.region}>
        <a href="#" onClick={(e) => selectRegion(e, project)}>
          {project.region}
        </a>
      </td>
      <td class={style.years}>
        {project.yearmin == project.yearmax
          ? project.yearmin
          : `${project.yearmin} - ${project.yearmax}`}
      </td>
    </tr>
  ));

  return (
    <table class={style["project-list"]}>
      <thead>
        <tr>
          <th class={style.name}>Project Name</th>
          <th class={style.type}>Project Type</th>
          <th class={style.region}>Region</th>
          <th class={style.years}>Years</th>
        </tr>
      </thead>
      <tbody>{projectRows}</tbody>
    </table>
  );
};

export default ProjectList;
