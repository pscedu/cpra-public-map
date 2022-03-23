import { h } from "preact";

import Drawer from "../../components/drawer";
import ProjectDetail from "../../components/project-detail";
import Slide from "../../components/slide";
import Slides from "../../components/slides";

const Explore = (props) => {
  const projectMap = {};
  props.projectList.forEach((proj) => (projectMap[proj.project_id] = proj));
  let project = projectMap[props.projectId] || props.projectList[0];

  return (
    <Drawer title="Introduction" open={true}>
      <Slides slideId={props.slideId} path={props.path}>
        <Slide id="projects" title="Planning for the Future">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            varius felis sed sodales sodales. Vestibulum fermentum malesuada
            gravida. Vestibulum porta neque ac est blandit suscipit. Suspendisse
            porttitor at risus et iaculis. Maecenas felis nunc, lobortis quis
            fringilla vel, auctor in nibh. Orci varius natoque penatibus et
            magnis dis parturient montes, nascetur ridiculus mus. Ut ut nunc
            tortor. Duis vel tincidunt lorem. Sed condimentum elit sed turpis
            euismod euismod. Aliquam quis pretium lorem.
          </p>
        </Slide>
        <Slide id="detail" title={project ? project.name : undefined}>
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
