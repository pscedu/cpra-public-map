import { h } from "preact";
import style from "./style.css";

import Drawer from "../drawer";
import ProjectDetail from "../project-detail";
import ProjectList from "../project-list";
import Slide from "../slide";
import Slides from "../slides";
import { fireEvent } from "../../utils";

const Explore = ({
  mapState,
  layers,
  path,
  prevYear,
  projects,
  projectTypeDescriptions,
  projectTypes,
  selection,
  updateMapState,
  setPrevYear,
  slideId,
}) => {
  if (!layers) return;

  const projectMap = {};
  projects.forEach((proj) => (projectMap[proj.project_id] = proj));

  let project = projectMap[selection.project];

  const clearProject = (e) => {
    e.preventDefault();
    fireEvent("searchClearResult");
  };

  let projectsSlide = project ? (
    <Slide
      title={project.name}
      id="projects"
      tabTitle="Projects"
      layer="Projects"
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
    <Slide
      id="projects"
      tabTitle="Projects"
      layer="Projects"
      layerSpec={layers["Projects"]}
      icon="cube"
    >
      <ProjectList
        projects={projects}
        projectTypeDescriptions={projectTypeDescriptions}
        projectTypes={projectTypes}
      />
    </Slide>
  );

  return (
    <Drawer title={mapState.layer || "Explore"} open={true}>
      <Slides
        mapState={mapState}
        layer={null}
        path={path}
        projectMap={projectMap}
        updateMapState={updateMapState}
        slideId={slideId}
        navigation="tabs"
      >
        <Slide
          controls={["environment", "plan", "year"]}
          icon="earth"
          id="land-change"
          layerSpec={layers["Land Change"]}
          updateSlideState={updateMapState}
          slideState={mapState}
          tabTitle="Land Change"
        />
        <Slide
          controls={["environment", "plan", "year"]}
          icon="leaf"
          id="vegetation-type"
          layerSpec={layers["Vegetation Type"]}
          updateSlideState={updateMapState}
          slideState={mapState}
          tabTitle="Vegetation Type"
        />
        <Slide
          controls={["environment", "plan", "subtype", "year"]}
          icon="water"
          id="flood-risk"
          layerSpec={layers["Flood Depth"]}
          updateSlideState={updateMapState}
          slideState={mapState}
          tabTitle="Flood Risk"
        />
        <Slide
          controls={["environment", "plan", "year"]}
          icon="people"
          id="social-vulnerability"
          layerSpec={{}}
          updateSlideState={updateMapState}
          slideState={mapState}
          tabTitle="Social Vulnerability"
        />
        {projectsSlide}
      </Slides>
    </Drawer>
  );
};

export default Explore;
