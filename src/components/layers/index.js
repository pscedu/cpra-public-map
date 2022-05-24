import { h } from "preact";
import { useState } from "preact/hooks";
import { fireEvent } from "../../utils";
import style from "./style.css";

const Layers = ({ modelLayer, modelLayers, initialSubtype, initialYear }) => {
  const [subtype, setSubtypeState] = useState(initialSubtype);
  const [year, setYearState] = useState(initialYear);

  const setSubtype = (e) => {
    setSubtypeState(e.target.value);
    fireEvent("mapUpdateState", {
      updates: {
        prevYear: null,
        subtype: e.target.value,
      },
    });
  };

  const setYear = (e) => {
    const newYear = e.target.value;
    const hasYear = modelLayers[modelLayer].years.indexOf(year) == -1;
    setYearState(newYear);
    fireEvent("mapUpdateState", {
      updates: {
        year: newYear,
        prevYear: hasYear ? null : year,
      },
    });
  };

  const yearEnabled = modelLayer !== undefined;
  const subtypeEnabled = subtype !== undefined;
  return (
    <div class={style.layers}>
      {subtypeEnabled ? (
        <div class={style.input}>
          <label for="model-layer-option">Layer Option</label>
          <select
            name="model-layer-option"
            id="model-layer-option"
            value={subtype}
            onChange={setSubtype}
          >
            {((modelLayers[modelLayer] || {}).subtypes || []).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div class={style.input}>
        <div>
          <label for="year">Year</label>: <span class={style.year}>{year}</span>
        </div>
        <input
          type="range"
          id="year"
          name="year"
          min="0"
          max="50"
          step="10"
          disabled={!yearEnabled}
          value={year}
          onInput={setYear}
        />
      </div>
    </div>
  );
};

export default Layers;
