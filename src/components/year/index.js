import { h } from "preact";
import style from "./style.css";

const Year = ({ state, updateState, years }) => {
  const handleInput = (e) => {
    const newYear = e.target.value;
    const hasNewYear = years.indexOf(newYear) !== -1;
    updateState({
      year: newYear,
      prevYear: hasNewYear ? state.year : null,
    });
  };

  const ticks = [0, 10, 20, 30, 40, 50].map((val) => (
    <span key={val} class="tick">
      {val}
    </span>
  ));

  return (
    <div class="input">
      <label class="label" for="year">
        Year<span class="sr-only">: {state.year}</span>
      </label>
      <div class={style.ticks}>{ticks}</div>
      <input
        type="range"
        id="year"
        name="year"
        min="0"
        max="50"
        step="10"
        value={state.year}
        onInput={handleInput}
      />
    </div>
  );
};

export default Year;
