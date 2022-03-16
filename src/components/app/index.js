import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Router } from 'preact-router';

import * as config from './config';
import { useServices } from './hooks';
import Header from '../header';
import Layers from '../layers';
import Map from '../map';
import Toolbar from '../toolbar';
import Explore from '../../routes/explore';


const App = () => {
    const services = useServices(config.servicesUrl);
    const [mapState, setMapState] = useState({
        showProjects: true,
		modelLayer: "",
		prevYear: null,
		year: 50
    });
	return (
		<div id="app">
			<Header />
			<Toolbar />
			<Layers {...{services, mapState, setMapState}} />
			<Map {...{servicesUrl: config.servicesUrl, services, mapState, setMapState}} />
			<Router>
				<Explore path="/" />
			</Router>
		</div>
	);
}

export default App;
