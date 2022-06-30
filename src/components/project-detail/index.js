import { h } from "preact";
import style from "./style.css";

const ProjectDetail = (props) => {
  const project = props.project;
  return (
    <div class={style["project-detail"]}>
      <h2 class={style.name}>{project.name}</h2>
      <div class={style.metadata}>
        <p
          title={props.projectTypeDescriptions[project.type]}
          class={`${
            style["project-type"]
          } project-type-icon-${project.type.toLowerCase()}`}
        >
          {props.projectTypes[project.type]}
        </p>
        <p class="style.region">
          <ion-icon name="location" />
          {project.region}
        </p>
      </div>
      {project.description ? <p>{project.description}</p> : null}
    </div>
  );
};

export default ProjectDetail;
