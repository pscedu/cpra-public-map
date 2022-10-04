import { h } from "preact";
import { useContext, useLayoutEffect, useRef } from "preact/hooks";
import { effect } from "@preact/signals";
import style from "./style.css";
import * as config from "../../helpers/config";
import { State } from "../../helpers/state";
import { fireEvent } from "../../helpers/utils";
import { getStyle } from "./mapstyle";

const Map = () => {
  const state = useContext(State);
  const { mapDefaults, maxBounds, projectLayers } = config;
  const container = useRef();
  useLayoutEffect(() => {
    // eslint-disable-next-line no-undef
    let map = new maplibregl.Map({
      bounds: mapDefaults.bounds,
      container: container.current,
      fitBoundsOptions: {
        padding: mapDefaults.padding,
      },
      style: getStyle(state),
      dragRotate: false,
      hash: "map",
      maxBounds,
      maxZoom: 12,
      minZoom: 6,
    });

    map.touchZoomRotate.disableRotation();

    map.addControl(
      // eslint-disable-next-line no-undef
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    // map.on("idle", () => {
    //   if (this.props.mapState.prevYear !== null)
    //     this.props.updateMapState({
    //       prevYear: null,
    //     });
    // });

    map.on("click", "search-screen", () => {
      fireEvent("searchClearResult");
    });

    projectLayers.forEach((layerName) => {
      map.on("click", layerName, (e) => {
        let project = state.projectMap.value[e.features[0].properties.name];
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

    state.map.value = map;
  }, []);

  effect(() => {
    if (state.map.value) state.map.value.setStyle(getStyle(state));
  });

  return (
    <div
      ref={container}
      class={`${style.map} ${state.printing.value ? style.printing : ""}`}
    />
  );
};

export default Map;
