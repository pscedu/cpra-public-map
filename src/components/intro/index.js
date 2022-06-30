import { h } from "preact";
import style from "./style.css";

import ActionButton from "../action-button";
import Disclaimer from "../disclaimer";

const Intro = ({ setStorySlide }) => {
  const startTour = () => setStorySlide(0);
  const endTour = () => setStorySlide(null);
  return (
    <div class={style.intro}>
      <div class={style.columns}>
        <div class={style.tour}>
          <h2>Take a Guided Tour</h2>
          <p>
            First-time user? Unfamiliar with technical model data or the
            Louisiana Coastal Master Plan? Start with a guided tour of the data
            viewer and the Master Plan process.
          </p>
          <p class={style.button}>
            <ActionButton
              icon="play"
              action={startTour}
              cssClass={style["action-button"]}
            >
              Start Guided Tour
            </ActionButton>
          </p>
        </div>
        <div class={style.explore}>
          <h2>Explore the Map</h2>
          <p>
            Returning user? Familiar with technical model data and the Louisiana
            Coastal Master Plan? Explore the map on your own to view candidate
            projects and draft model results.
          </p>
          <p class={style.button}>
            <ActionButton
              icon="map"
              action={endTour}
              cssClass={style["action-button"]}
            >
              Explore the Map
            </ActionButton>
          </p>
        </div>
      </div>
      <Disclaimer />
    </div>
  );
};

export default Intro;
