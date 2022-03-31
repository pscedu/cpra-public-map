import { h } from "preact";
import style from "./style.css";

import Drawer from "../../components/drawer";
import ProjectDetail from "../../components/project-detail";
import ProjectList from "../../components/project-list";
import Slide from "../../components/slide";
import Slides from "../../components/slides";

const Explore = ({
  mapState,
  path,
  projects,
  projectId,
  projectFilters,
  projectTypes,
  setMapState,
  setProjectFilters,
  slideId,
}) => {
  const projectMap = {};
  projects.forEach((proj) => (projectMap[proj.project_id] = proj));
  let project = projectMap[projectId];
  let selectedProjectId = (project || {}).project_id || "";
  if (mapState.selectedProjectId != selectedProjectId)
    setMapState({ ...mapState, selectedProjectId });

  let projectsSlide = project ? (
    <Slide title={project.name} id="projects" tab-title="Projects">
      <a class={style["close-button"]} href="/projects">
        <span class="sr-only">Close</span>
      </a>
      <ProjectDetail project={project} projectTypes={projectTypes} />
    </Slide>
  ) : (
    <Slide id="projects" tab-title="Projects">
      <ProjectList
        projects={projects}
        projectFilters={projectFilters}
        projectTypes={projectTypes}
        setProjectFilters={setProjectFilters}
      />
    </Slide>
  );

  return (
    <Drawer title="Explore" open={true}>
      <Slides
        tabs={true}
        path={path}
        slideId={slideId}
        projectId={projectId}
        projectMap={projectMap}
        mapState={mapState}
        setMapState={setMapState}
      >
        <Slide id="introduction" title="Welcome!" tab-title="Introduction">
          Welcome to the portal!
        </Slide>
        <Slide
          id="land-change"
          title="Land Change"
          modelLayer="Land Change"
          projectId="lower-barataria-landbridge"
        >
          <p>
            As marsh is converted to open water, the Louisiana coast loses habit
            and its ability to suppress the impacts of large storms (e.g.
            Hurricane Ida).{" "}
            <strong>
              Use the year slider in the map layers box to see projected land
              loss over time.
            </strong>
          </p>
          <p>
            The proposed Lower Barataria Landbridge project was designed to act
            as a natural barrier to control hydrology in the basin, mitigate the
            impacts of sea level rise, and stimulate the natural regeneration of
            marsh in this ecologically diverse region. Through our Future With
            Action modeling (coming soon!) we hope to see the Lower Barataria
            Landbridge preserve marsh and mitigate flood risk for coastal
            residents. If the project performs well over the 50 year time
            period, it will be selected as a 2023 Louisiana Coastal Master Plan
            project with the potential for future funding and construction.
          </p>
        </Slide>
        <Slide
          id="vegetation-type"
          title="Vegetation Type"
          modelLayer="Vegetation Type"
          projectId="atchafalaya-river-diversion"
        >
          <p>
            A major coastal issue in Louisiana is the upward (or coastward)
            migration of salinity over time. Vegetation that thrives is fresher
            environments is killed by increased salinity, and fresh-brackish
            species are compressed to smaller habitable areas (or completely
            wiped out in some cases).{" "}
            <strong>
              Use the year slider in the map layers box to see how vegetation
              type is projected to change over time.
            </strong>
          </p>
          <p>
            The Atchafalaya River Diversion project was designed to convey fresh
            water from the Atchafalaya River into the Terrebonne basin in order
            to maintain a natural/healthy fresh-saline gradient.
          </p>
        </Slide>
        {projectsSlide}
      </Slides>
    </Drawer>
  );
};

export default Explore;
