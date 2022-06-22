import { h } from "preact";
import style from "./style.css";

import ProjectDetail from "../project-detail";
import ProjectList from "../project-list";
import Slide from "../slide";
import Slides from "../slides";
import { fireEvent } from "../../utils";

const layerOrder = [
  "Land Change",
  "Vegetation Type",
  "Flood Depth",
  // "Social Vulnerability",
  "Projects",
];

const Explore = ({
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

  const currentIdx = layerOrder.indexOf(mapState.layer);
  const setCurrentIdx = (idx) => updateMapState({ layer: layerOrder[idx] });
  const project = projectMap[selection.project];

  const clearProject = (e) => {
    e.preventDefault();
    fireEvent("searchClearResult");
  };

  let projectsSlide = project ? (
    <Slide
      title={project.name}
      tabTitle="Projects"
      layerSpec={layers["Projects"]}
      icon="cube"
    >
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
    <Slide tabTitle="Projects" layerSpec={layers["Projects"]} icon="cube">
      <ProjectList
        projects={projects}
        projectTypeDescriptions={projectTypeDescriptions}
        projectTypes={projectTypes}
      />
    </Slide>
  );

  return (
    <Slides
      currentIdx={currentIdx}
      mapState={mapState}
      navigation="tabs"
      projectMap={projectMap}
      setCurrentIdx={setCurrentIdx}
      updateMapState={updateMapState}
    >
      <Slide
        controls={["scenario", "group", "year"]}
        controlsPosition="start"
        cssClass={style["model-slide"]}
        icon="earth"
        layerSpec={layers["Land Change"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        tabTitle="Land Change"
      >
        <p class={style["slide-explanation"]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          tellus nulla, lacinia non molestie non, blandit non orci. Nulla sit
          amet gravida odio, a consectetur sem.
        </p>
      </Slide>
      <Slide
        controls={["scenario", "group", "year"]}
        controlsPosition="start"
        cssClass={style["model-slide"]}
        icon="leaf"
        layerSpec={layers["Vegetation Type"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        tabTitle="Vegetation Type"
      >
        <p class={style["slide-explanation"]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          tellus nulla, lacinia non molestie non, blandit non orci. Nulla sit
          amet gravida odio, a consectetur sem.
        </p>
      </Slide>
      <Slide
        controls={["scenario", "subtype", "year"]}
        controlsPosition="start"
        cssClass={style["model-slide"]}
        icon="water"
        layerSpec={layers["Flood Depth"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        tabTitle="Flood Depth"
      >
        <p class={style["slide-explanation"]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          tellus nulla, lacinia non molestie non, blandit non orci. Nulla sit
          amet gravida odio, a consectetur sem.
        </p>
      </Slide>
      {/* <Slide
        controls={["scenario", "group", "year"]}
        icon="people"
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
