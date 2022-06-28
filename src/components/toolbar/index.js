import { h } from "preact";
import style from "./style.css";

const Toolbar = ({ contactEmail, updateMapState, websiteUrl }) => {
  const aboutClick = () => updateMapState({ view: "intro" });
  const websiteClick = () => (window.location = websiteUrl);
  const emailClick = () => (window.location = contactEmail);
  return (
    <div class={style.toolbar}>
      {/* <button
        title="About the Data Viewer"
        onClick={aboutClick}
        class={style.help}
      >
        <span class="sr-only">About the Data Viewer</span>
      </button> */}
      <button
        title="Visit Master Plan Website"
        onClick={websiteClick}
        clas={style.website}
      >
        <ion-icon name="globe" />
        <span class="sr-only">Visit Master Plan Website</span>
      </button>
      <button title="E-mail Us" onClick={emailClick} class={style.mail}>
        <span class="sr-only">E-mail Us</span>
      </button>
    </div>
  );
};

export default Toolbar;
