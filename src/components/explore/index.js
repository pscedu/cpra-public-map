import { h } from "preact";
import style from "./style.css";

import Disclaimer from "../disclaimer";
import ProjectDetail from "../project-detail";
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
  layer,
  mapState,
  layers,
  projectMap,
  projects,
  projectTypeDescriptions,
  projectTypes,
  selection,
  updateMapState,
}) => {
  if (!layers) return;

  const currentIdx = viewOrder.indexOf(mapState.view);
  const setCurrentIdx = (idx) => updateMapState({ view: viewOrder[idx] });
  const project = projectMap[selection.project];

  const clearProject = (e) => {
    e.preventDefault();
    fireEvent("searchClearResult");
  };

  let projectsSlide = project ? (
    <Slide tabTitle="Projects" layerSpec={layers["Projects"]} tabClass="green">
      <a class={style["close-button"]} href="#" onClick={clearProject}>
        <span class="sr-only">Close</span>
      </a>
      <ProjectDetail
        project={project}
        projectTypes={projectTypes}
        projectTypeDescriptions={projectTypeDescriptions}
      />
    </Slide>
  ) : (
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
  );

  return (
    <Slides
      currentIdx={currentIdx}
      layer={layer}
      mapState={mapState}
      projectMap={projectMap}
      setCurrentIdx={setCurrentIdx}
      updateMapState={updateMapState}
    >
      <Slide
        controls={["scenario", "group", "year"]}
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
        controls={["scenario", "group", "year"]}
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
        controls={["scenario", "subtype", "year"]}
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
      {projectsSlide}
    </Slides>
  );
};

export default Explore;
