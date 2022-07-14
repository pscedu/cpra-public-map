import { h } from "preact";
import { useState } from "preact/hooks";
import { fireEvent } from "../../utils";

import * as config from "./config";
import {
  useHashState,
  useLayers,
  useProjects,
  useSearchIndex,
  useServices,
} from "./hooks";

import Drawer from "../drawer";
import Explore from "../explore";
import Header from "../header";
import Intro from "../intro";
import Legend from "../legend";
import Map from "../map";
import Story from "../story";
import Toolbar from "../toolbar";
import Watermark from "../watermark";

const App = () => {
  const projects = useProjects(config.projectListUrl);
  const projectMap = {};
  projects.forEach((proj) => (projectMap[proj.name] = proj));

  const searchIndex = useSearchIndex(projects);
  const services = useServices(config.servicesUrl);
  const layers = useLayers(services);
  const [selection, setSelection] = useState({});
  const [mapState, updateMapState] = useHashState(
    {
      scenario: "S07",
      view: "slide-0",
      group: "G500",
      politicalBoundary: null,
      prevYear: null,
      subtype: null,
      year: "50",
    },
    ["prevYear"]
  );
  const [introOpen, setIntroOpen] = useState(mapState.view == "slide-0");

  const layer = config.views[mapState.view].layer;
  const storySlide = mapState.view.startsWith("slide-")
    ? parseInt(mapState.view.replace("slide-", ""), 10)
    : null;
  const setStorySlide = (idx) => {
    updateMapState({ view: idx === null ? "land-change" : `slide-${idx}` });
  };

  const startTour = () => {
    fireEvent("searchClearResult");
    fireEvent("mapFitBounds", {
      bounds: config.mapDefaults.bounds,
      options: {
        padding: config.mapDefaults.padding,
      },
    });
    setStorySlide(0);
  };
  const endTour = () => setStorySlide(null);

  let drawerContent;
  if (storySlide == null) {
    drawerContent = (
      <Explore
        layer={layer}
        projectMap={projectMap}
        projects={projects}
        projectTypeDescriptions={config.projectTypeDescriptions}
        projectTypes={config.projectTypes}
        selection={selection}
        mapState={mapState}
        layers={layers}
        updateMapState={updateMapState}
      />
    );
  } else {
    drawerContent = (
      <Story
        layer={layer}
        layers={layers}
        projectMap={projectMap}
        mapState={mapState}
        slide={storySlide === null ? storySlide : parseInt(storySlide, 10)}
        setSlide={setStorySlide}
        updateMapState={updateMapState}
      />
    );
  }

  const drawerTitle = config.views[mapState.view].title;

  return (
    <div id="app">
      <Header
        endTour={endTour}
        geocodeUrl={config.geocodeUrl}
        searchIndex={searchIndex}
        setSelection={setSelection}
        startTour={startTour}
        storySlide={storySlide}
      />
      <Legend legends={config.legends} layer={layer} />
      <Toolbar
        contactEmail={config.contactEmail}
        setIntroOpen={setIntroOpen}
        websiteUrl={config.websiteUrl}
      />
      <Watermark>DRAFT</Watermark>
      <Map
        {...{
          layer,
          mapDefaults: config.mapDefaults,
          mapState,
          projects,
          selection,
          services,
          servicesUrl: config.servicesUrl,
          updateMapState,
        }}
      />
      <Drawer title={drawerTitle} open={!introOpen}>
        {drawerContent}
      </Drawer>
      <Intro
        endTour={endTour}
        startTour={startTour}
        open={introOpen}
        setOpen={setIntroOpen}
      />
    </div>
  );
};

export default App;
