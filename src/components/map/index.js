import { h, render, Component } from 'preact';
import style from './style.css';
import { getStyle } from './mapstyle'


class Map extends Component {

	shouldComponentUpdate() {
		return false;
	}

	componentWillReceiveProps(props) {
		if (this.map)
			this.map.setStyle(getStyle(props.services, props.mapState));
	}

	componentDidMount() {
		this.map = new maplibregl.Map({
			container: this.base,
			style: (this.props.services) ?
				getStyle(this.props.services, this.props.mapState) : null,
			center: [-91.27, 29.8],
			zoom: 8,
			hash: true
		});

		this.map.on("idle", () => {
			if (this.props.mapState.prevYear !== null) this.props.setMapState({
				...this.props.mapState,
				prevYear: null
			});
		});

	}

	render() {
		return <div class={style.map} />;
	}
}

export default Map;