import { h } from "preact";
import { useContext } from "preact/hooks";
import { batch } from "@preact/signals";
import style from "./style.css";
import { State } from "../../helpers/state";

import ActionButton from "../action-button";
import Modal from "../modal";

const Intro = () => {
  const { endTour, introOpen, startTour } = useContext(State);
  const tour = () => {
    batch(() => {
      startTour();
      introOpen.value = false;
    });
  };
  const explore = () => {
    batch(() => {
      endTour();
      introOpen.value = false;
    });
  };
  return (
    <Modal
      open={introOpen.value}
      title="Welcome to the 2023 Coastal Master Plan Data Viewer"
    >
      <div class={style.intro}>
        <p>
          This is an interactive online companion to Louisiana&apos;s{" "}
          <a href="https://coastal.la.gov/our-plan/2023-coastal-master-plan/">
            Draft 2023 Coastal Master Plan
          </a>
          . This data viewer presents projections of coastal change over 50
          years and the potential impacts of restoration and risk reduction
          projects to address the challenges of land loss and coastal flood
          risk.
        </p>
        <p>
          Public comment on the Draft 2023 Coastal Master Plan is open through
          Saturday, March 25, 2022. To submit comments electronically, contact
          us via email at{" "}
          <a href="mailto:masterplan@la.gov">masterplan@la.gov</a>. For details
          on official public hearings or other ways to submit your comments on
          the draft master plan, please{" "}
          <a href="https://coastal.la.gov/our-plan/2023-coastal-master-plan/">
            see our website
          </a>
          .
        </p>
        <div class={style.columns}>
          <div class={style.tour}>
            <p class={style.button}>
              <ActionButton action={tour} cssClass={style["action-button"]}>
                Start Guided Tour
              </ActionButton>
            </p>
            <p>
              For more information about the need for a master plan and what
              features and data are available in the data viewer, start with our
              guided tour&mdash;perfect for first time users.
            </p>
          </div>
          <div class={style.explore}>
            <p class={style.button}>
              <ActionButton action={explore} cssClass={style["action-button"]}>
                Explore the Map
              </ActionButton>
            </p>
            <p>
              If you&apos;re a returning user and already have familiarity with
              the data viewer, you can access the map and start exploring.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Intro;
