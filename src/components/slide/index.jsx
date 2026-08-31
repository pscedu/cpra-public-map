import { h } from "preact";
import { useContext } from "preact/hooks";
import {
  catalogLevels,
  controls as controlSpecs,
  views,
} from "../../helpers/config";
import { State } from "../../helpers/state";
import style from "./style.module.css";

import Buttons from "../buttons";
import Checkbox from "../checkbox";
import Year from "../year";

const createControl = (controlName, view, state) => {
  if (!state.catalog.value) return;
  const spec = controlSpecs[controlName];
  const sig = state[spec.level || controlName];
  const level = catalogLevels[spec.level || controlName];
  if (spec.type === "buttons")
    return (
      <Buttons
        analyticsId={controlName}
        choices={state.catalog.value
          .choices(state.entry.value, level)
          .map((value) => [value, level.format ? level.format(value) : value])}
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
        label={spec.label}
        signal={state.year}
        tooltip={spec.tooltip}
        years={state.catalog.value.choices(state.entry.value, level)}
      />
    );
};

const Slide = ({
  additionalControls = null,
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
        {controls.length || additionalControls ? (
          <div class={style.controls}>
            {controls.map((controlName) =>
              createControl(controlName, view, state)
            )}
            {additionalControls}
          </div>
        ) : null}
        <div class={style.body}>{children}</div>
      </div>
    </section>
  );
};

export default Slide;
