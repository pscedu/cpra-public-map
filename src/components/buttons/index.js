import { h } from "preact";
import style from "./style.css";

const Buttons = ({ choices, label, value, setValue }) => {
  const buttons = choices.map(([buttonValue, buttonLabel, buttonIcon]) => (
    <button
      key={buttonValue}
      class={`${style.button} ${
        value === buttonValue ? style.active : style.inactive
      }`}
      value={buttonValue}
      onClick={() => setValue(buttonValue)}
    >
      {buttonIcon ? <ion-icon name={buttonIcon} /> : null}
      {buttonLabel}
    </button>
  ));

  return (
    <div class="input">
      <label class="label">{label}</label>
      <div class={style.buttons}>{buttons}</div>
    </div>
  );
};

export default Buttons;
