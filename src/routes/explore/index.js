import { h } from "preact";
import style from "./style.css";

import Drawer from "../../components/drawer";
import ProjectDetail from "../../components/project-detail";
import ProjectList from "../../components/project-list";
import Slide from "../../components/slide";
import Slides from "../../components/slides";
import { fireEvent } from "../../utils";

const Explore = ({
  mapState,
  layers,
  path,
  projects,
  projectTypeDescriptions,
  projectTypes,
  selection,
  setMapState,
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
        setMapState={setMapState}
        slideId={slideId}
        navigation="tabs"
      >
        <Slide
          controls={["environment", "plan", "year"]}
          icon="earth"
          id="land-change"
          layerSpec={layers["Land Change"]}
          setSlideState={setMapState}
          slideState={mapState}
          tabTitle="Land Change"
        />
        <Slide
          controls={["environment", "plan", "year"]}
          icon="leaf"
          id="vegetation-type"
          layerSpec={layers["Vegetation Type"]}
          setSlideState={setMapState}
          slideState={mapState}
          tabTitle="Vegetation Type"
        />
        <Slide
          controls={["environment", "plan", "subtype", "year"]}
          icon="water"
          id="flood-risk"
          layerSpec={layers["Flood Depth"]}
          setSlideState={setMapState}
          slideState={mapState}
          tabTitle="Flood Risk"
        />
        <Slide
          controls={["environment", "plan", "year"]}
          icon="people"
          id="social-vulnerability"
          layerSpec={{}}
          setSlideState={setMapState}
          slideState={mapState}
          tabTitle="Social Vulnerability"
        />
        {projectsSlide}
      </Slides>
    </Drawer>
  );
};

export default Explore;
