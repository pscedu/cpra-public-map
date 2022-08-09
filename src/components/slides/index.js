import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import style from "./style.css";

import SlideNavigation from "../slide-navigation";

const prevSubypes = {};
const selectValue = (values, currentValue) => {
  if (values.includes(currentValue) || !values.length) return currentValue;
  return values[0];
};

const Slides = ({
  children,
  cssClass,
  layer,
  mapState,
  projectMap,
  updateMapState,
  currentIdx,
  setCurrentIdx,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const slides = Array.isArray(children) ? children : [children];
  let currentSlide = slides[currentIdx];

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

  return (
    <div
      class={`${style.slides} ${cssClass || ""} ${
        style[drawerOpen ? "open" : "closed"]
      }`}
    >
      <div class={style.header}>
        <SlideNavigation
          currentIdx={currentIdx}
          navigationType="tabs"
          slides={slides}
          setCurrentIdx={setCurrentIdx}
        />
        <button class={style.handle} onClick={() => setDrawerOpen(!drawerOpen)}>
          <span class="sr-only">{drawerOpen ? "Close" : "Open"}</span>
        </button>
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
            <SlideNavigation
              key="arrows"
              currentIdx={currentIdx}
              navigationType="arrows"
              slides={slides}
              setCurrentIdx={setCurrentIdx}
            />,
          ]
        : null}
    </div>
  );
};

export default Slides;
