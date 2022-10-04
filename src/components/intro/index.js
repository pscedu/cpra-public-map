import { h } from "preact";
import { useContext } from "preact/hooks";
import style from "./style.css";
import { State } from "../../helpers/state";
import { fireEvent } from "../../helpers/utils";

import ActionButton from "../action-button";
import Disclaimer from "../disclaimer";
import Modal from "../modal";

const Intro = () => {
  const state = useContext(State);
  const tour = () => {
    state.startTour();
    state.introOpen.value = false;
    fireEvent("drawerSetOpen", { open: true });
  };
  const explore = () => {
    state.endTour();
    state.introOpen.value = false;
    fireEvent("drawerSetOpen", { open: true });
  };
  return (
    <Modal
      open={state.introOpen.value}
      title="Welcome to the Master Plan Data Viewer"
    >
      <div class={style.intro}>
        <div class={style.columns}>
          <div class={style.tour}>
            <h2>Take a Guided Tour</h2>
            <p>
              First-time user? Unfamiliar with technical model data or the
              Louisiana Coastal Master Plan? Start with a guided tour of the
              data viewer and the Master Plan process.
            </p>
            <p class={style.button}>
              <ActionButton action={tour} cssClass={style["action-button"]}>
                Start Guided Tour
              </ActionButton>
            </p>
          </div>
          <div class={style.explore}>
            <h2>Explore the Map</h2>
            <p>
              Returning user? Familiar with technical model data and the
              Louisiana Coastal Master Plan? Explore the map on your own to view
              candidate projects and draft model results.
            </p>
            <p class={style.button}>
              <ActionButton action={explore} cssClass={style["action-button"]}>
                Explore the Map
              </ActionButton>
            </p>
          </div>
        </div>
        <Disclaimer />
      </div>
    </Modal>
  );
};

export default Intro;
