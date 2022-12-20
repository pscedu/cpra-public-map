import { h } from "preact";
import { useId } from "preact/hooks";
import style from "./style.css";

import Tooltip from "../tooltip";
import { gtag } from "../../helpers/utils";

let yearTimeout;

const Year = ({ label, signal, tooltip, years }) => {
  const id = useId();
  const handleInput = (e) => {
    const newYear = years[parseInt(e.target.value, 10)];
    signal.value = newYear;
    if (yearTimeout) clearTimeout(yearTimeout);
    yearTimeout = setTimeout(
      () =>
        gtag("event", "set_control_value", {
          control_id: "year",
          control_value: newYear,
        }),
      1000
    );
  };

  const tickDivisor = years.length > 10 ? 10 : 1;
  const filteredYears = years.filter((val) => val % tickDivisor === 0);
  const ticks = filteredYears.map((val, i) => (
    <span
      key={val}
      class={style.tick}
      style={{ left: `${(i * 100) / (filteredYears.length - 1)}%` }}
    >
      {val}
    </span>
  ));

  return (
    <div class="input">
      <label class="label" for={id}>
        {tooltip ? <Tooltip content={tooltip} /> : null} {label}
        <span class={style.value}>: {signal.value}</span>
      </label>
      <div class={style.ticks}>{ticks}</div>
      <input
        type="range"
        id={id}
        name="year"
        min="0"
        max={years.length - 1}
        value={years.indexOf(signal.value)}
        onInput={handleInput}
      />
    </div>
  );
};

export default Year;
