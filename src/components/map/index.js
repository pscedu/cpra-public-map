import { h, Component } from "preact";
import { fireEvent } from "../../utils";
import { getStyle } from "./mapstyle";

class Map extends Component {
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
    "project-icon",
    "project-label",
  ];

  shouldComponentUpdate(props) {
    if (this.map) this.map.setStyle(this.getStyle(props));
    return false;
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    this.map = new maplibregl.Map({
      bounds: this.props.mapDefaults.bounds,
      container: this.base,
      fitBoundsOptions: {
        padding: this.props.mapDefaults.padding,
      },
      style: this.props.services ? getStyle(this.props) : null,
      dragRotate: false,
      hash: "map",
      maxBounds: this.maxBounds,
      maxZoom: 12,
      minZoom: 6,
    });

    this.map.touchZoomRotate.disableRotation();

    this.map.on("idle", () => {
      if (this.props.mapState.prevYear !== null)
        this.props.updateMapState({
          prevYear: null,
        });
    });

    this.map.on("click", "search-screen", (e) => {
      fireEvent("searchClearResult");
    });

    this.projectLayers.forEach((layerName) => {
      this.map.on("click", layerName, (e) => {
        if (!this.projectMap) {
          this.projectMap = {};
          for (let project of this.props.projects)
            this.projectMap[project.name] = project;
        }
        let project = this.projectMap[e.features[0].properties.name];
        project.select();
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
      props.layer,
      props.selection,
      this.maxBounds
    );
  }

  render() {
    return (
      <div
        style={{
          bottom: 0,
          left: 0,
          position: "absolute",
          right: 0,
          top: "45px",
        }}
      />
    );
  }
}

export default Map;
