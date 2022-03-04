import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Map from './map';
import Toolbar from './toolbar';
import Explore from '../routes/explore';

const App = () => (
	<div id="app">
		<Header />
		<Toolbar />
		<Map />
		<Router>
			<Explore path="/" />
		</Router>
	</div>
)

export default App;
