import { h } from "preact";
import { useState } from "preact/hooks";

import * as config from "./config";
import {
  useHashState,
  useHashVar,
  useLayers,
  useProjects,
  useSearchIndex,
  useServices,
} from "./hooks";

import Drawer from "../drawer";
import Explore from "../explore";
import Header from "../header";
import Legend from "../legend";
import Map from "../map";
import Story from "../story";
import Toolbar from "../toolbar";
import Watermark from "../watermark";

const App = () => {
  const projects = useProjects(config.projectListUrl);
  const projectMap = {};
  projects.forEach((proj) => (projectMap[proj.project_id] = proj));

  const searchIndex = useSearchIndex(projects);
  const services = useServices(config.servicesUrl);
  const layers = useLayers(services);
  const [selection, setSelection] = useState({});
  const [mapState, updateMapState] = useHashState(
    {
      environment: "S08",
      layer: "Land Change",
      plan: "G500",
      politicalBoundary: null,
      prevYear: null,
      subtype: null,
      year: "50",
    },
    ["prevYear"]
  );
  const [storySlide, setStorySlide] = useHashVar("slide", null);

  const drawerContent =
    storySlide == null ? (
      <Explore
        projectMap={projectMap}
        projects={projects}
        projectTypeDescriptions={config.projectTypeDescriptions}
        projectTypes={config.projectTypes}
        selection={selection}
        mapState={mapState}
        layers={layers}
        updateMapState={updateMapState}
      />
    ) : (
      <Story
        layers={layers}
        projectMap={projectMap}
        mapState={mapState}
        slide={storySlide === null ? storySlide : parseInt(storySlide, 10)}
        setSlide={setStorySlide}
        updateMapState={updateMapState}
      />
    );
  const drawerTitle =
    storySlide === null ? mapState.layer || "Explore" : "Guided Tour";

  return (
    <div id="app">
      <Header
        geocodeUrl={config.geocodeUrl}
        searchIndex={searchIndex}
        setSelection={setSelection}
        setStorySlide={setStorySlide}
        storySlide={storySlide}
      />
      <Legend legends={config.legends} mapState={mapState} />
      <Toolbar />
      <Watermark>DRAFT</Watermark>
      <Map
        {...{
          projects,
          servicesUrl: config.servicesUrl,
          services,
          mapState,
          selection,
          updateMapState,
        }}
      />
      <Drawer title={drawerTitle} open={true}>
        {drawerContent}
      </Drawer>
    </div>
  );
};

export default App;
