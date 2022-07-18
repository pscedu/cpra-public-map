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
  footer,
  layerSpec,
  updateSlideState,
  slideState,
  tabTitle,
  title,
  yearStep = 10,
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
        step={yearStep}
        years={layerSpec.years}
        tooltip="The Louisiana Coastal Master Plan utilizes technical models to predict coastal land change and flood risk over a 50-year period. Use the slider below to view decadal model results from initial conditions to 50 years into the future."
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
        tooltip="Future land change and flood risk depends on environmental factors including precipitation, sea level rise, and land subsidence rates. Given the uncertainty in predicting environmental factors, the Louisiana Coastal Master Plan considers many possible future scenarios. Use the buttons below to view model results under a <strong>Lower Scenario</strong> (representing lower rates of sea level rise, land subsidence, etc.) and a <strong>Higher Scenario</strong> (representing higher rates of sea level rise, land subsidence, etc.)."
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
        help="Coming soon!"
        tooltip="Select <strong>Future Without Action</strong> to view model results in a scenario without construction and/or operation of the recommended projects from the 2023 Coastal Master Plan. Select <strong>With 2023 Master Plan</strong> to view model results with implementation of the recommended projects from the 2023 Coastal Master Plan (i.e. assuming construction and operation of coastal restoration and flood protection projects as recommended in the Master Plan)."
      />
    );

  if (controls.includes("subtype")) {
    const choices = layerSpec.subtypes.map((name) => {
      let parts = name.split(" ");
      let last = parts.pop();
      return [name, `${last}%`];
    });
    controlComponents.push(
      <Buttons
        choices={choices}
        label={"Annual Exceedance Probability"}
        value={subtype}
        setValue={setSubtype}
        tooltip="Flood events are often reported in annual exceedance probability (AEP), which is the likelihood of a given flood event occurring in a year. For example, a very intense flood might be classified as a 500-year event, which means that it has a 1/500 chance (or 0.2% chance) of occurring in any given year. Use the buttons below to view the anticipated flood risk resulting from different possible events. "
      />
    );
  }

  return (
    <section class={`${style.slide} ${cssClass}`}>
      <h2 class={!title ? "sr-only" : ""}>{title || tabTitle}</h2>
      {controlsPosition === "end" ? children : null}
      <div class="slide-controls">{controlComponents}</div>
      {controlsPosition !== "end" ? children : null}
      {footer ? footer : null}
    </section>
  );
};

export default Slide;
