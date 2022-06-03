import { h } from "preact";
import { useEffect } from "preact/hooks";
import style from "./style.css";

import SlideNavigation from "../slide-navigation";

const prevSubypes = {};

const Slides = ({
  arrows,
  children,
  cssClass,
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
    if (mapState.subtype) prevSubypes[mapState.layer] = mapState.subtype;
    updateMapState({
      layer: layerSpec.name,
      subtype:
        (layerSpec.subtypes || []).length > 0
          ? prevSubypes[layerSpec.name] || layerSpec.subtypes[0]
          : null,
    });

    let project = projectMap[projectName];
    if (project) project.select();
  }, [currentIdx]);

  return (
    <div class={`${style.slides} ${cssClass || ""}`}>
      {currentSlide}
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
