import { h } from "preact";
import style from "./style.css";

import Drawer from "../../components/drawer";
import ProjectDetail from "../../components/project-detail";
import ProjectList from "../../components/project-list";
import Slide from "../../components/slide";

const Explore = ({
  projects,
  projectId,
  projectFilters,
  projectTypes,
  setProjectBbox,
  setProjectFilters,
}) => {
  const projectMap = {};
  projects.forEach((proj) => (projectMap[proj.project_id] = proj));
  let project = projectMap[projectId];

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
