import { h } from "preact";
import style from "./style.css";

import Buttons from "../buttons";
import Year from "../year";

const stateProp = (propName, state = {}, updateState) => {
  return [
    state[propName],
    (value) => {
      const changes = {};
      changes[propName] = value;
      updateState(changes);
    },
  ];
};

const Slide = ({
  children,
  controls = [],
  controlsPosition = "end",
  cssClass = "",
  layerSpec,
  updateSlideState,
  slideState,
  tabTitle,
  title,
}) => {
  const [scenario, setScenario] = stateProp(
    "scenario",
    slideState,
    updateSlideState
  );
  const [group, setGroup] = stateProp("group", slideState, updateSlideState);
  const [subtype, setSubtype] = stateProp(
    "subtype",
    slideState,
    updateSlideState
  );

  const controlComponents = [];
  if (controls.includes("year"))
    controlComponents.push(
      <Year
        updateState={updateSlideState}
        state={slideState}
        years={layerSpec.years}
      />
    );

  if (controls.includes("scenario"))
    controlComponents.push(
      <Buttons
        choices={[
          ["S07", "Lower", "partly-sunny"],
          ["S08", "Higher", "rainy"],
        ]}
        label="Environmental Scenario"
        value={scenario}
        setValue={setScenario}
      />
    );

  if (controls.includes("group"))
    controlComponents.push(
      <Buttons
        choices={[
          ["G500", "Without Further Action", "close"],
          ["G603", "With 2023 Master Plan", "hammer"],
        ]}
        label="Project Implementation Scenario"
        value={group}
        setValue={setGroup}
      />
    );

  if (controls.includes("subtype")) {
    let label;
    const choices = layerSpec.subtypes.map((name) => {
      let parts = name.split(" ");
      let last = parts.pop();
      if (!label) label = parts.join(" ");
      return [name, last];
    });
    controlComponents.push(
      <Buttons
        choices={choices}
        label={label}
        value={subtype}
        setValue={setSubtype}
      />
    );
  }

  return (
    <section class={`${style.slide} ${cssClass}`}>
      <h2 class={!title ? "sr-only" : ""}>{title || tabTitle}</h2>
      {controlsPosition === "end" ? children : null}
      <div class="slide-controls">{controlComponents}</div>
      {controlsPosition !== "end" ? children : null}
    </section>
  );
};

export default Slide;
