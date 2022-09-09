import { h } from "preact";
import { useEffect, useLayoutEffect, useState } from "preact/hooks";
import style from "./style.css";
import { fireEvent } from "../../utils";

import SlideNavigation from "../slide-navigation";

const prevSubypes = {};
const selectValue = (values, currentValue) => {
  if (values.includes(currentValue) || !values.length) return currentValue;
  return values[0];
};

const Slides = ({
  children,
  cssClass,
  currentIdx,
  dismissOverlay,
  layer,
  mapState,
  navigationType = "tabs",
  overlaySlide,
  projectMap,
  setCurrentIdx,
  updateMapState,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const slides = Array.isArray(children) ? children : [children];
  let currentSlide = slides[currentIdx];

  useEffect(() => {
    window.addEventListener("slidesOpenDrawer", () => setDrawerOpen(true));
  }, []);

  let { layerSpec, projectName } = currentSlide.props;
  useEffect(() => {
    if (!layerSpec) return;
    if (mapState.subtype) prevSubypes[layer] = mapState.subtype;
    let year = currentSlide.props.year || mapState.year;
    if (mapState.view !== "projects") year = Math.floor(year / 10) * 10;
    updateMapState({
      group: selectValue(
        layerSpec.groups || [],
        currentSlide.props.group || mapState.group
      ),
      scenario: selectValue(
        layerSpec.scenarios || [],
        currentSlide.props.scenario || mapState.scenario
      ),
      subtype:
        (layerSpec.subtypes || []).length > 0
          ? prevSubypes[layerSpec.name] || layerSpec.subtypes[0]
          : null,
      year,
    });

    let project = projectMap[projectName];
    if (project) project.select();
  }, [currentIdx]);

  useLayoutEffect(() => {
    fireEvent("mapResize");
  }, [drawerOpen]);

  return (
    <div
      class={`${style.slides} ${cssClass || ""} ${
        style[drawerOpen ? "open" : "closed"]
      }`}
    >
      <div class={style.header}>
        <SlideNavigation
          currentIdx={currentIdx}
          drawerOpen={drawerOpen}
          navigationType={navigationType}
          setDrawerOpen={setDrawerOpen}
          slides={slides}
          setCurrentIdx={setCurrentIdx}
        />
      </div>
      {drawerOpen
        ? [
            <div
              key="strip"
              class={style.strip}
              style={{
                left: `-${currentIdx * 100}%`,
                width: `${slides.length * 100}%`,
              }}
            >
              {slides}
            </div>,
            overlaySlide ? (
              <div class={style.overlay}>
                <div class={style.header}>
                  <div class={style["overlay-title"]}>
                    {overlaySlide.props.tabTitle}
                  </div>
                  <button class={style.handle} onClick={dismissOverlay}>
                    <span class="sr-only">Close</span>
                  </button>
                </div>
                {overlaySlide}
              </div>
            ) : null,
          ]
        : null}
    </div>
  );
};

export default Slides;
