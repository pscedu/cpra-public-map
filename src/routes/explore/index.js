import { h } from "preact";
import style from "./style.css";

import Drawer from "../../components/drawer";
import ProjectDetail from "../../components/project-detail";
import ProjectList from "../../components/project-list";
import Slide from "../../components/slide";

const Explore = ({
  mapState,
  projects,
  projectId,
  projectFilters,
  projectTypes,
  setMapState,
  setProjectBbox,
  setProjectFilters,
}) => {
  const projectMap = {};
  projects.forEach((proj) => (projectMap[proj.project_id] = proj));
  let project = projectMap[projectId];
  let selectedProjectId = (project || {}).project_id || "";
  if (mapState.selectedProjectId != selectedProjectId)
    setMapState({ ...mapState, selectedProjectId });

  let content = project ? (
    <Slide title={project.name}>
      <a class={style["close-button"]} href="/">
        <span class="sr-only">Close</span>
      </a>
      <ProjectDetail
        project={project}
        projectTypes={projectTypes}
        setProjectBbox={setProjectBbox}
      />
    </Slide>
  ) : (
    <Slide>
      <ProjectList
        projects={projects}
        projectFilters={projectFilters}
        projectTypes={projectTypes}
        setProjectFilters={setProjectFilters}
      />
    </Slide>
  );

  return (
    <Drawer title="Project List" open={true}>
      {content}
    </Drawer>
  );
};

export default Explore;
