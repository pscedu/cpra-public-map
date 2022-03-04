import { h } from 'preact';
import style from './style.css';

const Layers = (props) => {
	const {layers, mapState, setMapState} = props;
	const layerIds = Object.keys(layers)
		.sort((a, b) => layers[a].name > layers[b].name);
	const onChangeLayer = (e) => setMapState({
		...mapState,
		visibleLayers: [e.target.value]
	});
	const onChangeYear = (e) => setMapState({
		...mapState,
		year: e.target.value
	});
	const yearEnabled = mapState.visibleLayers
		.filter(name => layers[name] !== undefined
			&& layers[name].type == "model").length > 0;
	return (
		<div class={style.layers}>
			<h2>Map Layers</h2>
			<div class={style.input}>
				<label for="layer" class="sr-only">Layer</label>
				<select name="layer" id="layer" value={mapState.visibleLayers[0]}
						onChange={onChangeLayer}>
					{layerIds.map((id) =>
						<option value={id}>{layers[id].name}</option>)}
				</select>
			</div>
			<div class={style.input}>
				<div>
					<label for="year">Year</label>:{" "}
					<span class={style.year}>{mapState.year}</span>
				</div>
				<input type="range" id="year" name="year"
					min="0" max="50" step="10" disabled={!yearEnabled}
					value={mapState.year} onInput={onChangeYear}></input>
			</div>
		</div>
	);
};

export default Layers;