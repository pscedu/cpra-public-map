import { h } from "preact";
import style from "./style.css";

import Disclaimer from "../disclaimer";
import ProjectList from "../project-list";
import Slide from "../slide";
import Slides from "../slides";

const viewOrder = [
  "land-change",
  "vegetation-type",
  "flood-depth",
  "damage",
  "projects",
];

const Explore = ({
  dismissOverlay,
  mapState,
  overlaySlide,
  projectMap,
  projects,
  projectTypeDescriptions,
  projectTypes,
  updateMapState,
  views,
}) => {
  const currentIdx = viewOrder.indexOf(mapState.view);
  const setCurrentIdx = (idx) => updateMapState({ view: viewOrder[idx] });

  return (
    <Slides
      currentIdx={currentIdx}
      dismissOverlay={dismissOverlay}
      mapState={mapState}
      overlaySlide={overlaySlide}
      projectMap={projectMap}
      setCurrentIdx={setCurrentIdx}
      updateMapState={updateMapState}
    >
      <Slide
        controls={["scenario", "group", "year", "projects"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["land-change"]}
      >
        <div class={style["slide-explanation"]}>
          <Disclaimer />
        </div>
      </Slide>
      <Slide
        controls={["scenario", "group", "year", "projects"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["vegetation-type"]}
      >
        <div class={style["slide-explanation"]}>
          <Disclaimer />
        </div>
      </Slide>
      <Slide
        controls={["scenario", "subtype", "year", "projects"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views["flood-depth"]}
      >
        <div class={style["slide-explanation"]}>
          <Disclaimer />
        </div>
      </Slide>
      <Slide
        controls={["scenario", "group", "year", "damage", "projects"]}
        updateSlideState={updateMapState}
        slideState={mapState}
        view={views.damage}
      >
        <div class={style["slide-explanation"]}>
          <Disclaimer />
        </div>
      </Slide>
      <Slide
        updateSlideState={updateMapState}
        slideState={mapState}
        tabClass="green"
        view={views.projects}
      >
        <ProjectList
          projects={projects}
          projectTypeDescriptions={projectTypeDescriptions}
          projectTypes={projectTypes}
        />
      </Slide>
    </Slides>
  );
};

export default Explore;
