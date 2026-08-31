import { h } from "preact";
import { useId } from "preact/hooks";
import style from "./style.module.css";
import { gtag } from "../../helpers/utils";

import Tooltip from "../tooltip";

const Checkbox = ({
  analyticsId,
  cssClass,
  disabled = false,
  falseValue = false,
  label,
  signal,
  tooltip,
  trueValue = true,
}) => {
  const id = useId();
  return (
    <div class={`${style.checkbox} ${cssClass || "default"}`}>
      <input
        type="checkbox"
        checked={signal.value === trueValue}
        onChange={() =>
          (signal.value = signal.value === trueValue ? falseValue : trueValue)
        }
        disabled={disabled}
        id={id}
      />
      <label class="label" for={id}>
        {tooltip ? <Tooltip content={tooltip} /> : null}
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
