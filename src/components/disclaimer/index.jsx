import { h } from "preact";
import style from "./style.module.css";

const Disclaimer = ({ type = "short" }) => {
  const text = {
    short:
      "The 2023 Draft Coastal Master Plan is not yet finalized. Outputs should not be considered representative of the full master plan.",
    long: "The 2023 Draft Coastal Master Plan is not yet finalized and the outputs presented on this demonstration version of the Master Plan Data Viewer should not be considered representative of the full master plan. Only projects from the plan's first implementation period are being shown and some model outputs are not yet available. The draft plan will be released in January 2023.",
    risk: "Flood depth and damages outputs with projects are not currently available in the Master Plan Data Viewer, but will be added ahead of the release of the 2023 Draft Coastal Master Plan. The plan is not yet finalized. Outputs should not be considered representative of the full master plan.",
  }[type];
  return (
    <p class={style.disclaimer}>
      <ion-icon name="warning" />
      <span>{text}</span>
    </p>
  );
};

export default Disclaimer;
