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
  layerSpec,
  updateSlideState,
  slideState,
  tabTitle,
  title,
}) => {
  const [environment, setEnvironment] = stateProp(
    "environment",
    slideState,
    updateSlideState
  );
  const [plan, setPlan] = stateProp("plan", slideState, updateSlideState);
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

  if (controls.includes("environment"))
    controlComponents.push(
      <Buttons
        choices={[
          ["S07", "Lower", "partly-sunny"],
          ["S08", "Higher", "rainy"],
        ]}
        label="Environmental Scenario"
        value={environment}
        setValue={setEnvironment}
      />
    );

  if (controls.includes("plan"))
    controlComponents.push(
      <Buttons
        choices={[
          ["G500", "Without Further Action", "close"],
          ["G600", "With 2023 Master Plan", "hammer"],
        ]}
        label="Project Implementation Scenario"
        value={plan}
        setValue={setPlan}
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
    <section class={style.slide}>
      <h2 class={!title ? "sr-only" : ""}>{title || tabTitle}</h2>
      {children}
      <div class="slide-controls">{controlComponents}</div>
    </section>
  );
};

export default Slide;
