import { h } from "preact";
import style from "./style.css";

import Buttons from "../buttons";
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
  const tourValue = storySlide === null ? "explore" : "tour";
  const setTourValue = (value) => (value === "tour" ? startTour() : endTour());
  const tourButtons = printing ? null : (
    <Buttons
      analyticsId="header-mode"
      choices={[
        ["tour", "Guided Tour"],
        ["explore", "Explore"],
      ]}
      cssClass={style["tour-buttons"]}
      label="Mode"
      value={tourValue}
      setValue={setTourValue}
    />
  );
  return (
    <header class={style.header}>
      <a href="https://coastal.la.gov/" class={style.logo}>
        <img src="/assets/images/logo.png" alt="CPRA" />
      </a>
      <h1>
        <span class={style.title}>Louisiana's Coastal Master Plan 2023 </span>
      </h1>
      <div class={style.spacer} />
      {tourButtons}
      <Search
        geocodeUrl={geocodeUrl}
        searchIndex={searchIndex}
        setSelection={setSelection}
      />
    </header>
  );
};

export default Header;
