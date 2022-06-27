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
          <p>
            The Guided Tour introduces users to the Louisiana Coastal Master
            Plan process and the tools that are available throughout the data
            viewer. Slides contain explanations of model data and narratives to
            highlight components of the Master Plan.
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
          <p>
            Explore the Map allows users to engage with technical model data and
            the project map for the 2023 Louisiana Coastal Master Plan in a
            self-guided format.
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
