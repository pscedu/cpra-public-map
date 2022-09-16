import { h } from "preact";
import style from "./style.css";

import Disclaimer from "../disclaimer";
import ProjectList from "../project-list";
import Slide from "../slide";
import Slides from "../slides";
import { fireEvent } from "../../utils";

const viewOrder = [
  "land-change",
  "vegetation-type",
  "flood-depth",
  // "social-vulnerability",
  "projects",
];

const Explore = ({
  dismissOverlay,
  layer,
  mapState,
  layers,
  overlaySlide,
  projectMap,
  projects,
  projectTypeDescriptions,
  projectTypes,
  updateMapState,
}) => {
  if (!layers) return;

  const currentIdx = viewOrder.indexOf(mapState.view);
  const setCurrentIdx = (idx) => updateMapState({ view: viewOrder[idx] });

  return (
    <Slides
      currentIdx={currentIdx}
      dismissOverlay={dismissOverlay}
      layer={layer}
      mapState={mapState}
      overlaySlide={overlaySlide}
      projectMap={projectMap}
      setCurrentIdx={setCurrentIdx}
      updateMapState={updateMapState}
    >
      <Slide
        controls={["scenario", "group", "year", "projects"]}
        controlsPosition="start"
        cssClass={style["model-slide"]}
        layerSpec={layers["Land Change"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        tabTitle="Land Change"
      >
        <div class={style["slide-explanation"]}>
          <Disclaimer />
        </div>
      </Slide>
      <Slide
        controls={["scenario", "group", "year", "projects"]}
        controlsPosition="start"
        cssClass={style["model-slide"]}
        layerSpec={layers["Vegetation Type"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        tabTitle="Vegetation Type"
      >
        <div class={style["slide-explanation"]}>
          <Disclaimer />
        </div>
      </Slide>
      <Slide
        controls={["scenario", "subtype", "year", "projects"]}
        controlsPosition="start"
        cssClass={style["model-slide"]}
        layerSpec={layers["Flood Depth"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        tabTitle="Flood Depth"
      >
        <div class={style["slide-explanation"]}>
          <Disclaimer />
        </div>
      </Slide>
      {/* <Slide
        controls={["scenario", "group", "year"]}
        layerSpec={{ name: "Social Vulnerability" }}
        updateSlideState={updateMapState}
        slideState={mapState}
        tabTitle="Social Vulnerability"
      /> */}
      <Slide
        tabTitle="Projects"
        layerSpec={layers["Projects"]}
        controls={["year"]}
        controlsPosition="start"
        updateSlideState={updateMapState}
        slideState={mapState}
        yearStep={1}
        tabClass="green"
      >
        <ProjectList
          mapState={mapState}
          projects={projects}
          projectTypeDescriptions={projectTypeDescriptions}
          projectTypes={projectTypes}
        />
      </Slide>
    </Slides>
  );
};

export default Explore;
