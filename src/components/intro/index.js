import { h } from "preact";
import style from "./style.css";

import ActionButton from "../action-button";

const Intro = ({ setStorySlide }) => {
  const startTour = () => setStorySlide(0);
  const endTour = () => setStorySlide(null);
  return (
    <div class={style.intro}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
        tellus nulla, lacinia non molestie non, blandit non orci. Nulla sit amet
        gravida odio, a consectetur sem. In et ante urna. Quisque vulputate eu
        leo eu consectetur. Ut orci lacus, tempor id quam eu, volutpat feugiat
        tellus. Etiam vitae velit vel diam ullamcorper porttitor ac at arcu.
        Aenean eleifend fringilla felis. In efficitur accumsan odio. Cras dictum
        pretium faucibus. Nunc mattis ultricies justo eu pulvinar. Ut tristique
        mattis mauris id dapibus. Aliquam tempus consequat urna ac aliquam.{" "}
      </p>
      <div class={style.buttons}>
        <ActionButton
          icon="play"
          action={startTour}
          cssClass={style["action-button"]}
        >
          Start Guided Tour
        </ActionButton>
        <ActionButton
          icon="map"
          action={endTour}
          cssClass={style["action-button"]}
        >
          Explore the Map
        </ActionButton>
      </div>
    </div>
  );
};

export default Intro;
