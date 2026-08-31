import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../../helpers/state";
import {
  factSheetBaseUrl,
  projectTypeDescriptions,
  projectTypes,
} from "../../helpers/config";
import style from "./style.module.css";

import ActionButton from "../action-button";

const ProjectDetail = () => {
  const { project } = useContext(State);
  const { description, displayId, name, region, type, yearmax, yearmin } =
    project.value;
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
        <p>
          <ion-icon aria-label="Region" src="/assets/buttons/location.svg" />
          {region}
        </p>
        <p>
          <ion-icon
            aria-label="Implementation Period"
            src="/assets/buttons/implementation_period.svg"
          />
          {yearmin == yearmax
            ? `Year ${yearmin}`
            : `Years ${yearmin} - ${yearmax}`}
        </p>
        <p>
          <ion-icon
            aria-label="Project Number"
            src="/assets/buttons/project_number.svg"
          />
          {displayId}
        </p>
      </div>
      {description ? <p>{description}</p> : null}
      <ActionButton
        action={() =>
          window.open(
            `${factSheetBaseUrl}${displayId}_${name
              .replace(/[ \-/]+/g, "-")
              .replace(/[^A-Za-z0-9\-]/g, "")}.pdf`,
            "_blank"
          )
        }
      >
        Project Fact Sheet (PDF)
      </ActionButton>
    </div>
  );
};

export default ProjectDetail;
