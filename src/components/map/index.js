import { h, render, Component } from 'preact';
import { route } from 'preact-router';
import style from './style.css';
import { getStyle } from './mapstyle'


class Map extends Component {
	projectLayers = [
		"project-polygon-lb",
		"project-polygon-mc",
		"project-line-bs",
		"project-line-di",
		"project-line-hr",
		"project-line-rr",
		"project-line-sr",
		"project-point-di",
		"project-point-hr",
		"project-point-sr"
	]

	shouldComponentUpdate(props) {
		if (this.map) {
			this.map.setStyle(getStyle(props.services, props.mapState));
			if (props.projectBbox !== this.props.projectBbox) {
				if (props.projectBbox[0] == props.projectBbox[2]) {
					// Point project
					this.map.easeTo({
						center: props.projectBbox.slice(0, 2),
						zoom: 10
					});
				} else {
					// Line/polygon/multipoint project
					this.map.fitBounds(props.projectBbox);
				}
				
			}
		}
			
		return false;
	}

	componentDidMount() {
		this.map = new maplibregl.Map({
			container: this.base,
			style: (this.props.services) ?
				getStyle(this.props.services, this.props.mapState) : null,
			center: [-91.215, 29.41],
			maxBounds: [-91.215 - 5, 29.41 - 3, -91.215 + 5, 29.41 + 3],
			maxZoom: 12,
			minZoom: 6,
			zoom: 8,
			hash: true
		});

		this.map.on("idle", () => {
			if (this.props.mapState.prevYear !== null) this.props.setMapState({
				...this.props.mapState,
				prevYear: null
			});
		});

		this.projectLayers.forEach((layerName) => {
			this.map.on("click", layerName, (e) => {
				let projectId = e.features[0].properties.project_number
					.toLowerCase().replace(/\./g, "");
				route(`/detail/${projectId}`);
			});
			this.map.on("mouseenter", layerName,
				() => this.map.getCanvas().style.cursor = "pointer");
			this.map.on("mouseleave", layerName,
				() => this.map.getCanvas().style.cursor = "");
		});

	}

	fitBounds(xmin, ymin, xmax, ymax) {
		console.log(xmin, ymin, xmax, ymax);
	}

	render() {
		return <div class={style.map} />;
	}
}

export default Map;