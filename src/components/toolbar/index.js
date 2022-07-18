import { h } from "preact";
import style from "./style.css";
import { gtag } from "../../utils";

const trackClick = (button_id, button_text) =>
  gtag("event", "button_click", {
    button_id,
    button_text,
  });

const Toolbar = ({
  contactEmail,
  printing,
  setPrinting,
  updateMapState,
  websiteUrl,
}) => {
  const aboutClick = () => {
    updateMapState({ view: "intro" });
    trackClick("toolbar_about", "About the Data Viewer");
  };
  const printClick = () => {
    setPrinting(!printing);
    trackClick("toolbar_website", "Visit Master Plan Website");
  };
  const websiteClick = () => {
    trackClick("toolbar_website", "Visit Master Plan Website");
    window.location = websiteUrl;
  };
  const emailClick = () => {
    trackClick("toolbar_email", "E-mail Us");
    window.location = contactEmail;
  };
  return (
    <div class={style.toolbar}>
      <button
        title="About the Data Viewer"
        onClick={aboutClick}
        class={style.help}
      >
        <span class="sr-only">About the Data Viewer</span>
      </button>
      <button
        title="Print or Export Map"
        onClick={printClick}
        class={style.print}
      >
        <ion-icon name="print" />
        <span class="sr-only">Print or Export Map</span>
      </button>
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
