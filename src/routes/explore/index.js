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
  path,
  projects,
  projectTypeDescriptions,
  projectTypes,
  selection,
  setMapState,
  slideId,
}) => {
  const projectMap = {};
  projects.forEach((proj) => (projectMap[proj.project_id] = proj));

  let project = projectMap[selection.project];

  const clearProject = (e) => {
    e.preventDefault();
    fireEvent("searchClearResult");
  };

  let projectsSlide = project ? (
    <Slide title={project.name} id="projects" tab-title="Projects">
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
    <Slide id="projects" tab-title="Projects">
      <ProjectList
        projects={projects}
        projectTypeDescriptions={projectTypeDescriptions}
        projectTypes={projectTypes}
      />
    </Slide>
  );

  return (
    <Drawer title="Explore" open={true}>
      <Slides
        tabs={true}
        path={path}
        slideId={slideId}
        projectMap={projectMap}
        mapState={mapState}
        setMapState={setMapState}
      >
        <Slide
          id="introduction"
          title="Welcome to the Louisiana Coastal Protection and Restoration Authority Data Viewer"
          tab-title="Introduction"
        >
          The land change and vegetation data from this interactive map
          (currently in draft form) will help to inform decisions about coastal
          restoration and risk reduction projects in Louisiana as part of the
          2023 Coastal Master Plan. Additional data including flood depths,
          estimated annual damage, and structure exposure will be added as it
          becomes available.{" "}
          <strong>
            Use the arrows below and the map layers panel above to explore the
            map.
          </strong>
        </Slide>
        <Slide
          id="land-change"
          title="Land Change: Lower Barataria Landbridge"
          tab-title="Land Change"
          modelLayer="Land Change"
          projectId="lower-barataria-landbridge"
        >
          <p>
            The combination of sea level rise and land subsidence contributes
            significantly to rapid rates of land loss in coastal Louisiana. As
            marsh is converted to open water, the Louisiana coast loses habitat
            and its ability to limit the impacts of large storms.{" "}
            <strong>
              Use the year slider in the map layers box to see projected land
              loss over time without any action.
            </strong>
          </p>
          <p>
            The proposed Lower Barataria Landbridge project is intended to act
            as a natural barrier to manage hydrology in the basin, mitigate the
            impacts of sea level rise, and support marsh health in this
            ecologically diverse region. Through our Future With Action
            modeling, we hope to see the Lower Barataria Landbridge preserve
            marsh and mitigate flood risk for coastal residents. If the project
            performs well over the 50 year model period, it may be selected as a
            2023 Louisiana Coastal Master Plan project with the potential for
            future funding and construction.
          </p>
        </Slide>
        <Slide
          id="vegetation-type"
          title="Vegetation Type: Atchafalaya River Diversion"
          tab-title="Vegetation Type"
          modelLayer="Vegetation Type"
          projectId="atchafalaya-river-diversion"
        >
          <p>
            A major issue in some parts of coastal Louisiana is the inland
            migration of salinity over time. Vegetation that thrives is fresher
            environments is killed by increased salinity, and fresh-brackish
            species are compressed to smaller habitable areas (or completely
            wiped out in some cases).{" "}
            <strong>
              Use the year slider in the map layers box to see how vegetation is
              projected to change over time without any action.
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
