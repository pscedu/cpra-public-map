import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import style from "./style.css";

const toFloat = (value) => parseFloat(value.replace(/[^0-9.]/g, ""));

const Layers = (props) => {
  const { services, mapState, setMapState } = props;

  const [modelLayers, setModelLayers] = useState({});
  useEffect(() => {
    if (!services) return;
    const layers = {};
    for (let service of Object.values(services)) {
      if (service.name.indexOf("Base Map") != -1) continue;
      let [name, year, subtype] = service.name.split(" - ");
      let layer = (layers[name] = layers[name] || { years: [] });
      layer.years.push(year.replace("Year ", ""));
      if (subtype) {
        layer.subtypes = layer.subtypes || [];
        if (!layer.subtypes.includes(subtype)) layer.subtypes.push(subtype);
      }
    }
    for (let layer of Object.values(layers))
      if (layer.subtypes)
        layer.subtypes.sort((a, b) => toFloat(a) - toFloat(b));
    setModelLayers(layers);
  }, [services]);

  const modelLayerNames = Object.keys(modelLayers);
  modelLayerNames.sort();

  const setShowProjects = (e) =>
    setMapState({
      ...mapState,
      showProjects: e.target.checked,
    });

  const setModelLayer = (e) => {
    let modelLayer = e.target.value === "" ? null : e.target.value;
    setMapState({
      ...mapState,
      modelLayer,
      prevYear: null,
      subtype:
        modelLayers[modelLayer] && modelLayers[modelLayer].subtypes
          ? modelLayers[modelLayer].subtypes[0]
          : null,
    });
  };

  const setPoliticalBoundary = (e) =>
    setMapState({
      ...mapState,
      politicalBoundary: e.target.value === "" ? null : e.target.value,
    });

  const setSubtype = (e) =>
    setMapState({
      ...mapState,
      prevYear: null,
      subtype: e.target.value,
    });

  const setYear = (e) => {
    const year = e.target.value;
    const hasYear = modelLayers[mapState.modelLayer].years.indexOf(year) == -1;
    setMapState({
      ...mapState,
      year,
      prevYear: hasYear ? null : mapState.year,
    });
  };

  const yearEnabled = mapState.modelLayer !== null;
  const subtypeEnabled = mapState.subtype !== null;
  return (
    <div class={style.layers}>
      <h2>Map Layers</h2>
      <div class={style.input}>
        <input
          type="checkbox"
          id="show-projects"
          checked={mapState.showProjects}
          onChange={setShowProjects}
        />
        <label for="show-projects">Candidate Projects</label>
      </div>
      <div class={style.input}>
        <label for="model-layer">Model Layer</label>
        <select
          name="model-layer"
          id="model-layer"
          value={mapState.modelLayer}
          onChange={setModelLayer}
        >
          <option value="">None</option>
          {modelLayerNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div class={style.input}>
        <label for="model-layer-option">Model Layer Option</label>
        <select
          name="model-layer-option"
          id="model-layer-option"
          value={mapState.subtype}
          onChange={setSubtype}
          disabled={!subtypeEnabled}
        >
          {((modelLayers[mapState.modelLayer] || {}).subtypes || []).map(
            (name) => (
              <option key={name} value={name}>
                {name}
              </option>
            )
          )}
        </select>
      </div>
      <div class={style.input}>
        <div>
          <label for="year">Year</label>:{" "}
          <span class={style.year}>{mapState.year}</span>
        </div>
        <input
          type="range"
          id="year"
          name="year"
          min="0"
          max="50"
          step="10"
          disabled={!yearEnabled}
          value={mapState.year}
          onInput={setYear}
        />
      </div>
      <div class={style.input}>
        <label for="political-boundary">Political Boundary</label>
        <select
          name="political-boundary"
          id="political-boundary"
          value={mapState.politicalBoundary}
          onChange={setPoliticalBoundary}
        >
          <option value="">None</option>
          <option value="parish">Parish</option>
          <option value="uscd">U.S. Congressional District</option>
          <option value="lash">Louisiana State House District</option>
          <option value="lass">Louisiana State Senate District</option>
        </select>
      </div>
    </div>
  );
};

export default Layers;
