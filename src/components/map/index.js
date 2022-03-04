import { h, render, Component } from 'preact';
import style from './style.css';
import { getStyle } from './mapstyle'


class Map extends Component {

	shouldComponentUpdate() {
		return false;
	}

	componentWillReceiveProps(props) {
		if (this.map)
			this.map.setStyle(getStyle(props.servicesUrl, props.layers, props.mapState));
	}

	componentDidMount() {
		this.map = new maplibregl.Map({
			container: this.base,
			style: getStyle(this.props.servicesUrl, this.props.layers, this.props.mapState),
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