import { h } from "preact";
import style from "./style.css";

import Buttons from "../buttons";
import Year from "../year";

const stateProp = (propName, state, setState) => {
  return [
    state[propName],
    (value) => {
      const newState = { ...state };
      newState[propName] = value;
      setState(newState);
    },
  ];
};

const Slide = ({
  children,
  controls = [],
  modelLayerSpec,
  setSlideState,
  slideState,
  tabTitle,
  title,
}) => {
  const [environment, setEnvironment] = stateProp(
    "environment",
    slideState,
    setSlideState
  );
  const [plan, setPlan] = stateProp("plan", slideState, setSlideState);

  const controlComponents = [];
  if (controls.includes("year"))
    controlComponents.push(
      <Year
        setState={setSlideState}
        state={slideState}
        years={modelLayerSpec.years}
      />
    );

  if (controls.includes("environment"))
    controlComponents.push(
      <Buttons
        choices={[
          ["S07", "Lower"],
          ["S08", "Higher"],
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
          ["G500", "Without Further Action"],
          ["G600", "With 2023 Master Plan"],
        ]}
        label="Project Implementation Scenario"
        value={plan}
        setValue={setPlan}
      />
    );

  return (
    <section class={style.slide}>
      <h2 class={!title ? "sr-only" : ""}>{title || tabTitle}</h2>
      {children}
      <div class={style.controls}>{controlComponents}</div>
    </section>
  );
};

export default Slide;
