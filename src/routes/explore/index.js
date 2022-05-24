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
  modelLayers,
  path,
  projects,
  projectTypeDescriptions,
  projectTypes,
  selection,
  setMapState,
  slideId,
}) => {
  if (!modelLayers) return;

  const projectMap = {};
  projects.forEach((proj) => (projectMap[proj.project_id] = proj));

  // let project = projectMap[selection.project];

  // const clearProject = (e) => {
  //   e.preventDefault();
  //   fireEvent("searchClearResult");
  // };

  // let projectsSlide = project ? (
  //   <Slide
  //     title={project.name}
  //     id="projects"
  //     tab-title="Projects"
  //     modelLayer={null}
  //   >
  //     <a class={style["close-button"]} href="#" onClick={clearProject}>
  //       <span class="sr-only">Close</span>
  //     </a>
  //     <ProjectDetail
  //       project={project}
  //       projectTypes={projectTypes}
  //       projectTypeDescriptions={projectTypeDescriptions}
  //     />
  //   </Slide>
  // ) : (
  //   <Slide id="projects" tab-title="Projects" modelLayer={null}>
  //     <ProjectList
  //       projects={projects}
  //       projectTypeDescriptions={projectTypeDescriptions}
  //       projectTypes={projectTypes}
  //     />
  //   </Slide>
  // );

  return (
    <Drawer title={mapState.modelLayer || "Explore"} open={true}>
      <Slides
        mapState={mapState}
        modelLayer={null}
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
          modelLayerSpec={modelLayers["Land Change"]}
          setSlideState={setMapState}
          slideState={mapState}
          tabTitle="Land Change"
        />
        <Slide
          controls={["environment", "plan", "year"]}
          icon="leaf"
          id="vegetation-type"
          modelLayerSpec={modelLayers["Vegetation Type"]}
          setSlideState={setMapState}
          slideState={mapState}
          tabTitle="Vegetation Type"
        />
        <Slide
          controls={["environment", "plan", "subtype", "year"]}
          icon="water"
          id="flood-risk"
          modelLayerSpec={modelLayers["Flood Depth"]}
          setSlideState={setMapState}
          slideState={mapState}
          tabTitle="Flood Risk"
        />
        <Slide
          controls={["environment", "plan", "year"]}
          icon="people"
          id="social-vulnerability"
          modelLayerSpec={{}}
          setSlideState={setMapState}
          slideState={mapState}
          tabTitle="Social Vulnerability"
        />
        {/* {projectsSlide} */}
      </Slides>
    </Drawer>
  );
};

export default Explore;
