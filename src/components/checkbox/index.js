import { h } from "preact";
import style from "./style.css";
import { gtag } from "../../utils";

const Checkbox = ({
  analyticsId,
  cssClass,
  disabled = false,
  falseValue = "false",
  label,
  trueValue = "true",
  value,
  setValue,
}) => {
  return (
    <div class={`${style.checkbox} ${cssClass || "default"}`}>
      <input
        type="checkbox"
        checked={value === trueValue}
        onChange={() => setValue(value === trueValue ? falseValue : trueValue)}
        disabled={disabled}
      />
      <label class="label">{label}</label>
    </div>
  );
};

export default Checkbox;
