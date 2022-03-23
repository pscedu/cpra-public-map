import { h } from "preact";

import Drawer from "../../components/drawer";
import ProjectDetail from "../../components/project-detail";
import ProjectList from "../../components/project-list";
import Slide from "../../components/slide";
import Slides from "../../components/slides";

const Explore = (props) => {
  const projectMap = {};
  props.projects.forEach((proj) => (projectMap[proj.project_id] = proj));
  let project = projectMap[props.projectId];

  return (
    <Drawer title="Project List" open={true}>
      <Slides slideId={props.slideId} path={props.path}>
        <Slide id="project-list">
          <ProjectList
            projects={props.projects}
            projectFilters={props.projectFilters}
            projectTypes={props.projectTypes}
            setProjectFilters={props.setProjectFilters}
          />
        </Slide>
        <Slide id="project" title={project ? project.name : undefined}>
          {project ? (
            <ProjectDetail
              project={project}
              projectTypes={props.projectTypes}
              setProjectBbox={props.setProjectBbox}
            />
          ) : null}
        </Slide>
      </Slides>
    </Drawer>
  );
};

export default Explore;
