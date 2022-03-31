import { h } from "preact";
import style from "./style.css";

const ProjectDetail = (props) => {
  const project = props.project;
  return (
    <div class={style["project-detail"]}>
      <h3>Type of Project</h3>
      <p
        class={`${
          style["project-type"]
        } project-type-icon-${project.type.toLowerCase()}`}
      >
        {props.projectTypes[project.type]}
      </p>
      <h3>Region</h3>
      <p>{project.region}</p>
      <button onClick={project.zoomToBbox}>Zoom Map to Project</button>
    </div>
  );
};

export default ProjectDetail;
