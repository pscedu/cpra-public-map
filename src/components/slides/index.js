import { h } from "preact";
import { useEffect } from "preact/hooks";
import style from "./style.css";

import SlideNavigation from "../slide-navigation";

// const getTabLinks = (slides, start, end, currentIdx) =>
//   slides.slice(start, end).map((slide, i) => (
//     <a
//       key={slide.props.id}
//       href={`/${slide.props.id}`}
//       class={`${style.tab} ${
//         style[i === currentIdx ? "tab-active" : "tab-inactive"]
//       }`}
//     >
//       <span class={style["tab-inner"]}>
//         {slide.props["tab-title"] || slide.props.title}
//       </span>
//     </a>
//   ));

const Slides = ({
  arrows,
  children,
  mapState,
  navigation,
  path,
  projectMap,
  setMapState,
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

  let { modelLayerSpec, projectId } = currentSlide.props;
  useEffect(() => {
    setMapState({
      ...mapState,
      modelLayer: modelLayerSpec.name,
      subtype: null,
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
