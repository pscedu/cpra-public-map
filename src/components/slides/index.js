import { h } from "preact";
import { useEffect } from "preact/hooks";
import style from "./style.css";

import SlideNavigation from "../slide-navigation";

const prevSubypes = {};

const Slides = ({
  arrows,
  children,
  mapState,
  navigation,
  projectMap,
  updateMapState,
  currentIdx,
  setCurrentIdx,
}) => {
  const slides = children;
  let currentSlide = slides[currentIdx];

  let { layerSpec, projectId } = currentSlide.props;
  useEffect(() => {
    if (mapState.subtype) prevSubypes[mapState.layer] = mapState.subtype;
    updateMapState({
      layer: layerSpec.name,
      subtype:
        (layerSpec.subtypes || []).length > 0
          ? prevSubypes[layerSpec.name] || layerSpec.subtypes[0]
          : null,
    });

    let project = projectMap[projectId];
    if (project) project.select();
  }, [currentIdx]);

  return (
    <div class={style.slides}>
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
