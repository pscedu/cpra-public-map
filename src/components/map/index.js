import { h, render, Component } from 'preact';
import style from './style.css';
import { getStyle } from './mapstyle'


class Map extends Component {
	shouldComponentUpdate() {
		return false;
	}

	componentWillReceiveProps(nextProps) {
		// you can do something with incoming props here if you need
	}

	componentDidMount() {
		this.map = new maplibregl.Map({
			container: this.base,
			style: getStyle(["projects"]),
			center: [-91.27, 29.8],
			zoom: 8,
			hash: true
		});
	}

	render() {
		return <div class={style.map} />;
	}
}

export default Map;