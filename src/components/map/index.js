import { h } from "preact";
import { useContext, useEffect, useRef } from "preact/hooks";
import * as config from "../../helpers/config";
import { State } from "../../helpers/state";
import { getMapPadding } from "../../helpers/utils";
import { getStyle } from "../../helpers/mapstyle";

const Map = () => {
  const {
    group,
    layoutRendered,
    map,
    printing,
    politicalBoundary,
    prevLayerInfo,
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
  useEffect(() => {
    if (!(layoutRendered.value && container.current)) return;
    // eslint-disable-next-line no-undef
    let mlgl = new maplibregl.Map(
      {
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
        minZoom: 3,
      },
      [layoutRendered.value, container.current]
    );

    mlgl.touchZoomRotate.disableRotation();
    mlgl.touchPitch.disable();

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
      style={{
        flex: "1 0 0",
        height: printing.value ? "100%" : "100vh",
        width: "100%",
      }}
    />
  );
};

export default Map;
