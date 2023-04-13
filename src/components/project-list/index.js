import { h } from "preact";
import { useContext } from "preact/hooks";
import {
  projectTypes,
  projectTypeDescriptions,
  regionsLookup,
} from "../../helpers/config";
import { State } from "../../helpers/state";
import style from "./style.css";

const ProjectList = () => {
  const { projects, selection, setSearchResult, year } = useContext(State);
  const select = (e, key, value) => {
    e.preventDefault();
    setSearchResult(`${key}:${value}`);
  };

  const projectRows = (projects.value || [])
    .filter((project) =>
      selection.value["project-type"]
        ? selection.value["project-type"] === project.type.toLowerCase()
        : true
    )
    .filter(
      (project) => parseInt(project.yearmin, 10) <= parseInt(year.value, 10)
    )
    .map((project) => (
      <tr
        key={project.displayId}
        class={`${
          style.project
        } project-type-icon-${project.type.toLowerCase()}`}
      >
        <td class={style.name}>
          <a href="#" onClick={(e) => select(e, "project", project.displayId)}>
            {project.name}
          </a>
        </td>
        <td class={style.type} title={projectTypeDescriptions[project.type]}>
          <a
            href="#"
            onClick={(e) =>
              select(e, "project-type", project.type.toLowerCase())
            }
          >
            {projectTypes[project.type]}
          </a>
        </td>
        <td class={style.region}>
          <a
            href="#"
            onClick={(e) => select(e, "region", regionsLookup[project.region])}
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

  return projectRows.length ? (
    <table class={style["project-list"]}>
      <thead>
        <tr>
          <th class={style.name}>Project Name</th>
          <th class={style.type}>Project Type</th>
          <th class={style.region}>Region</th>
          <th class={style.years}>Imp. Year</th>
        </tr>
      </thead>
      <tbody>{projectRows}</tbody>
    </table>
  ) : (
    <p class={style["no-projects"]}>
      No projects are active for the selected year range. Adjust the year slider
      to see projects.
    </p>
  );
};

export default ProjectList;
