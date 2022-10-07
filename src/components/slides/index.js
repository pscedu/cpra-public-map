import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../../helpers/state";
import style from "./style.css";

import SlideNavigation from "../slide-navigation";

const Slides = ({ children }) => {
  const { drawerOpen, viewName } = useContext(State);
  const currentSlide = children.filter(
    (slide) => slide.props.viewName === viewName.value
  )[0];
  const slides = children.filter(
    (slide) => slide.props.slideGroup === currentSlide.props.slideGroup
  );
  const overlays = children.filter((slide) => slide.props.overlay);
  const currentIdx = slides.indexOf(currentSlide);
  const drawerContents = [];
  if (drawerOpen.value) {
    drawerContents.push(
      <div
        key="strip"
        class={style.strip}
        style={{
          left: `-${currentIdx * 100}%`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides}
      </div>
    );
    if (overlays.length)
      drawerContents.push(
        <div class={style.overlay}>
          <div class={style.header}>
            <SlideNavigation
              currentSlide={overlays[0]}
              navigationType="overlay"
            />
          </div>
          {overlays[0]}
        </div>
      );
  }

  return (
    <div
      class={`${style.slides} ${style[drawerOpen.value ? "open" : "closed"]}`}
    >
      <div class={style.header}>
        <SlideNavigation
          currentSlide={currentSlide}
          navigationType={
            currentSlide.props.slideGroup === "tour" ? "arrows" : "tabs"
          }
          slides={slides}
        />
      </div>
      {drawerContents}
    </div>
  );
};

export default Slides;
