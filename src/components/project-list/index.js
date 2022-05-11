import { h } from "preact";
import { fireEvent, getProjectTypeResult, getRegionResult } from "../../utils";
import style from "./style.css";

const ProjectList = ({ projects, projectTypeDescriptions, projectTypes }) => {
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

  const projectRows = projects.map((project) => (
    <tr
      key={project.project_id}
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
    </tr>
  ));

  return (
    <table class={style["project-list"]}>
      <thead>
        <tr>
          <th class={style.name}>Project Name</th>
          <th class={style.type}>Project Type</th>
          <th class={style.region}>Region</th>
        </tr>
      </thead>
      <tbody>{projectRows}</tbody>
    </table>
  );
};

export default ProjectList;
