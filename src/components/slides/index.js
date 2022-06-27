import { h } from "preact";
import { useEffect } from "preact/hooks";
import style from "./style.css";

import SlideNavigation from "../slide-navigation";

const prevSubypes = {};
const selectValue = (values, currentValue) => {
  if (values.includes(currentValue) || !values.length) return currentValue;
  return values[0];
};

const Slides = ({
  arrows,
  children,
  cssClass,
  layer,
  mapState,
  navigation,
  projectMap,
  updateMapState,
  currentIdx,
  setCurrentIdx,
}) => {
  const slides = Array.isArray(children) ? children : [children];
  let currentSlide = slides[currentIdx];

  let { layerSpec, projectName } = currentSlide.props;
  useEffect(() => {
    if (!layerSpec) return;
    if (mapState.subtype) prevSubypes[layer] = mapState.subtype;
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
      year: currentSlide.props.year || mapState.year,
    });

    let project = projectMap[projectName];
    if (project) project.select();
  }, [currentIdx]);

  return (
    <div class={`${style.slides} ${cssClass || ""}`}>
      <div
        class={style.strip}
        style={{
          left: `-${currentIdx * 100}%`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides}
      </div>
      {slides.length > 1 ? (
        <SlideNavigation
          arrows={arrows}
          currentIdx={currentIdx}
          navigationType={navigation}
          slides={slides}
          setCurrentIdx={setCurrentIdx}
        />
      ) : null}
    </div>
  );
};

export default Slides;
