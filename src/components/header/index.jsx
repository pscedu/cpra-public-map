import { h } from "preact";
import { useContext } from "preact/hooks";
import style from "./style.module.css";
import { State } from "../../helpers/state";

import Buttons from "../buttons";
import Search from "../search";

const Header = () => {
  const state = useContext(State);
  const tourValue = state.storySlide.value === null ? "explore" : "tour";
  const setTourValue = (value) =>
    value === "tour" ? state.startTour() : state.endTour();
  const tourButtons = state.printing.value ? null : (
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
        <span class={style.title}>Louisiana's 2023 Coastal Master Plan </span>
      </h1>
      <div class={style.spacer} />
      {tourButtons}
      <Search />
    </header>
  );
};

export default Header;
