import { h } from "preact";
import style from "./style.css";

const Year = ({ setState, state, years }) => {
  const handleInput = (e) => {
    const newYear = e.target.value;
    const hasYear = years.indexOf(state.year) !== -1;
    setState({
      ...state,
      year: newYear,
      prevYear: hasYear ? state.year : null,
    });
  };

  return (
    <div class="input">
      <label class="label" for="year">
        Year : <span class={style.year}>{state.year}</span>
      </label>
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
