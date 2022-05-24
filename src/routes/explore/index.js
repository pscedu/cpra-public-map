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
    <Drawer title="Explore" open={true}>
      <Slides
        mapState={mapState}
        modelLayer={null}
        path={path}
        projectMap={projectMap}
        setMapState={setMapState}
        slideId={slideId}
        tabs={true}
      >
        <Slide
          controls={["environment", "plan", "year"]}
          id="land-change"
          modelLayerSpec={modelLayers["Land Change"]}
          setSlideState={setMapState}
          slideState={mapState}
          title="Land Change"
        />
        <Slide
          controls={["environment", "plan", "year"]}
          id="vegetation-type"
          modelLayerSpec={modelLayers["Vegetation Type"]}
          setSlideState={setMapState}
          slideState={mapState}
          title="Vegetation Type"
        />
        {/* {projectsSlide} */}
      </Slides>
    </Drawer>
  );
};

export default Explore;
