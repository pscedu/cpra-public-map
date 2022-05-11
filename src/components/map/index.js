import { h, Component } from "preact";
import style from "./style.css";
import { fireEvent, getProjectResult } from "../../utils";
import { getStyle } from "./mapstyle";

class Map extends Component {
  center = [-91.215, 29.41];
  maxBounds = [-91.215 - 5, 29.41 - 3, -91.215 + 5, 29.41 + 3];
  projectLayers = [
    "project-polygon-lb",
    "project-polygon-mc",
    "project-line-bs-or-sr",
    "project-line-di-hr",
    "project-line-rr",
    "project-line-sp",
    "project-point-di-hr",
    "project-point-sr",
  ];

  shouldComponentUpdate(props) {
    if (this.map) this.map.setStyle(this.getStyle(props));
    return false;
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    this.map = new maplibregl.Map({
      container: this.base,
      style: this.props.services ? getStyle(this.props) : null,
      center: this.center,
      dragRotate: false,
      hash: true,
      maxBounds: this.maxBounds,
      maxZoom: 12,
      minZoom: 6,
      zoom: 8,
    });

    this.map.touchZoomRotate.disableRotation();

    this.map.on("idle", () => {
      if (this.props.mapState.prevYear !== null)
        this.props.setMapState({
          ...this.props.mapState,
          prevYear: null,
        });
    });

    this.projectLayers.forEach((layerName) => {
      this.map.on("click", layerName, (e) => {
        if (!this.projectMap) {
          this.projectMap = {};
          for (let project of this.props.projects)
            this.projectMap[project.project_id] = project;
        }
        let project = this.projectMap[e.features[0].properties.project_id];
        fireEvent("searchSelectResult", { result: getProjectResult(project) });
      });
      this.map.on(
        "mouseenter",
        layerName,
        () => (this.map.getCanvas().style.cursor = "pointer")
      );
      this.map.on(
        "mouseleave",
        layerName,
        () => (this.map.getCanvas().style.cursor = "")
      );
    });

    window.addEventListener("mapFitBounds", (e) =>
      this.map.fitBounds(e.detail.bounds, e.detail.options)
    );
  }

  getStyle(props) {
    return getStyle(
      props.services,
      props.mapState,
      props.projects,
      this.maxBounds
    );
  }

  render() {
    return <div class={style.map} />;
  }
}

export default Map;
