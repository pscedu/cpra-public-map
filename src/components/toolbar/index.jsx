import { h } from "preact";
import { useContext } from "preact/hooks";
import style from "./style.module.css";
import * as config from "../../helpers/config";
import { State } from "../../helpers/state";
import { gtag } from "../../helpers/utils";

const trackClick = (button_id, button_text) =>
  gtag("event", "button_click", {
    button_id,
    button_text,
  });

const Toolbar = () => {
  const state = useContext(State);
  const aboutClick = () => {
    state.introOpen.value = true;
    trackClick("toolbar_about", "About the Data Viewer");
  };
  const downloadClick = () => {
    trackClick("toolbar_download", "Download Master Plan Data");
    window.location = config.mpdapUrl;
  };
  const printClick = () => {
    state.printing.value = !state.printing.value;
    trackClick("toolbar_print", "Print or Export Map");
  };
  const websiteClick = () => {
    trackClick("toolbar_website", "Visit Master Plan Website");
    window.location = config.websiteUrl;
  };
  const emailClick = () => {
    trackClick("toolbar_email", "E-mail Us");
    window.location = config.contactEmail;
  };
  return (
    <div class={style.toolbar}>
      <button
        title="About the Data Viewer"
        onClick={aboutClick}
        class={style.help}
      >
        <ion-icon src="/assets/buttons/question.svg" />
        <span class="sr-only">About the Data Viewer</span>
      </button>
      <button
        title="Download Master Plan Data"
        onClick={downloadClick}
        class={style.download}
      >
        <ion-icon name="download" />
        <span class="sr-only">Download Master Plan Data</span>
      </button>
      <button
        title="Print or Export Map"
        onClick={printClick}
        class={style.print}
      >
        <ion-icon src="/assets/buttons/print.svg" />
        <span class="sr-only">Print or Export Map</span>
      </button>
      <button
        title="Visit Master Plan Website"
        onClick={websiteClick}
        class={style.website}
      >
        <ion-icon src="/assets/buttons/cpra.svg" />
        <span class="sr-only">Visit Master Plan Website</span>
      </button>
      <button title="E-mail Us" onClick={emailClick} class={style.mail}>
        <ion-icon name="mail-outline" />
        <span class="sr-only">E-mail Us</span>
      </button>
    </div>
  );
};

export default Toolbar;
