import { h } from "preact";
import style from "./style.css";

import Drawer from "../drawer";
import ProjectDetail from "../project-detail";
import ProjectList from "../project-list";
import Slide from "../slide";
import Slides from "../slides";
import { fireEvent } from "../../utils";

const layerOrder = [
  "Land Change",
  "Vegetation Type",
  "Flood Depth",
  "Social Vulnerability",
  "Projects",
];

const Explore = ({
  mapState,
  layers,
  projects,
  projectTypeDescriptions,
  projectTypes,
  selection,
  updateMapState,
}) => {
  if (!layers) return;

  const currentIdx = layerOrder.indexOf(mapState.layer);
  const setCurrentIdx = (idx) => updateMapState({ layer: layerOrder[idx] });

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
    <Drawer title={mapState.layer || "Explore"} open={true}>
      <Slides
        currentIdx={currentIdx}
        mapState={mapState}
        navigation="tabs"
        projectMap={projectMap}
        setCurrentIdx={setCurrentIdx}
        updateMapState={updateMapState}
      >
        <Slide
          controls={["environment", "plan", "year"]}
          icon="earth"
          layerSpec={layers["Land Change"]}
          updateSlideState={updateMapState}
          slideState={mapState}
          tabTitle="Land Change"
        />
        <Slide
          controls={["environment", "plan", "year"]}
          icon="leaf"
          layerSpec={layers["Vegetation Type"]}
          updateSlideState={updateMapState}
          slideState={mapState}
          tabTitle="Vegetation Type"
        />
        <Slide
          controls={["environment", "plan", "subtype", "year"]}
          icon="water"
          layerSpec={layers["Flood Depth"]}
          updateSlideState={updateMapState}
          slideState={mapState}
          tabTitle="Flood Risk"
        />
        <Slide
          controls={["environment", "plan", "year"]}
          icon="people"
          layerSpec={{ name: "Social Vulnerability" }}
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
