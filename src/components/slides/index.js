import { h } from "preact";
import style from "./style.css";

import SlideNavigation from "../slide-navigation";
import { useEffect } from "preact/hooks";

const getTabLinks = (slides, start, end, currentIdx) =>
  slides.slice(start, end).map((slide, i) => (
    <a
      key={slide.props.id}
      href={`/${slide.props.id}`}
      class={`${style.tab} ${
        style[i === currentIdx ? "tab-active" : "tab-inactive"]
      }`}
    >
      <span class={style["tab-inner"]}>
        {slide.props["tab-title"] || slide.props.title}
      </span>
    </a>
  ));

const Slides = ({
  children,
  mapState,
  path,
  projectMap,
  setMapState,
  slideId,
  tabs,
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
  let prevTabs = tabs
    ? getTabLinks(slides, 0, currentIdx + 1, currentIdx)
    : null;
  let nextTabs = tabs
    ? getTabLinks(slides, currentIdx + 1, slides.length + 1)
    : null;

  let { modelLayer, projectId } = currentSlide.props;
  useEffect(() => {
    if (modelLayer && modelLayer != mapState.modelLayer)
      setMapState({
        ...mapState,
        modelLayer,
      });

    let project = projectMap[projectId];
    if (project) project.zoomToBbox();
  }, [modelLayer, projectId]);

  return (
    <div class={style.slides}>
      {prevTabs}
      {currentSlide}
      {nextTabs}
      {slides.length > 1 ? (
        <SlideNavigation
          path={path}
          current={currentSlide}
          currentIdx={currentIdx}
          prev={slides[currentIdx - 1]}
          next={slides[currentIdx + 1]}
          count={slides.length}
        />
      ) : null}
    </div>
  );
};

export default Slides;
