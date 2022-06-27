import { h } from "preact";
import style from "./style.css";

const Disclaimer = () => {
  return (
    <p class={style.disclaimer}>
      <ion-icon name="warning" />
      <span>
        The model data, candidate projects, and functionality in the beta
        version of the 2023 Coastal Master Plan Data Viewer{" "}
        <strong>are not final</strong>. Ongoing testing and feedback will inform
        the official release in Spring 2023.
      </span>
    </p>
  );
};

export default Disclaimer;
