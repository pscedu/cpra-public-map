import { h } from 'preact';
import style from './style.css';

const Layers = (props) => {
	const {services, mapState, setMapState} = props;
	if (!services) return null;

	const modelLayerYears = {};
	const modelLayerNames = [];
	for (let service of Object.values(services)) {
		if (service.name.indexOf("Base Map") != -1) continue;
		let [name, yearStr] = service.name.split(" - Year ");
		modelLayerYears[name] = modelLayerYears[name] || [];
		modelLayerYears[name].push(parseInt(yearStr));
		if (modelLayerNames.indexOf(name) == -1) modelLayerNames.push(name);
	}
	modelLayerNames.sort();

	const setShowProjects = (e) => setMapState({
		...mapState,
		showProjects: e.target.checked
	});
	
	const setModelLayer = (e) => setMapState({
		...mapState,
		modelLayer: e.target.value,
		prevYear: null
	});

	const setYear = (e) => {
		const year = parseInt(e.target.value);
		const hasYear = modelLayerYears[mapState.modelLayer].indexOf(year) == -1;
		setMapState({
			...mapState,
			year: year,
			prevYear: (hasYear) ? null : mapState.year
		});
	};

	const yearEnabled = mapState.modelLayer !== "";
	return (
		<div class={style.layers}>
			<h2>Map Layers</h2>
			<div class={style.input}>
				<input type="checkbox" id="show-projects"
					checked={mapState.showProjects} onChange={setShowProjects} />
				<label for="show-projects">Candidate Projects</label>
			</div>
			<div class={style.input}>
				<label for="model-layer">Model Layer</label>
				<select name="model-layer" id="model-layer" value={mapState.modelLayer}
						onChange={setModelLayer}>
					<option value="">None</option>
					{modelLayerNames.map((name) =>
						<option value={name}>{name}</option>)}
				</select>
			</div>
			<div class={style.input}>
				<div>
					<label for="year">Year</label>:{" "}
					<span class={style.year}>{mapState.year}</span>
				</div>
				<input type="range" id="year" name="year"
					min="0" max="50" step="10" disabled={!yearEnabled}
					value={mapState.year} onInput={setYear}></input>
			</div>
		</div>
	);
};

export default Layers;