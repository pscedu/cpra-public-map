import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Router } from 'preact-router';

import * as config from './config';
import { useLayers } from './hooks';
import Header from '../header';
import Layers from '../layers';
import Map from '../map';
import Toolbar from '../toolbar';
import Explore from '../../routes/explore';


const App = () => {
    const layers = useLayers(config.servicesUrl);
    const [mapState, setMapState] = useState({
        visibleLayers: ["Projects"],
        year: 50
    });
	return (
		<div id="app">
			<Header />
			<Toolbar />
			<Layers {...{layers, mapState, setMapState}} />
			<Map {...{servicesUrl: config.servicesUrl, layers, mapState}} />
			<Router>
				<Explore path="/" />
			</Router>
		</div>
	);
}

export default App;
