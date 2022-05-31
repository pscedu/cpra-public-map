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
  path,
  projectMap,
  updateMapState,
  slideId,
}) => {
  const slides = children;
  let currentSlide = slides[0];
  let currentIdx = 0;
  if (slideId)
    for (let slideIdx in slides) {
      let slide = slides[slideIdx];
      if (slide.props.id == slideId) {
        currentSlide = slide;
        currentIdx = parseInt(slideIdx, 10);
        break;
      }
    }

  let { layerSpec, projectId } = currentSlide.props;
  useEffect(() => {
    if (mapState.subtype) prevSubypes[mapState.layer] = mapState.subtype;
    updateMapState({
      layer: layerSpec.name,
      subtype: layerSpec.subtypes
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
          path={path}
          slides={slides}
        />
      ) : null}
    </div>
  );
};

export default Slides;
