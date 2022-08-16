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
    if (props.map) props.map.setStyle(this.getStyle(props));
    return false;
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    let map = new maplibregl.Map({
      bounds: this.props.mapDefaults.bounds,
      container: this.base,
      fitBoundsOptions: {
        padding: this.props.mapDefaults.padding,
      },
      style: this.props.services ? this.getStyle(this.props) : null,
      dragRotate: false,
      hash: "map",
      maxBounds: this.maxBounds,
      maxZoom: 12,
      minZoom: 6,
    });

    map.touchZoomRotate.disableRotation();

    // eslint-disable-next-line no-undef
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    map.on("idle", () => {
      if (this.props.mapState.prevYear !== null)
        this.props.updateMapState({
          prevYear: null,
        });
    });

    map.on("click", "search-screen", (e) => {
      fireEvent("searchClearResult");
    });

    this.projectLayers.forEach((layerName) => {
      map.on("click", layerName, (e) => {
        if (!this.projectMap) {
          this.projectMap = {};
          for (let project of this.props.projects)
            this.projectMap[project.name] = project;
        }
        let project = this.projectMap[e.features[0].properties.name];
        project.select();
      });
      map.on(
        "mouseenter",
        layerName,
        () => (map.getCanvas().style.cursor = "pointer")
      );
      map.on(
        "mouseleave",
        layerName,
        () => (map.getCanvas().style.cursor = "")
      );
    });

    window.addEventListener("mapFitBounds", (e) =>
      map.fitBounds(e.detail.bounds, e.detail.options)
    );

    window.addEventListener("mapResize", () => {
      window.requestAnimationFrame(() => map.resize());
    });

    this.props.setMap(map);
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
          right: this.props.printing ? 0 : "50px",
          top: this.props.printing ? 0 : "47px",
        }}
      />
    );
  }
}

export default Map;
