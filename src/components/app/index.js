import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Router } from 'preact-router';

import * as config from './config';
import { useProjectList, useServices } from './hooks';
import Header from '../header';
import Layers from '../layers';
import Legend from '../legend';
import Map from '../map';
import Toolbar from '../toolbar';
import Explore from '../../routes/explore';


const App = () => {
	const projectList = useProjectList(config.projectListUrl);
    const services = useServices(config.servicesUrl);
    const [mapState, setMapState] = useState({
        showProjects: true,
		modelLayer: "",
		prevYear: null,
		year: 50
    });
	const [projectBbox, setProjectBbox] = useState(null);
	return (
		<div id="app">
			<Header />
			<Layers {...{services, mapState, setMapState}} />
			{(mapState.modelLayer !== "") ?
				<Legend legend={config.legends[mapState.modelLayer]} /> : null}
			<Map {...{projectBbox,
					servicesUrl: config.servicesUrl,
					services,
					mapState,
					setMapState}} />
			<Router>
				<Explore path="/:slideId?/:projectId?"
					projectList={projectList}
					projectTypes={config.projectTypes}
					setProjectBbox={setProjectBbox} />
			</Router>
		</div>
	);
}

export default App;
