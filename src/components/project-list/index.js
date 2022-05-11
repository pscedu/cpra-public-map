import { h } from "preact";
import style from "./style.css";
import { fireEvent, getProjectResult } from "../../utils";

const ProjectList = ({ projects, projectTypeDescriptions, projectTypes }) => {
  const selectProject = (e, project) => {
    e.preventDefault();
    fireEvent("searchSelectResult", { result: getProjectResult(project) });
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
        {projectTypes[project.type]}
      </td>
      <td class={style.region}>{project.region}</td>
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
