import { h } from "preact";
import style from "./style.css";

import ActionButton from "../action-button";
import Search from "../search";

const Header = ({
  endTour,
  geocodeUrl,
  printing,
  searchIndex,
  setSelection,
  startTour,
  storySlide,
}) => {
  const tourButton = printing ? null : storySlide === null ? (
    <ActionButton
      analyticsId="header_tour"
      icon="play"
      action={startTour}
      cssClass={style["action-button"]}
    >
      Start Guided Tour
    </ActionButton>
  ) : (
    <ActionButton
      analyticsId="header_explore"
      icon="map"
      action={endTour}
      cssClass={style["action-button"]}
    >
      Explore the Map
    </ActionButton>
  );
  return (
    <header class={style.header}>
      <a href="https://coastal.la.gov/" class={style.logo}>
        <img src="/assets/images/logo.png" alt="CPRA" />
      </a>
      <h1>
        <span class={style.title}>
          Louisiana's Coastal Master Plan 2023{" "}
          <span class={style.beta}>Beta</span>
        </span>
      </h1>
      <div class={style.spacer} />
      {tourButton}
      <Search
        geocodeUrl={geocodeUrl}
        searchIndex={searchIndex}
        setSelection={setSelection}
      />
    </header>
  );
};

export default Header;
