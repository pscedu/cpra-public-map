import { h } from "preact";
import style from "./style.css";

const ProjectList = ({
  projects,
  projectFilters,
  projectTypes,
  setProjectFilters,
}) => {
  const projectRows = projects.map((project) => (
    <tr
      key={project.project_id}
      class={`${style.project} project-type-icon-${project.type.toLowerCase()}`}
    >
      <td class={style.name}>
        <a href={`/projects/${project.project_id}`}>{project.name}</a>
      </td>
      <td class={style.type}>{projectTypes[project.type]}</td>
      <td class={style.region}>{project.region}</td>
    </tr>
  ));

  const onName = (e) =>
    setProjectFilters({
      ...projectFilters,
      name: e.target.value,
    });

  return (
    <table class={style["project-list"]}>
      <thead>
        <tr>
          <th class={style.name}>
            <span class="sr-only">Project Name</span>
            <input
              type="search"
              value={projectFilters.name}
              onKeyUp={onName}
              onSearch={onName}
              placeholder="Filter projects..."
            />
          </th>
          <th class={style.type}>Project Type</th>
          <th class={style.region}>Region</th>
        </tr>
      </thead>
      <tbody>{projectRows}</tbody>
    </table>
  );
};

export default ProjectList;
