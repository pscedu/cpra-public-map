import { h } from "preact";
import style from "./style.module.css";
import { gtag } from "../../helpers/utils";

import Tooltip from "../tooltip";

const Buttons = ({
  analyticsId,
  choices,
  cssClass,
  disabled = false,
  help = null,
  label,
  value,
  setValue,
  signal,
  tooltip,
}) => {
  if (signal && !value && !setValue) {
    value = signal.value;
    setValue = (value) => (signal.value = value);
  }
  const buttons = choices.map(([buttonValue, buttonLabel, buttonIcon]) => (
    <button
      key={buttonValue}
      class={`${style.button} ${
        value === buttonValue ? style.active : style.inactive
      }`}
      value={buttonValue}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          setValue(buttonValue);
          gtag("event", "set_control_value", {
            control_id: analyticsId,
            control_value: buttonValue,
          });
        }
      }}
    >
      {buttonIcon ? <ion-icon name={buttonIcon} /> : null}
      <span class={style["button-label"]}>{buttonLabel}</span>
    </button>
  ));

  return (
    <div class={`input ${cssClass || "default"}`}>
      <label class="label">
        {tooltip ? <Tooltip content={tooltip} /> : null} {label}
      </label>
      <div class={style.buttons}>{buttons}</div>
      {help ? <p class={style.help}>{help}</p> : null}
    </div>
  );
};

export default Buttons;
