import { h } from "preact";
import { useContext } from "preact/hooks";
import { projectTypes, projectTypeDescriptions } from "../../helpers/config";
import { State } from "../../helpers/state";
import style from "./style.css";

const ProjectList = () => {
  const { projects, setSearchResult } = useContext(State);
  const select = (e, key, value) => {
    e.preventDefault();
    setSearchResult(`${key}:${value}`);
  };

  const projectRows = (projects.value || []).map((project) => (
    <tr
      key={project.name}
      class={`${style.project} project-type-icon-${project.type.toLowerCase()}`}
    >
      <td class={style.name}>
        <a href="#" onClick={(e) => select(e, "project", project.displayId)}>
          {project.name}
        </a>
      </td>
      <td class={style.type} title={projectTypeDescriptions[project.type]}>
        <a
          href="#"
          onClick={(e) => select(e, "project-type", project.type.toLowerCase())}
        >
          {projectTypes[project.type]}
        </a>
      </td>
      <td class={style.region}>
        <a
          href="#"
          onClick={(e) => select(e, "region", project.region.toLowerCase())}
        >
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
