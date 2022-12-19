import { h } from "preact";
import { useContext } from "preact/hooks";
import { controls as controlSpecs, views } from "../../helpers/config";
import { State } from "../../helpers/state";
import style from "./style.css";

import Buttons from "../buttons";
import Checkbox from "../checkbox";
import Year from "../year";

const createControl = (controlName, view, state) => {
  const spec = controlSpecs[controlName];
  const sig = state[spec.stateVariable || controlName];
  if (spec.type === "buttons")
    return (
      <Buttons
        analyticsId={controlName}
        choices={spec.choices}
        label={spec.label}
        signal={sig}
        tooltip={spec.tooltip}
        disabled={spec.disabled || false}
        help={spec.help}
      />
    );
  if (spec.type === "checkbox")
    return (
      <Checkbox
        analyticsId={controlName}
        label={spec.label}
        signal={sig}
        disabled={spec.disabled(state)}
        tooltip={spec.tooltip}
      />
    );
  if (spec.type === "year")
    return (
      <Year
        signal={state.year}
        tooltip={spec.tooltip}
        years={view.layer.years}
      />
    );
};

const Slide = ({
  children,
  controls = [],
  layout = "split",
  title,
  viewName,
}) => {
  const state = useContext(State);
  const view = views[viewName];
  return (
    <section class={style.slide}>
      <h2 class={"sr-only"}>{title || view.title}</h2>
      <div class={style[layout]}>
        {controls.length ? (
          <div class={style.controls}>
            {controls.map((controlName) =>
              createControl(controlName, view, state)
            )}
          </div>
        ) : null}
        <div class={style.body}>{children}</div>
      </div>
    </section>
  );
};

export default Slide;
