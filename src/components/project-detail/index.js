import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../../helpers/state";
import { projectTypeDescriptions, projectTypes } from "../../helpers/config";
import style from "./style.css";

const ProjectDetail = () => {
  const { project } = useContext(State);
  const { description, name, region, type, yearmax, yearmin } = project.value;
  return (
    <div class={style["project-detail"]}>
      <h2 class={style.name}>{name}</h2>
      <div class={style.metadata}>
        <p
          title={projectTypeDescriptions[type]}
          class={`${
            style["project-type"]
          } project-type-icon-${type.toLowerCase()}`}
        >
          {projectTypes[type]}
        </p>
        <p class={style.region}>
          <ion-icon src="/assets/buttons/location.svg" />
          {region}
        </p>
        <p class={style.region}>
          <ion-icon src="/assets/buttons/implementation_period.svg" />
          {yearmin == yearmax
            ? `Year ${yearmin}`
            : `Years ${yearmin} - ${yearmax}`}
        </p>
      </div>
      {description ? <p>{description}</p> : null}
    </div>
  );
};

export default ProjectDetail;
