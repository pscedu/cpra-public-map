import { h } from "preact";
import { useContext, useLayoutEffect, useRef } from "preact/hooks";
import * as config from "../../helpers/config";
import { State } from "../../helpers/state";
import { getMapPadding } from "../../helpers/utils";
import { getStyle } from "../../helpers/mapstyle";

const Map = () => {
  const { entry, map, prevEntry, printing, selection, services, showProjects } =
    useContext(State);
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
        entry,
        prevEntry,
        selection,
        services,
        showProjects,
      }),
      dragRotate: false,
      hash: "map",
      maxBounds,
      maxZoom: 12,
      minZoom: 3,
    });

    mlgl.touchZoomRotate.disableRotation();
    mlgl.touchPitch.disable();

    mlgl.addControl(
      // eslint-disable-next-line no-undef
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    map.value = mlgl;

    const resizeMapObs = new ResizeObserver(() => mlgl.resize());
    resizeMapObs.observe(container.current);
  });

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
