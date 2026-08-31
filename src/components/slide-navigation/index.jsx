import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../../helpers/state";
import { views } from "../../helpers/config";
import style from "./style.module.css";

import SlideNavigationButton from "../slide-navigation-button";

const classes = (...cls) => cls.map((cl) => style[cl]).join(" ");

const SlideNavigation = ({ currentSlide, navigationType, slides }) => {
  const { clearProject, drawerOpen } = useContext(State);
  const buttons = [];
  const currentIdx = slides ? slides.indexOf(currentSlide) : 0;

  if (navigationType !== "tabs") {
    buttons.push(
      <span
        class={classes(
          "title",
          "button",
          "active",
          currentSlide.props.color || "teal"
        )}
      >
        {currentSlide.props.title || views[currentSlide.props.viewName].title}
      </span>
    );
  }
  if (navigationType === "overlay") {
    buttons.push(
      <SlideNavigationButton
        cssClass={classes(
          "button",
          "icon",
          "active",
          currentSlide.props.color || "teal"
        )}
        action={clearProject}
        label="Close"
      >
        <ion-icon name="close-outline" />
      </SlideNavigationButton>
    );
  } else if (navigationType === "arrows") {
    const cssClass = classes(
      "button",
      "icon",
      "active",
      currentSlide.props.color || "teal"
    );
    buttons.push(
      <SlideNavigationButton
        key="previous"
        cssClass={cssClass}
        label="Previous"
        targetSlide={slides[currentIdx - 1]}
      >
        <ion-icon name="chevron-back-outline" />
      </SlideNavigationButton>,
      <SlideNavigationButton
        key="next"
        cssClass={cssClass}
        label="Next"
        targetSlide={slides[currentIdx + 1]}
      >
        <ion-icon name="chevron-forward-outline" />
      </SlideNavigationButton>
    );
  } else {
    buttons.push(
      ...slides.map((slide, i) => {
        const classList = ["button", slide.props.color || "teal"];
        if (currentIdx == i) classList.push("active");
        return (
          <SlideNavigationButton
            cssClass={classes(...classList)}
            targetSlide={slide}
            key={`${i}-${slide.props.viewName}`}
          >
            {views[slide.props.viewName].title}
          </SlideNavigationButton>
        );
      })
    );
  }
  if (navigationType !== "overlay") {
    const classList = ["button", "icon"];
    if (navigationType === "arrows") {
      classList.push(currentSlide.props.color || "teal", "active");
    } else {
      classList.push("green");
    }

    buttons.push(
      <SlideNavigationButton
        key="close"
        cssClass={classes(...classList)}
        action={() => (drawerOpen.value = !drawerOpen.value)}
        label={drawerOpen.value ? "Close" : "Open"}
      >
        <ion-icon
          class={style["icon-lg"]}
          name={`chevron-${drawerOpen.value ? "down" : "up"}-outline`}
        />
        <ion-icon
          class={style["icon-md"]}
          src={`/assets/buttons/legend${
            navigationType === "arrows" ? "" : "-green"
          }.svg`}
        />
      </SlideNavigationButton>
    );
  }

  return <nav class={style["slide-navigation"]}>{buttons}</nav>;
};

export default SlideNavigation;
