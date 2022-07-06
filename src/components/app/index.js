import { h } from "preact";
import { useState } from "preact/hooks";

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
import Print from "../print";
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
  const [printing, setPrinting] = useState(false);

  const layer = config.views[mapState.view].layer;
  const storySlide = mapState.view.startsWith("slide-")
    ? parseInt(mapState.view.replace("slide-", ""), 10)
    : null;
  const setStorySlide = (idx) => {
    updateMapState({ view: idx === null ? "land-change" : `slide-${idx}` });
  };

  let drawerContent;
  if (mapState.view === "intro") {
    drawerContent = <Intro setStorySlide={setStorySlide} />;
  } else if (storySlide == null) {
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
        geocodeUrl={config.geocodeUrl}
        searchIndex={searchIndex}
        setSelection={setSelection}
        setStorySlide={setStorySlide}
        storySlide={storySlide}
        printing={printing}
      />
      <Toolbar
        contactEmail={config.contactEmail}
        printing={printing}
        setPrinting={setPrinting}
        updateMapState={updateMapState}
        websiteUrl={config.websiteUrl}
      />
      <Print printing={printing} setPrinting={setPrinting}>
        {printing ? null : <Legend legends={config.legends} layer={layer} />}
        <Watermark>DRAFT</Watermark>
        <Map
          {...{
            layer,
            projects,
            servicesUrl: config.servicesUrl,
            services,
            mapState,
            selection,
            updateMapState,
          }}
        />
      </Print>
      {!printing ? (
        <Drawer title={drawerTitle} open={true}>
          {drawerContent}
        </Drawer>
      ) : null}
    </div>
  );
};

export default App;
