import { h } from "preact";
import { useContext, useLayoutEffect, useRef } from "preact/hooks";
import style from "./style.css";
import * as config from "../../helpers/config";
import { State } from "../../helpers/state";
import { getMapPadding } from "../../helpers/utils";
import { getStyle } from "../../helpers/mapstyle";

const Map = () => {
  const {
    group,
    map,
    politicalBoundary,
    prevLayerInfo,
    printing,
    scenario,
    selection,
    services,
    showProjects,
    subtype,
    view,
    year,
  } = useContext(State);
  const { mapDefaults, maxBounds } = config;
  const container = useRef();
  useLayoutEffect(() => {
    // eslint-disable-next-line no-undef
    let mlgl = new maplibregl.Map({
      bounds: mapDefaults.bounds,
      container: container.current,
      fitBoundsOptions: {
        padding: getMapPadding(),
      },
      style: getStyle({
        group,
        politicalBoundary,
        prevLayerInfo,
        scenario,
        selection,
        services,
        showProjects,
        subtype,
        view,
        year,
      }),
      dragRotate: false,
      hash: "map",
      maxBounds,
      maxZoom: 12,
      minZoom: 6,
    });

    mlgl.touchZoomRotate.disableRotation();

    mlgl.addControl(
      // eslint-disable-next-line no-undef
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    map.value = mlgl;
  }, []);

  return (
    <div
      ref={container}
      class={`${style.map} ${printing.value ? style.printing : ""}`}
    />
  );
};

export default Map;
